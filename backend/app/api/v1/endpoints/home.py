import random

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.models.users import User
from app.models.meal_plans import MealPlan
from app.models.meal_plan_items import MealPlanItem
from app.models.recipes import Recipe

router = APIRouter(prefix="/home", tags=["Home"])

FUN_QUOTES = [
    "Study hard, snack wisely.",
    "Pasta tomorrow is a problem for future you.",
    "A planned meal is half a solved week.",
    "The fridge is not a mystery box today.",
]


@router.get("/")
def get_home(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    quote = random.choice(FUN_QUOTES)

    meal_plan = (
        db.query(MealPlan)
        .filter(MealPlan.user_id == user.id)
        .order_by(MealPlan.created_at.desc())
        .first()
    )

    if not meal_plan:
        return {
            "quote": quote,
            "meal_plan": None,
            "items": [],
        }

    rows = (
        db.query(MealPlanItem, Recipe)
        .join(Recipe, MealPlanItem.recipe_id == Recipe.id)
        .filter(MealPlanItem.meal_plan_id == meal_plan.id)
        .order_by(MealPlanItem.planned_date, MealPlanItem.meal_slot)
        .all()
    )

    items = []
    for meal_item, recipe in rows:
        items.append(
            {
                "meal_plan_item_id": str(meal_item.id),
                "recipe_id": str(recipe.id),
                "title": recipe.title,
                "meal_slot": meal_item.meal_slot,
                "day_of_week": meal_item.day_of_week,
                "planned_date": meal_item.planned_date.isoformat(),
                "calories": recipe.calories,
                "protein": recipe.protein,
                "carbs": recipe.carbs,
                "fat": recipe.fat,
            }
        )

    return {
        "quote": quote,
        "meal_plan": {
            "id": str(meal_plan.id),
            "start_date": meal_plan.start_date.isoformat(),
            "created_at": meal_plan.created_at.isoformat(),
        },
        "items": items,
    }
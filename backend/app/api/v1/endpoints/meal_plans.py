from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.models.users import User
from app.models.meal_plans import MealPlan
from app.models.meal_plan_items import MealPlanItem
from app.models.recipes import Recipe
from app.schemas.meal_plan import MealPlanCreate

router = APIRouter(prefix="/meal-plans", tags=["Meal Plans"])


@router.post("/")
def create_meal_plan(
    plan: MealPlanCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    latest_allowed_date = plan.start_date + timedelta(days=6)
    seen_slots = set()

    for item in plan.items:
        if item.planned_date < plan.start_date or item.planned_date > latest_allowed_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Meal plan items must be within 7 days from start_date",
            )

        slot_key = (item.planned_date, item.meal_slot.lower())
        if slot_key in seen_slots:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Duplicate meal slot for {item.planned_date} and {item.meal_slot}",
            )
        seen_slots.add(slot_key)

        recipe = db.query(Recipe).filter(Recipe.id == item.recipe_id).first()
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe not found: {item.recipe_id}",
            )

    meal_plan = MealPlan(
        user_id=user.id,
        start_date=plan.start_date,
    )

    db.add(meal_plan)
    db.flush()

    created_items = []

    for item in plan.items:
        meal_item = MealPlanItem(
            meal_plan_id=meal_plan.id,
            recipe_id=item.recipe_id,
            meal_slot=item.meal_slot,
            planned_date=item.planned_date,
            day_of_week=item.day_of_week,
        )
        db.add(meal_item)
        created_items.append(meal_item)

    db.commit()
    db.refresh(meal_plan)

    return {
        "meal_plan_id": str(meal_plan.id),
        "start_date": meal_plan.start_date.isoformat(),
        "items_count": len(created_items),
    }
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, status

from app.schemas.meal_plan import MealPlanCreate, MealPlanResponse

router = APIRouter(prefix="/meal-plans", tags=["Meal Plans"])


@router.post("/", response_model=MealPlanResponse, status_code=status.HTTP_201_CREATED)
def create_meal_plan(plan: MealPlanCreate):
    meal_plan_id = uuid4()

    return {
        "id": meal_plan_id,
        "user_id": plan.user_id,
        "start_date": plan.start_date,
        "created_at": datetime.now(timezone.utc),
        "items": [
            {
                "id": uuid4(),
                "meal_plan_id": meal_plan_id,
                "recipe_id": item.recipe_id,
                "day_of_week": item.day_of_week,
                "meal_slot": item.meal_slot,
                "planned_date": item.planned_date,
            }
            for item in plan.items
        ],
    }

from fastapi import APIRouter, status
from app.schemas.weekly_plans import WeeklyPlanCreate, WeeklyPlanResponse, MealItem

router = APIRouter()


@router.post("/weekly-plans", status_code=status.HTTP_201_CREATED, response_model=WeeklyPlanResponse)
def create_weekly_plan(payload: WeeklyPlanCreate):
    """
    Create a weekly meal plan for a user.
    Later this should save the plan into the database.
    """
    return WeeklyPlanResponse(
        user_id=payload.user_id,
        week_start_date=payload.week_start_date,
        meals=payload.meals
    )


@router.get("/weekly-plans/current", response_model=WeeklyPlanResponse)
def get_current_weekly_plan(user_id: int = 1):
    """
    Get the current week's meal plan.
    Later this should fetch data from the database.
    """
    return WeeklyPlanResponse(
        user_id=user_id,
        week_start_date="2026-03-16",
        meals=[
            MealItem(
                day="Monday",
                meal_type="Lunch",
                dish_name="Chicken Fried Rice",
                notes="Quick and cheap"
            ),
            MealItem(
                day="Tuesday",
                meal_type="Dinner",
                dish_name="Beef Potato Skillet",
                notes="Use the pan only"
            )
        ]
    )
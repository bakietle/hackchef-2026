from fastapi import APIRouter
from app.schemas.meal_plan import MealPlanCreate

router = APIRouter(prefix="/meal-plans", tags=["Meal Plans"])


@router.post("/")
def create_meal_plan(plan: MealPlanCreate):

    return {
        "message": "Meal plan saved",
        "plan": plan
    }
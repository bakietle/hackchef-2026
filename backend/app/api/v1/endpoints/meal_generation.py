from fastapi import APIRouter

from app.schemas.meal_plan_request import MealPlanRequestCreate
from app.schemas.recipe import RecipeCardResponse

router = APIRouter(prefix="/meal-generation", tags=["Meal Generation"])


@router.post("/generate", response_model=list[RecipeCardResponse])
def generate_recipes(request: MealPlanRequestCreate):
    return [
        {
            "id": "11111111-1111-1111-1111-111111111111",
            "title": f"{request.mode or 'balanced'} chicken bowl",
            "calories": 520,
            "protein": 38,
            "carbs": 46,
            "fat": 18,
        },
        {
            "id": "22222222-2222-2222-2222-222222222222",
            "title": f"{request.dietary or 'everyday'} tofu stir fry",
            "calories": 430,
            "protein": 24,
            "carbs": 41,
            "fat": 17,
        },
        {
            "id": "33333333-3333-3333-3333-333333333333",
            "title": "quick tuna pasta",
            "calories": 490,
            "protein": 32,
            "carbs": 55,
            "fat": 14,
        },
    ]

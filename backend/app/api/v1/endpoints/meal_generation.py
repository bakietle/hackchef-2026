from fastapi import APIRouter
from app.schemas.meal_plan_request import MealGenerationRequest

router = APIRouter(prefix="/meal-generation", tags=["Meal Generation"])


@router.post("/generate")
def generate_recipes(request: MealGenerationRequest):

    # later call AI
    recipes = []

    for i in range(35):
        recipes.append({
            "id": i,
            "name": f"Recipe {i}"
        })

    return {
        "recipes": recipes
    }
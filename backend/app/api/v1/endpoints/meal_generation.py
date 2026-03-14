from fastapi import APIRouter
from app.schemas.meal_plan_request import MealGenerationRequest

router = APIRouter(prefix="/meal-generation", tags=["Meal Generation"])


@router.post("/generate")
def generate_recipes(request: MealGenerationRequest):

    # later call AI
    recipes = []

    for i in range(35):
        recipes.append({
            "id": i+1,
            "name": f"Recipe {i+1}",
            "nutrition_summary": "High protein, balanced carbs",
            "ingredients": "Eggs, rice, chicken, vegetables",
            "instructions": "Cook ingredients and serve"
        })

    return {
        "recipes": recipes
    }
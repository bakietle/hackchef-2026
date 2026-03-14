from uuid import UUID

from fastapi import APIRouter

from app.schemas.recipe import RecipeDetailResponse

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.get("/{recipe_id}", response_model=RecipeDetailResponse)
def get_recipe(recipe_id: UUID):
    return {
        "id": recipe_id,
        "request_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "title": "Chicken Rice Bowl",
        "ingredients": ["chicken breast", "rice", "soy sauce", "broccoli"],
        "steps": [
            "Cook the rice until fluffy.",
            "Pan-sear the chicken with seasoning.",
            "Steam the broccoli.",
            "Serve everything together with soy sauce.",
        ],
        "calories": 450,
        "protein": 35,
        "carbs": 42,
        "fat": 12,
    }

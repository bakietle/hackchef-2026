from fastapi import APIRouter

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.get("/{recipe_id}")
def get_recipe(recipe_id: int):

    return {
        "id": recipe_id,
        "name": "Chicken Rice Bowl",
        "nutrition": "450 kcal",
        "ingredients": ["chicken", "rice", "soy sauce"],
        "steps": [
            "Cook rice",
            "Cook chicken",
            "Mix together"
        ]
    }
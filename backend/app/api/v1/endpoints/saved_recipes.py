from fastapi import APIRouter

router = APIRouter(prefix="/saved-recipes", tags=["Saved Recipes"])


@router.post("/")
def save_recipe(recipe_id: int, user_id: int):

    return {
        "message": "Recipe saved"
    }


@router.get("/{user_id}")
def get_saved_recipes(user_id: int):

    return []
from datetime import datetime, timezone
from uuid import UUID, uuid4

from fastapi import APIRouter, status

from app.schemas.saved_recipe import SavedRecipeCreate, SavedRecipeResponse

router = APIRouter(prefix="/saved-recipes", tags=["Saved Recipes"])


@router.post("/", response_model=SavedRecipeResponse, status_code=status.HTTP_201_CREATED)
def save_recipe(payload: SavedRecipeCreate):
    return {
        "id": uuid4(),
        "user_id": payload.user_id,
        "recipe_id": payload.recipe_id,
        "created_at": datetime.now(timezone.utc),
    }


@router.get("/{user_id}", response_model=list[SavedRecipeResponse])
def get_saved_recipes(user_id: UUID):
    return [
        {
            "id": "ffffffff-ffff-ffff-ffff-ffffffffffff",
            "user_id": user_id,
            "recipe_id": "11111111-1111-1111-1111-111111111111",
            "created_at": datetime.now(timezone.utc),
        }
    ]

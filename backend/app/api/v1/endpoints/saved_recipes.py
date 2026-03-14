from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.models.users import User
from app.models.recipes import Recipe
from app.models.saved_recipes import SavedRecipe
from app.models.meal_plan_requests import MealPlanRequest
from app.schemas.saved_recipe import SaveRecipeRequest, SavedRecipeResponse

router = APIRouter(prefix="/saved-recipes", tags=["Saved Recipes"])


@router.post("/", response_model=SavedRecipeResponse)
def save_recipe(
    payload: SaveRecipeRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipe = (
        db.query(Recipe)
        .join(MealPlanRequest, Recipe.request_id == MealPlanRequest.id)
        .filter(
            Recipe.id == payload.recipe_id,
            MealPlanRequest.user_id == user.id,
        )
        .first()
    )

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found for this user",
        )

    already_saved = (
        db.query(SavedRecipe)
        .filter(
            SavedRecipe.user_id == user.id,
            SavedRecipe.recipe_id == payload.recipe_id,
        )
        .first()
    )

    if already_saved:
        return already_saved

    saved = SavedRecipe(
        user_id=user.id,
        recipe_id=payload.recipe_id,
    )

    db.add(saved)
    db.commit()
    db.refresh(saved)

    return saved


@router.get("/")
def get_saved_recipes(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(SavedRecipe, Recipe)
        .join(Recipe, SavedRecipe.recipe_id == Recipe.id)
        .filter(SavedRecipe.user_id == user.id)
        .order_by(SavedRecipe.created_at.desc())
        .all()
    )

    return {
        "items": [
            {
                "saved_recipe_id": str(saved.id),
                "recipe_id": str(recipe.id),
                "title": recipe.title,
                "ingredients": recipe.ingredients,
                "steps": recipe.steps,
                "calories": recipe.calories,
                "protein": recipe.protein,
                "carbs": recipe.carbs,
                "fat": recipe.fat,
                "saved_at": saved.created_at.isoformat(),
            }
            for saved, recipe in rows
        ]
    }


@router.delete("/{recipe_id}")
def unsave_recipe(
    recipe_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    saved = (
        db.query(SavedRecipe)
        .filter(
            SavedRecipe.user_id == user.id,
            SavedRecipe.recipe_id == recipe_id,
        )
        .first()
    )

    if not saved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved recipe not found",
        )

    db.delete(saved)
    db.commit()

    return {
        "status": "removed",
        "recipe_id": str(recipe_id),
    }
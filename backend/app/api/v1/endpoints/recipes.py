from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.users import User
from app.models.meal_plan_requests import MealPlanRequest
from app.models.recipes import Recipe
from app.services.ai_recipe_service import generate_and_save_recipes
from app.services.recipe_deck_service import regenerate_recipe_deck

router = APIRouter(prefix="/recipes", tags=["Recipes"])

def get_user_from_header(
    x_user_id: str | None = Header(default=None, alias="X-User-ID"),
    db: Session = Depends(get_db),
) -> User:
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing X-User-ID header.")

    user = db.query(User).filter(User.id == x_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return user


def serialize_recipe(recipe: Recipe):
    return {
        "id": str(recipe.id),
        "title": recipe.title,
        "ingredients": recipe.ingredients,
        "steps": recipe.steps,
        "calories": recipe.calories,
        "protein": recipe.protein,
        "carbs": recipe.carbs,
        "fat": recipe.fat,
        "funfacts": recipe.funfacts,
    }

@router.post("/generate/{request_id}")
def generate_recipes(
    request_id: UUID,
    user: User = Depends(get_user_from_header),
    db: Session = Depends(get_db),
):
    request_row = (
        db.query(MealPlanRequest)
        .filter(
            MealPlanRequest.id == request_id,
            MealPlanRequest.user_id == user.id,
        )
        .first()
    )

    if not request_row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan request not found",
        )

    recipes = generate_and_save_recipes(
        db=db,
        request_row=request_row,
        recipe_count=35,
    )

    return {
        "request_id": str(request_id),
        "recipes": [serialize_recipe(recipe) for recipe in recipes],
    }

@router.post("/regenerate/{request_id}")
def regenerate_recipes(
    request_id: UUID,
    user: User = Depends(get_user_from_header),
    db: Session = Depends(get_db),
):
    request_row = (
        db.query(MealPlanRequest)
        .filter(
            MealPlanRequest.id == request_id,
            MealPlanRequest.user_id == user.id,
        )
        .first()
    )

    if not request_row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan request not found",
        )

    try:
        recipes = regenerate_recipe_deck(db, request_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    return {
        "request_id": str(request_id),
        "recipes": [serialize_recipe(recipe) for recipe in recipes],
    }

@router.get("/request/{request_id}")
def get_recipes(
    request_id: UUID,
    user: User = Depends(get_user_from_header),
    db: Session = Depends(get_db),
):
    request_row = (
        db.query(MealPlanRequest)
        .filter(
            MealPlanRequest.id == request_id,
            MealPlanRequest.user_id == user.id,
        )
        .first()
    )

    if not request_row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan request not found",
        )

    recipes = db.query(Recipe).filter(Recipe.request_id == request_id).all()

    return {
        "request_id": str(request_id),
        "recipes": [serialize_recipe(recipe) for recipe in recipes],
    }


@router.get("/{recipe_id}")
def get_recipe_detail(
    recipe_id: UUID,
    user: User = Depends(get_user_from_header),
    db: Session = Depends(get_db),
):
    recipe = (
        db.query(Recipe)
        .join(MealPlanRequest, Recipe.request_id == MealPlanRequest.id)
        .filter(
            Recipe.id == recipe_id,
            MealPlanRequest.user_id == user.id,
        )
        .first()
    )

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found for this user",
        )

    return {
        "id": str(recipe.id),
        "request_id": str(recipe.request_id),
        "title": recipe.title,
        "ingredients": recipe.ingredients,
        "steps": recipe.steps,
        "calories": recipe.calories,
        "protein": recipe.protein,
        "carbs": recipe.carbs,
        "fat": recipe.fat,
        "funfacts":recipe.funfacts,
    }
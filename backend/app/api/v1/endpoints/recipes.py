from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.models.users import User
from app.models.meal_plan_requests import MealPlanRequest
from app.models.recipes import Recipe

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.post("/generate/{request_id}")
def generate_recipes(
    request_id: UUID,
    user: User = Depends(get_current_user),
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

    # Optional: clear previously generated recipes for this request
    db.query(Recipe).filter(Recipe.request_id == request_id).delete(synchronize_session=False)

    mode_label = request_row.mode.replace("_", " ").title()

    for i in range(35):
        recipe = Recipe(
            request_id=request_id,
            title=f"{mode_label} Recipe {i + 1}",
            ingredients=[
                "ingredient1",
                "ingredient2",
                "ingredient3",
            ],
            steps=[
                "Step 1: Prepare ingredients",
                "Step 2: Cook everything",
                "Step 3: Serve and enjoy",
            ],
            calories=350 + i,
            protein=20,
            carbs=40,
            fat=10,
        )
        db.add(recipe)

    db.commit()

    recipes = (
        db.query(Recipe)
        .filter(Recipe.request_id == request_id)
        .order_by(Recipe.title)
        .all()
    )

    return {
        "request_id": str(request_id),
        "recipes": [
            {
                "id": str(recipe.id),
                "title": recipe.title,
                "ingredients": recipe.ingredients,
                "steps": recipe.steps,
                "calories": recipe.calories,
                "protein": recipe.protein,
                "carbs": recipe.carbs,
                "fat": recipe.fat,
            }
            for recipe in recipes
        ],
    }


@router.get("/request/{request_id}")
def get_recipes(
    request_id: UUID,
    user: User = Depends(get_current_user),
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

    recipes = (
        db.query(Recipe)
        .filter(Recipe.request_id == request_id)
        .order_by(Recipe.title)
        .all()
    )

    return {
        "request_id": str(request_id),
        "recipes": [
            {
                "id": str(recipe.id),
                "title": recipe.title,
                "ingredients": recipe.ingredients,
                "steps": recipe.steps,
                "calories": recipe.calories,
                "protein": recipe.protein,
                "carbs": recipe.carbs,
                "fat": recipe.fat,
            }
            for recipe in recipes
        ],
    }
from sqlalchemy.orm import Session

from app.models.meal_plan_requests import MealPlanRequest
from app.models.recipes import Recipe
from app.services.ai_recipe_service import generate_and_save_recipes


def create_recipe_deck(db: Session, request_id, recipe_count: int = 35):
    meal_request = (
        db.query(MealPlanRequest)
        .filter(MealPlanRequest.id == request_id)
        .first()
    )

    if not meal_request:
        raise ValueError("Meal plan request not found.")

    saved_recipes = generate_and_save_recipes(
        db=db,
        request_row=meal_request,
        recipe_count=recipe_count,
    )
    return saved_recipes


def regenerate_recipe_deck(db: Session, request_id, recipe_count: int = 35):
    meal_request = (
        db.query(MealPlanRequest)
        .filter(MealPlanRequest.id == request_id)
        .first()
    )

    if not meal_request:
        raise ValueError("Meal plan request not found.")

    saved_recipes = generate_and_save_recipes(
        db=db,
        request_row=meal_request,
        recipe_count=recipe_count,
    )
    return saved_recipes


def get_recipe_deck(db: Session, request_id):
    return (
        db.query(Recipe)
        .filter(Recipe.request_id == request_id)
        .all()
    )
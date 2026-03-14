from sqlalchemy.orm import Session

from app.models.meal_plan_requests import MealPlanRequest
from app.services.ai_recipe_service import generate_recipes_from_request
from app.services.recipe_service import (
    save_generated_recipes,
    get_recipes_by_request_id,
    delete_recipes_by_request_id,
)


def create_recipe_deck(db: Session, request_id):
    meal_request = (
        db.query(MealPlanRequest)
        .filter(MealPlanRequest.id == request_id)
        .first()
    )

    if not meal_request:
        raise ValueError("Meal plan request not found.")

    ai_recipes = generate_recipes_from_request(meal_request)
    saved_recipes = save_generated_recipes(db, request_id, ai_recipes)
    return saved_recipes


def regenerate_recipe_deck(db: Session, request_id):
    meal_request = (
        db.query(MealPlanRequest)
        .filter(MealPlanRequest.id == request_id)
        .first()
    )

    if not meal_request:
        raise ValueError("Meal plan request not found.")

    delete_recipes_by_request_id(db, request_id)
    ai_recipes = generate_recipes_from_request(meal_request)
    saved_recipes = save_generated_recipes(db, request_id, ai_recipes)
    return saved_recipes


def get_recipe_deck(db: Session, request_id):
    return get_recipes_by_request_id(db, request_id)

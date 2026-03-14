from fastapi import APIRouter

from app.api.v1.endpoints import (
    meal_generation,
    meal_plans,
    recipes,
    saved_recipes,
    shopping,
    users,
)

api_router = APIRouter()

api_router.include_router(users.router)
api_router.include_router(meal_generation.router)
api_router.include_router(recipes.router)
api_router.include_router(meal_plans.router)
api_router.include_router(shopping.router)
api_router.include_router(saved_recipes.router)

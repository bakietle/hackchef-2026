from fastapi import FastAPI

from app.api.v1.endpoints.home import router as home_router
from app.api.v1.endpoints.meal_plan_requests import router as meal_plan_requests_router
from app.api.v1.endpoints.recipes import router as recipes_router
from app.api.v1.endpoints.meal_plans import router as meal_plans_router
from app.api.v1.endpoints.shopping import router as shopping_router
from app.api.v1.endpoints.saved_recipes import router as saved_recipes_router
from app.api.v1.endpoints.users import router as users_router

app = FastAPI()

app.include_router(users_router)
app.include_router(home_router)
app.include_router(meal_plan_requests_router)
app.include_router(recipes_router)
app.include_router(meal_plans_router)
app.include_router(shopping_router)
app.include_router(saved_recipes_router)
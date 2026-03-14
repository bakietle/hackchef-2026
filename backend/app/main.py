from fastapi import FastAPI
from app.api.v1.api import api_router
from app.endpoints import users
from app.endpoints import meal_generation
from app.endpoints import recipes
from app.endpoints import meal_plans
from app.endpoints import home
from app.endpoints import shopping
from app.endpoints import saved_recipes

app = FastAPI(title="HackChef Backend")

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "HackChef backend is running"}

app.include_router(users.router)
app.include_router(meal_generation.router)
app.include_router(recipes.router)
app.include_router(meal_plans.router)
app.include_router(home.router)
app.include_router(shopping.router)
app.include_router(saved_recipes.router)
from fastapi import APIRouter
from app.api.v1.endpoints import auth,weekly_plans, preferences

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(weekly_plans.router, tags=["Weekly Plans"])
api_router.include_router(preferences.router, tags=["Preferences"])
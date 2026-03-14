from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    UserResponse as AuthUserResponse,
)
from app.schemas.meal_plan import (
    MealPlanCreate,
    MealPlanItemCreate,
    MealPlanItemResponse,
    MealPlanResponse,
)
from app.schemas.meal_plan_request import (
    MealPlanRequestCreate,
    MealPlanRequestResponse,
)
from app.schemas.recipe import RecipeCardResponse, RecipeDetailResponse
from app.schemas.saved_recipe import SavedRecipeCreate, SavedRecipeResponse
from app.schemas.shopping import ShoppingListItemResponse, ShoppingListResponse
from app.schemas.user import UserCreate, UserResponse
from app.schemas.preferences import PreferenceCreate, PreferenceResponse
from app.schemas.weekly_plans import MealItem, WeeklyPlanCreate, WeeklyPlanResponse

__all__ = [
    "RegisterRequest",
    "RegisterResponse",
    "LoginRequest",
    "LoginResponse",
    "AuthUserResponse",
    "PreferenceCreate",
    "PreferenceResponse",
    "MealItem",
    "WeeklyPlanCreate",
    "WeeklyPlanResponse",
    "UserCreate",
    "UserResponse",
    "MealPlanRequestCreate",
    "MealPlanRequestResponse",
    "RecipeCardResponse",
    "RecipeDetailResponse",
    "MealPlanItemCreate",
    "MealPlanCreate",
    "MealPlanItemResponse",
    "MealPlanResponse",
    "ShoppingListItemResponse",
    "ShoppingListResponse",
    "SavedRecipeCreate",
    "SavedRecipeResponse",
]

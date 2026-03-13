from fastapi import APIRouter, status
from app.schemas.preferences import PreferenceCreate, PreferenceResponse

router = APIRouter()


@router.post("/preferences", status_code=status.HTTP_201_CREATED, response_model=PreferenceResponse)
def save_preferences(payload: PreferenceCreate):
    """
    Save or update user preferences.
    Later this should write into the database.
    """
    return PreferenceResponse(
        user_id=payload.user_id,
        cook_time=payload.cook_time,
        budget_per_meal=payload.budget_per_meal,
        mode=payload.mode,
        cuisine=payload.cuisine,
        kitchenware=payload.kitchenware
    )


@router.get("/preferences/me", response_model=PreferenceResponse)
def get_my_preferences(user_id: int = 1):
    """
    Fetch current user's saved preferences.
    Later this should read from the database.
    """
    return PreferenceResponse(
        user_id=user_id,
        cook_time=20,
        budget_per_meal=5.0,
        mode="broke mode",
        cuisine=["Asian", "Western"],
        kitchenware=["pan", "pot"]
    )
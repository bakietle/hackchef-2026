from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.models.users import User
from app.models.meal_plan_requests import MealPlanRequest
from app.schemas.meal_plan_request import (
    MealPlanRequestCreate,
    MealPlanRequestUpdate,
)

router = APIRouter(prefix="/meal-plan-requests", tags=["Meal Plan Requests"])


@router.post("/")
def create_request(
    request: MealPlanRequestCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_request = MealPlanRequest(
        user_id=user.id,
        mode=request.mode.value,
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return {
        "request_id": str(new_request.id),
        "mode": new_request.mode,
    }


@router.patch("/{request_id}")
def update_request(
    request_id: UUID,
    request: MealPlanRequestUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_request = (
        db.query(MealPlanRequest)
        .filter(
            MealPlanRequest.id == request_id,
            MealPlanRequest.user_id == user.id,
        )
        .first()
    )

    if not meal_request:
        raise HTTPException(status_code=404, detail="Meal plan request not found")

    if request.budget_per_meal is not None:
        meal_request.budget_per_meal = request.budget_per_meal

    if request.time_per_meal is not None:
        meal_request.time_per_meal = request.time_per_meal

    if request.cuisine_type is not None:
        meal_request.cuisine_type = request.cuisine_type

    if request.dietary is not None:
        meal_request.dietary = request.dietary

    db.commit()
    db.refresh(meal_request)

    return {
        "request_id": str(meal_request.id),
        "budget_per_meal": meal_request.budget_per_meal,
        "time_per_meal": meal_request.time_per_meal,
        "cuisine_type": meal_request.cuisine_type,
        "dietary": meal_request.dietary,
        "mode": meal_request.mode,
        "created_at": meal_request.created_at.isoformat(),
    }


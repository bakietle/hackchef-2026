from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.models.users import User
from app.models.meal_plan_requests import MealPlanRequest
from app.schemas.meal_plan_request import MealPlanRequestCreate

router = APIRouter(prefix="/meal-plan-requests", tags=["Meal Plan Requests"])


@router.post("/")
def create_request(
    request: MealPlanRequestCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_request = MealPlanRequest(
        user_id=user.id,
        budget_per_meal=request.budget_per_meal,
        time_per_meal=request.time_per_meal,
        dietary=request.dietary,
        mode=request.mode,
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return {
        "request_id": str(new_request.id),
        "budget_per_meal": new_request.budget_per_meal,
        "time_per_meal": new_request.time_per_meal,
        "dietary": new_request.dietary,
        "mode": new_request.mode,
    }
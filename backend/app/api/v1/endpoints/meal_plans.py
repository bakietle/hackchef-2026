from datetime import timedelta

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.users import User
from app.models.meal_plans import MealPlan
from app.models.meal_plan_items import MealPlanItem
from app.models.recipes import Recipe
from app.schemas.meal_plan import MealPlanCreate

router = APIRouter(prefix="/meal-plans", tags=["Meal Plans"])


def get_user_from_header(
    x_user_id: str | None = Header(default=None, alias="X-User-ID"),
    db: Session = Depends(get_db),
) -> User:
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing X-User-ID header.")

    user = db.query(User).filter(User.id == x_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return user


def compute_day_of_week_value(planned_date):
    """
    Return Python weekday integer:
    Monday = 0, Sunday = 6
    """
    return planned_date.weekday()


@router.post("/")
def create_meal_plan(
    plan: MealPlanCreate,
    user: User = Depends(get_user_from_header),
    db: Session = Depends(get_db),
):
    latest_allowed_date = plan.start_date + timedelta(days=6)
    seen_slots = set()

    for item in plan.items:
        if item.planned_date < plan.start_date or item.planned_date > latest_allowed_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Meal plan items must be within 7 days from start_date",
            )

        normalized_slot = item.meal_slot.lower().strip()
        slot_key = (item.planned_date, normalized_slot)

        if slot_key in seen_slots:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Duplicate meal slot for {item.planned_date} and {item.meal_slot}",
            )
        seen_slots.add(slot_key)

        recipe = db.query(Recipe).filter(Recipe.id == item.recipe_id).first()
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe not found: {item.recipe_id}",
            )

    meal_plan = MealPlan(user_id=user.id)

    if hasattr(meal_plan, "start_date"):
        meal_plan.start_date = plan.start_date
    elif hasattr(meal_plan, "week_start"):
        meal_plan.week_start = plan.start_date

    db.add(meal_plan)
    db.flush()

    created_items = []

    day_of_week_column = MealPlanItem.__table__.columns.get("day_of_week")
    day_of_week_is_integer = False

    if day_of_week_column is not None:
        try:
            day_of_week_is_integer = day_of_week_column.type.python_type is int
        except Exception:
            day_of_week_is_integer = False

    for item in plan.items:
        meal_item = MealPlanItem(
            meal_plan_id=meal_plan.id,
            recipe_id=item.recipe_id,
            meal_slot=item.meal_slot.lower().strip(),
        )

        if hasattr(meal_item, "planned_date"):
            meal_item.planned_date = item.planned_date
        elif hasattr(meal_item, "plan_date"):
            meal_item.plan_date = item.planned_date

        if hasattr(meal_item, "day_of_week"):
            if day_of_week_is_integer:
                meal_item.day_of_week = compute_day_of_week_value(item.planned_date)
            else:
                meal_item.day_of_week = item.planned_date.strftime("%A")

        db.add(meal_item)
        created_items.append(meal_item)

    db.commit()
    db.refresh(meal_plan)

    response_start_date = None
    if hasattr(meal_plan, "start_date") and meal_plan.start_date:
        response_start_date = meal_plan.start_date.isoformat()
    elif hasattr(meal_plan, "week_start") and meal_plan.week_start:
        response_start_date = meal_plan.week_start.isoformat()

    return {
        "meal_plan_id": str(meal_plan.id),
        "start_date": response_start_date,
        "items_count": len(created_items),
    }
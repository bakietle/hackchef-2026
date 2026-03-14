from datetime import date
from sqlalchemy.orm import Session

from app.models.meal_plans import MealPlan
from app.models.meal_plan_items import MealPlanItem


def create_meal_plan(db: Session, user_id, start_date: date | None = None):
    meal_plan = MealPlan(
        user_id=user_id,
        week_start=start_date,
    )
    db.add(meal_plan)
    db.commit()
    db.refresh(meal_plan)
    return meal_plan


def get_meal_plan_by_id(db: Session, meal_plan_id):
    return (
        db.query(MealPlan)
        .filter(MealPlan.id == meal_plan_id)
        .first()
    )


def add_recipe_to_slot(
    db: Session,
    meal_plan_id,
    recipe_id,
    plan_date: date,
    meal_slot: str,
):
    existing_item = (
        db.query(MealPlanItem)
        .filter(
            MealPlanItem.meal_plan_id == meal_plan_id,
            MealPlanItem.plan_date == plan_date,
            MealPlanItem.meal_slot == meal_slot,
        )
        .first()
    )

    if existing_item:
        existing_item.recipe_id = recipe_id
        db.commit()
        db.refresh(existing_item)
        return existing_item

    item = MealPlanItem(
        meal_plan_id=meal_plan_id,
        recipe_id=recipe_id,
        plan_date=plan_date,
        meal_slot=meal_slot,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_recipe_from_slot(
    db: Session,
    meal_plan_id,
    plan_date: date,
    meal_slot: str,
):
    item = (
        db.query(MealPlanItem)
        .filter(
            MealPlanItem.meal_plan_id == meal_plan_id,
            MealPlanItem.plan_date == plan_date,
            MealPlanItem.meal_slot == meal_slot,
        )
        .first()
    )

    if item:
        db.delete(item)
        db.commit()

    return item


def get_items_for_meal_plan(db: Session, meal_plan_id):
    return (
        db.query(MealPlanItem)
        .filter(MealPlanItem.meal_plan_id == meal_plan_id)
        .all()
    )


def get_latest_meal_plan_for_user(db: Session, user_id):
    return (
        db.query(MealPlan)
        .filter(MealPlan.user_id == user_id)
        .order_by(MealPlan.created_at.desc())
        .first()
    )

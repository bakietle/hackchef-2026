from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.models.users import User
from app.models.meal_plans import MealPlan
from app.models.meal_plan_items import MealPlanItem
from app.models.recipes import Recipe
from app.models.shopping_lists import ShoppingList
from app.models.shopping_list_items import ShoppingListItem

router = APIRouter(prefix="/shopping-list", tags=["Shopping List"])


def _get_owned_meal_plan(meal_plan_id: UUID, user_id: UUID, db: Session) -> MealPlan:
    meal_plan = (
        db.query(MealPlan)
        .filter(
            MealPlan.id == meal_plan_id,
            MealPlan.user_id == user_id,
        )
        .first()
    )

    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found",
        )

    return meal_plan


def _extract_ingredient_name(raw_ingredient) -> str:
    if isinstance(raw_ingredient, str):
        return raw_ingredient.strip()

    if isinstance(raw_ingredient, dict):
        return str(
            raw_ingredient.get("name")
            or raw_ingredient.get("ingredient")
            or raw_ingredient.get("item")
            or ""
        ).strip()

    return str(raw_ingredient).strip()


@router.post("/{meal_plan_id}")
def generate_shopping_list(
    meal_plan_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_plan = _get_owned_meal_plan(meal_plan_id, user.id, db)

    shopping_list = (
        db.query(ShoppingList)
        .filter(ShoppingList.meal_plan_id == meal_plan.id)
        .first()
    )

    if not shopping_list:
        shopping_list = ShoppingList(meal_plan_id=meal_plan.id)
        db.add(shopping_list)
        db.flush()
    else:
        db.query(ShoppingListItem).filter(
            ShoppingListItem.shopping_list_id == shopping_list.id
        ).delete(synchronize_session=False)

    meal_items = (
        db.query(MealPlanItem)
        .filter(MealPlanItem.meal_plan_id == meal_plan.id)
        .all()
    )

    seen_ingredients = set()
    created_items = []

    for meal_item in meal_items:
        recipe = db.query(Recipe).filter(Recipe.id == meal_item.recipe_id).first()
        if not recipe:
            continue

        for ingredient in recipe.ingredients:
            ingredient_name = _extract_ingredient_name(ingredient)
            if not ingredient_name:
                continue

            normalized = ingredient_name.lower()
            if normalized in seen_ingredients:
                continue

            seen_ingredients.add(normalized)

            list_item = ShoppingListItem(
                shopping_list_id=shopping_list.id,
                ingredient_name=ingredient_name,
            )
            db.add(list_item)
            created_items.append(list_item)

    db.commit()

    return {
        "shopping_list_id": str(shopping_list.id),
        "meal_plan_id": str(meal_plan.id),
        "items": [
            {
                "id": str(item.id),
                "ingredient_name": item.ingredient_name,
                "checked": item.checked,
            }
            for item in created_items
        ],
    }


@router.get("/{meal_plan_id}")
def get_shopping_list(
    meal_plan_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meal_plan = _get_owned_meal_plan(meal_plan_id, user.id, db)

    shopping_list = (
        db.query(ShoppingList)
        .filter(ShoppingList.meal_plan_id == meal_plan.id)
        .first()
    )

    if not shopping_list:
        return {
            "shopping_list_id": None,
            "meal_plan_id": str(meal_plan.id),
            "items": [],
        }

    items = (
        db.query(ShoppingListItem)
        .filter(ShoppingListItem.shopping_list_id == shopping_list.id)
        .order_by(ShoppingListItem.ingredient_name)
        .all()
    )

    return {
        "shopping_list_id": str(shopping_list.id),
        "meal_plan_id": str(meal_plan.id),
        "items": [
            {
                "id": str(item.id),
                "ingredient_name": item.ingredient_name,
                "checked": item.checked,
            }
            for item in items
        ],
    }


@router.patch("/item/{item_id}")
def toggle_item(
    item_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(ShoppingListItem)
        .join(ShoppingList, ShoppingListItem.shopping_list_id == ShoppingList.id)
        .join(MealPlan, ShoppingList.meal_plan_id == MealPlan.id)
        .filter(
            ShoppingListItem.id == item_id,
            MealPlan.user_id == user.id,
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping list item not found",
        )

    item.checked = not item.checked
    db.commit()
    db.refresh(item)

    return {
        "id": str(item.id),
        "ingredient_name": item.ingredient_name,
        "checked": item.checked,
    }
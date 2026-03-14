from collections import OrderedDict
from sqlalchemy.orm import Session

from app.models.meal_plan_items import MealPlanItem
from app.models.recipes import Recipe


def _extract_ingredient_name(ingredient):
    if isinstance(ingredient, str):
        return ingredient.strip().lower()

    if isinstance(ingredient, dict):
        return str(ingredient.get("name", "")).strip().lower()

    return ""


def generate_shopping_list(db: Session, meal_plan_id):
    meal_plan_items = (
        db.query(MealPlanItem)
        .filter(MealPlanItem.meal_plan_id == meal_plan_id)
        .all()
    )

    recipe_ids = [item.recipe_id for item in meal_plan_items]
    if not recipe_ids:
        return []

    recipes = db.query(Recipe).filter(Recipe.id.in_(recipe_ids)).all()

    unique_items = OrderedDict()

    for recipe in recipes:
        ingredients = recipe.ingredients or []

        for ingredient in ingredients:
            item_name = _extract_ingredient_name(ingredient)
            if item_name and item_name not in unique_items:
                unique_items[item_name] = {
                    "name": item_name,
                    "checked": False,
                }

    return list(unique_items.values())

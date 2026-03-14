import json
import os
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy.orm import Session

from app.models.meal_plan_requests import MealPlanRequest
from app.models.recipes import Recipe
from app.utils.prompt_builder import build_recipe_generation_prompt

load_dotenv()

DEFAULT_RECIPE_COUNT = 35


def _get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is missing")
    return OpenAI(api_key=api_key)


def _safe_int(value: Any, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _normalize_list(value: Any, fallback: list[str]) -> list[str]:
    if isinstance(value, list):
        cleaned = [str(item).strip() for item in value if str(item).strip()]
        return cleaned if cleaned else fallback

    if isinstance(value, str) and value.strip():
        return [value.strip()]

    return fallback


def _normalize_recipe(raw_recipe: dict[str, Any], index: int) -> dict[str, Any]:
    title = str(raw_recipe.get("title") or f"Recipe {index}").strip()

    ingredients = _normalize_list(
        raw_recipe.get("ingredients"),
        fallback=["rice", "egg", "soy sauce"],
    )

    steps = _normalize_list(
        raw_recipe.get("steps"),
        fallback=["Prepare ingredients", "Cook everything", "Serve"],
    )

    return {
        "title": title,
        "ingredients": ingredients,
        "steps": steps,
        "calories": _safe_int(raw_recipe.get("calories"), 400),
        "protein": _safe_int(raw_recipe.get("protein"), 20),
        "carbs": _safe_int(raw_recipe.get("carbs"), 45),
        "fat": _safe_int(raw_recipe.get("fat"), 12),
        "funfacts": str(raw_recipe.get("funfacts", "")).strip() or None,
    }


def _build_demo_recipes(
    request_row: MealPlanRequest,
    recipe_count: int = DEFAULT_RECIPE_COUNT,
) -> list[dict[str, Any]]:
    mode_label = request_row.mode.replace("_", " ").title()
    dietary_label = request_row.dietary.replace("_", " ").title()

    templates = [
        {
            "base": "Rice Bowl",
            "ingredients": ["rice", "egg", "spinach", "soy sauce"],
            "steps": ["Cook rice", "Fry egg", "Saute spinach", "Serve together"],
            "calories": 420,
            "protein": 18,
            "carbs": 52,
            "fat": 14,
            "funfacts":"Rice is a staple food for more than half of the world's population."
        },
        {
            "base": "Noodle Stir Fry",
            "ingredients": ["noodles", "tofu", "carrot", "soy sauce"],
            "steps": ["Boil noodles", "Cook tofu", "Add carrot", "Mix together"],
            "calories": 460,
            "protein": 22,
            "carbs": 56,
            "fat": 13,
            "funfacts":"Noodles are a staple food in many Asian countries."

        },
        {
            "base": "Wrap",
            "ingredients": ["wrap", "chicken", "lettuce", "yogurt sauce"],
            "steps": ["Cook chicken", "Warm wrap", "Add fillings", "Wrap and serve"],
            "calories": 430,
            "protein": 28,
            "carbs": 35,
            "fat": 15,
            "funfacts":"Wraps are a popular handheld food that can be filled with a variety of ingredients."
        },
        {
            "base": "Potato Skillet",
            "ingredients": ["potato", "onion", "egg", "pepper"],
            "steps": ["Dice potato", "Pan-fry onion", "Add egg", "Cook until done"],
            "calories": 390,
            "protein": 16,
            "carbs": 41,
            "fat": 17,
            "funfacts":"Potatoes are the world's fourth-largest food crop, following rice, wheat, and maize."
        },
        {
            "base": "Pasta",
            "ingredients": ["pasta", "tomato sauce", "cheese", "garlic"],
            "steps": ["Boil pasta", "Heat sauce", "Add cheese", "Mix and serve"],
            "calories": 510,
            "protein": 19,
            "carbs": 68,
            "fat": 16,
            "funfacts":"Pasta is a traditional Italian dish that has become popular worldwide."
        },
    ]

    recipes = []
    for i in range(recipe_count):
        template = templates[i % len(templates)]

        recipes.append(
            {
                "title": f"{mode_label} {dietary_label} {template['base']} {i + 1}",
                "ingredients": template["ingredients"],
                "steps": template["steps"],
                "calories": template["calories"],
                "protein": template["protein"],
                "carbs": template["carbs"],
                "fat": template["fat"],
                "funfacts":template["funfacts"],
            }
        )

    return recipes


def _call_openai_for_recipes(
    request_row: MealPlanRequest,
    recipe_count: int = DEFAULT_RECIPE_COUNT,
) -> list[dict[str, Any]]:
    client = _get_openai_client()
    model_name = os.getenv("OPENAI_MODEL", "gpt-5.2")

    prompt = build_recipe_generation_prompt(
        request_row=request_row,
        recipe_count=recipe_count,
    )

    response = client.responses.create(
        model=model_name,
        input=prompt,
    )

    raw_text = getattr(response, "output_text", "") or ""
    if not raw_text.strip():
        raise ValueError("Model returned empty text")

    parsed = json.loads(raw_text)

    if not isinstance(parsed, list):
        raise ValueError("Model response is not a JSON array")

    normalized = [
        _normalize_recipe(item, index=i + 1)
        for i, item in enumerate(parsed)
        if isinstance(item, dict)
    ]

    return normalized


def _ensure_exact_count(
    recipes: list[dict[str, Any]],
    request_row: MealPlanRequest,
    recipe_count: int = DEFAULT_RECIPE_COUNT,
) -> list[dict[str, Any]]:
    recipes = recipes[:recipe_count]

    if len(recipes) < recipe_count:
        fillers = _build_demo_recipes(request_row, recipe_count)
        missing = recipe_count - len(recipes)
        recipes.extend(fillers[:missing])

    return recipes


def _save_recipes_to_db(
    db: Session,
    request_id,
    recipes: list[dict[str, Any]],
) -> list[Recipe]:
    db.query(Recipe).filter(Recipe.request_id == request_id).delete(
        synchronize_session=False
    )

    recipe_rows = []
    for recipe_data in recipes:
        recipe_row = Recipe(
            request_id=request_id,
            title=recipe_data["title"],
            ingredients=recipe_data["ingredients"],
            steps=recipe_data["steps"],
            calories=recipe_data["calories"],
            protein=recipe_data["protein"],
            carbs=recipe_data["carbs"],
            fat=recipe_data["fat"],
            funfacts=recipe_data.get("funfacts"),
        )
        db.add(recipe_row)
        recipe_rows.append(recipe_row)

    db.commit()

    for recipe_row in recipe_rows:
        db.refresh(recipe_row)

    return recipe_rows


def generate_and_save_recipes(
    db: Session,
    request_row: MealPlanRequest,
    recipe_count: int = DEFAULT_RECIPE_COUNT,
) -> list[Recipe]:
    try:
        recipes = _call_openai_for_recipes(
            request_row=request_row,
            recipe_count=recipe_count,
        )
    except Exception:
        recipes = _build_demo_recipes(
            request_row=request_row,
            recipe_count=recipe_count,
        )

    recipes = _ensure_exact_count(
        recipes=recipes,
        request_row=request_row,
        recipe_count=recipe_count,
    )

    return _save_recipes_to_db(
        db=db,
        request_id=request_row.id,
        recipes=recipes,
    )
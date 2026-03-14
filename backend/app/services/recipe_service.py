from typing import List, Dict, Any

from sqlalchemy.orm import Session

from app.models.recipes import Recipe


def save_generated_recipes(
    db: Session,
    request_id,
    recipes_data: List[Dict[str, Any]],
) -> List[Recipe]:
    saved_recipes = []

    for item in recipes_data:
        recipe = Recipe(
            request_id=request_id,
            title=item["title"],
            ingredients=item["ingredients"],
            steps=item["steps"],
            calories=item.get("calories", 0),
            protein=item.get("protein", 0),
            carbs=item.get("carbs", 0),
            fat=item.get("fat", 0),
            funfacts=item.get("funfacts"),
        )
        db.add(recipe)
        saved_recipes.append(recipe)

    db.commit()

    for recipe in saved_recipes:
        db.refresh(recipe)

    return saved_recipes


def get_recipe_by_id(db: Session, recipe_id):
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()


def get_recipes_by_request_id(db: Session, request_id) -> List[Recipe]:
    return (
        db.query(Recipe)
        .filter(Recipe.request_id == request_id)
        .all()
    )


def delete_recipes_by_request_id(db: Session, request_id) -> None:
    (
        db.query(Recipe)
        .filter(Recipe.request_id == request_id)
        .delete(synchronize_session=False)
    )
    db.commit()

from uuid import UUID

from fastapi import APIRouter

from app.schemas.shopping import ShoppingListResponse

router = APIRouter(prefix="/shopping", tags=["Shopping"])


@router.get("/{meal_plan_id}", response_model=ShoppingListResponse)
def get_shopping_list(meal_plan_id: UUID):
    return {
        "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "meal_plan_id": meal_plan_id,
        "items": [
            {
                "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
                "shopping_list_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
                "ingredient_name": "eggs",
                "checked": False,
            },
            {
                "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
                "shopping_list_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
                "ingredient_name": "rice",
                "checked": True,
            },
            {
                "id": "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
                "shopping_list_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
                "ingredient_name": "chicken breast",
                "checked": False,
            },
        ],
    }

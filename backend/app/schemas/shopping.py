from typing import List
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ShoppingListItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    shopping_list_id: UUID
    ingredient_name: str
    checked: bool


class ShoppingListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    meal_plan_id: UUID
    items: List[ShoppingListItemResponse]

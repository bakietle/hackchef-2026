from typing import List
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class RecipeCardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    calories: int
    protein: int
    carbs: int
    fat: int


class RecipeDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    request_id: UUID
    title: str
    ingredients: List[str]
    steps: List[str]
    calories: int
    protein: int
    carbs: int
    fat: int

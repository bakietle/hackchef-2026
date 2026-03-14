from datetime import date, datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MealPlanItemCreate(BaseModel):
    recipe_id: UUID
    day_of_week: int
    meal_slot: str
    planned_date: date


class MealPlanCreate(BaseModel):
    user_id: UUID
    start_date: date
    items: List[MealPlanItemCreate]


class MealPlanItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    meal_plan_id: UUID
    recipe_id: UUID
    day_of_week: int
    meal_slot: str
    planned_date: date


class MealPlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    start_date: date
    created_at: datetime
    items: List[MealPlanItemResponse] = Field(default_factory=list)

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MealPlanItemCreate(BaseModel):
    recipe_id: UUID
    meal_slot: str
    planned_date: date
    day_of_week: Optional[str] = None


class MealPlanCreate(BaseModel):
    start_date: date
    items: List[MealPlanItemCreate]


class MealPlanItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    meal_plan_id: UUID
    recipe_id: UUID
    day_of_week: int | str | None = None
    meal_slot: str
    planned_date: date | None = None
    plan_date: date | None = None


class MealPlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    start_date: date | None = None
    week_start: date | None = None
    created_at: datetime
    items: List[MealPlanItemResponse] = Field(default_factory=list)
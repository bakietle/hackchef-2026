from pydantic import BaseModel, Field
from typing import List, Optional


class MealItem(BaseModel):
    day: str = Field(..., example="Monday")
    meal_type: str = Field(..., example="Lunch")
    dish_name: str = Field(..., example="Beef Stir Fry")
    notes: Optional[str] = Field(default=None, example="Use less oil")


class WeeklyPlanBase(BaseModel):
    week_start_date: str = Field(..., example="2026-03-16")
    meals: List[MealItem]


class WeeklyPlanCreate(WeeklyPlanBase):
    user_id: int = Field(..., example=1)


class WeeklyPlanResponse(WeeklyPlanBase):
    user_id: int = Field(..., example=1)
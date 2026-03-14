from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MealMode(str, Enum):
    GLOW_UP = "Glow-up"
    GREEN_QUEEN = "Green Queen"
    FANCY_ERA = "Fancy Era"
    BEAST_MODE = "Beast Mode"
    SNACK_ATTACK = "Snack Attack"
    EXAM_MODE = "Exam Mode"


class MealPlanRequestCreate(BaseModel):
    mode: MealMode


class MealPlanRequestUpdate(BaseModel):
    budget_per_meal: Optional[float] = None
    time_per_meal: Optional[int] = None
    cuisine_type: Optional[str] = None
    dietary: Optional[str] = None


class MealPlanRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    budget_per_meal: Optional[float] = None
    time_per_meal: Optional[int] = None
    cuisine_type: Optional[str] = None
    dietary: Optional[str] = None
    mode: Optional[MealMode] = None
    created_at: datetime

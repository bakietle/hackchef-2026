from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MealPlanRequestCreate(BaseModel):
    user_id: UUID
    budget_per_meal: float
    time_per_meal: int
    dietary: Optional[str] = None
    mode: Optional[str] = None


class MealPlanRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    budget_per_meal: float
    time_per_meal: int
    dietary: str
    mode: str
    created_at: datetime

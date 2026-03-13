from pydantic import BaseModel, Field
from typing import List, Optional


class PreferenceBase(BaseModel):
    cook_time: int = Field(..., example=20, description="Maximum cooking time in minutes")
    budget_per_meal: float = Field(..., example=5.0)
    mode: str = Field(..., example="broke mode")
    cuisine: List[str] = Field(..., example=["Asian", "Western"])
    kitchenware: Optional[List[str]] = Field(default=None, example=["pan", "pot"])


class PreferenceCreate(PreferenceBase):
    user_id: int = Field(..., example=1)


class PreferenceResponse(PreferenceBase):
    user_id: int = Field(..., example=1)
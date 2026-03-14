from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SavedRecipeCreate(BaseModel):
    user_id: UUID
    recipe_id: UUID


class SavedRecipeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    recipe_id: UUID
    created_at: datetime

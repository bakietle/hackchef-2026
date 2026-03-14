import uuid

from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(
        UUID(as_uuid=True),
        ForeignKey("meal_plan_requests.id"),
        nullable=False,
        index=True,
    )
    title = Column(Text, nullable=False)
    ingredients = Column(JSONB, nullable=False)
    steps = Column(JSONB, nullable=False)
    calories = Column(Integer, nullable=False)
    protein = Column(Integer, nullable=False)
    carbs = Column(Integer, nullable=False)
    fat = Column(Integer, nullable=False)
    meal_plan_items=relationship("MealPlanItem", back_populates="recipe")
    recipes=relationship("Recipe", back_populates="meal_plan_items")

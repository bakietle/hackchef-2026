import uuid

from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class MealPlanItem(Base):
    __tablename__ = "meal_plan_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_plan_id = Column(
        UUID(as_uuid=True),
        ForeignKey("meal_plans.id"),
        nullable=False,
        index=True,
    )
    recipe_id = Column(UUID(as_uuid=True), ForeignKey("recipes.id"), nullable=False, index=True)
    day_of_week = Column(Integer, nullable=False)
    meal_slot = Column(String, nullable=False)   # breakfast, lunch, dinner, etc.
    planned_date = Column(Date, nullable=False)
    meal_plan = relationship("MealPlan", back_populates="items")
    recipe = relationship("Recipe")

import uuid

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, Text, func
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class MealPlanRequest(Base):
    __tablename__ = "meal_plan_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    budget_per_meal = Column(Float, nullable=False)
    time_per_meal = Column(Integer, nullable=False)
    dietary = Column(Text, nullable=False)
    mode = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

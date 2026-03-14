import uuid

from sqlalchemy import Boolean, Column, ForeignKey, Text, text
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class ShoppingListItem(Base):
    __tablename__ = "shopping_list_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shopping_list_id = Column(
        UUID(as_uuid=True),
        ForeignKey("shopping_lists.id"),
        nullable=False,
        index=True,
    )
    ingredient_name = Column(Text, nullable=False)
    checked = Column(Boolean, nullable=False, server_default=text("false"))

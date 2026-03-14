"""add planned_date to meal_plan_items

Revision ID: 73facbecd0c7
Revises: 5cf2cb8bfc3b
Create Date: 2026-03-14 20:14:52.996837

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '73facbecd0c7'
down_revision: Union[str, Sequence[str], None] = '5cf2cb8bfc3b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "meal_plan_items",
        sa.Column("planned_date", sa.Date(), nullable=False)
    )

def downgrade():
    op.drop_column("meal_plan_items", "planned_date")

from uuid import uuid4

from fastapi import APIRouter, status

from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate):
    return {
        "id": uuid4(),
        "username": user.username,
    }

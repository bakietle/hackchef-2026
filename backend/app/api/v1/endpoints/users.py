from fastapi import APIRouter
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate):

    new_user = {
        "id": 1,
        "name": user.name
    }

    return new_user
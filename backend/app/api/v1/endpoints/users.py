from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.models.users import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = User(username=user.username)
        print("1. user object created")

        db.add(db_user)
        print("2. added to session")

        db.commit()
        print("3. commit successful")

        db.refresh(db_user)
        print("4. refresh successful")

        return db_user

    except Exception as e:
        db.rollback()
        print("ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))

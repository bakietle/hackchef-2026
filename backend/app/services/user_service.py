from sqlalchemy.orm import Session

from app.models.users import User

#Use at Welcome page
def create_user(db: Session, username: str) -> User:
    username = username.strip()

    if not username:
        raise ValueError("Username cannot be empty.")

    user = User(username=username)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

#Use anywhere when you need current user.
def get_user_by_id(db: Session, user_id):
    return db.query(User).filter(User.id == user_id).first()

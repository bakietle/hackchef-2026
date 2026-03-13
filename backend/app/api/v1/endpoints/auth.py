from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    RegisterResponse,
    LoginResponse,
    UserResponse,
)

router = APIRouter()


@router.post("/register", response_model=RegisterResponse)
def register_user(payload: RegisterRequest):
    """
    Register a new user.
    Later this will save the user into the database.
    """
    if payload.email == "existing@example.com":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    return RegisterResponse(
        message="User registered successfully",
        user=UserResponse(
            email=payload.email,
            full_name=payload.full_name
        )
    )


@router.post("/login", response_model=LoginResponse)
def login_user(payload: LoginRequest):
    """
    Login a user.
    Later this will check password hash and return JWT token.
    """
    if payload.email != "test@example.com" or payload.password != "123456":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return LoginResponse(
        message="Login successful",
        access_token="fake-jwt-token",
        token_type="bearer"
    )
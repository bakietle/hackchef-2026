from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, example="123456")
    full_name: str = Field(..., example="John Doe")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, example="123456")


class UserResponse(BaseModel):
    email: EmailStr
    full_name: str


class RegisterResponse(BaseModel):
    message: str
    user: UserResponse


class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
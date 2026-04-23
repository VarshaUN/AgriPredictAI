from fastapi import APIRouter, Header

from app.core.security import get_farmer_id
from app.schemas.auth_schema import (
    RegisterRequest, SoilUpdateRequest,
    LoginRequest, TokenResponse, MessageResponse
)
from app.services.auth_service import register_farmer, update_soil, login_farmer

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(data: RegisterRequest):
    """Page 1 — basic farmer info. Returns JWT immediately."""
    return register_farmer(data)


@router.patch("/profile/soil", response_model=MessageResponse)
def save_soil(data: SoilUpdateRequest, authorization: str = Header(...)):
    """Page 2 — soil health card. Requires JWT from register."""
    farmer_id = get_farmer_id(authorization)
    return update_soil(farmer_id, data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    return login_farmer(data)
from pydantic import BaseModel
from typing import Optional


# ── Page 1: Basic Info ────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    phone: str
    password: str
    state: str
    location: str
    land_area_acres: float


# ── Page 2: Soil Health Card ──────────────────────────
class SoilUpdateRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float


# ── Login ─────────────────────────────────────────────
class LoginRequest(BaseModel):
    phone: str
    password: str


# ── Responses ─────────────────────────────────────────
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    farmer_id: str
    name: str


class MessageResponse(BaseModel):
    message: str
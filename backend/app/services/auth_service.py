from fastapi import HTTPException
from datetime import datetime

from app.core.supabase_client import supabase
from app.core.security import hash_password, verify_password, create_token
from app.schemas.auth_schema import (
    RegisterRequest, SoilUpdateRequest,
    LoginRequest, TokenResponse, MessageResponse
)


def register_farmer(data: RegisterRequest) -> TokenResponse:
    # Check phone uniqueness
    existing = supabase.table("farmers").select("id").eq("phone", data.phone).execute()
    if existing.data:
        raise HTTPException(status_code=409, detail="Phone number already registered. Please login.")

    result = supabase.table("farmers").insert({
        "name":            data.name,
        "phone":           data.phone,
        "password_hash":   hash_password(data.password),
        "state":           data.state,
        "location":        data.location,
        "land_area_acres": data.land_area_acres,
        # soil fields left null — filled in page 2
        "created_at":      datetime.utcnow().isoformat()
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Registration failed. Please try again.")

    farmer_id = str(result.data[0]["id"])
    return TokenResponse(
        access_token=create_token(farmer_id),
        farmer_id=farmer_id,
        name=data.name
    )


def update_soil(farmer_id: str, data: SoilUpdateRequest) -> MessageResponse:
    result = supabase.table("farmers").update({
        "nitrogen":   data.nitrogen,
        "phosphorus": data.phosphorus,
        "potassium":  data.potassium,
        "ph":         data.ph
    }).eq("id", farmer_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Farmer not found.")

    return MessageResponse(message="Soil details saved successfully.")


def login_farmer(data: LoginRequest) -> TokenResponse:
    result = supabase.table("farmers").select("*").eq("phone", data.phone).execute()

    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid phone number or password.")

    farmer = result.data[0]

    if not verify_password(data.password, farmer["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid phone number or password.")

    return TokenResponse(
        access_token=create_token(str(farmer["id"])),
        farmer_id=str(farmer["id"]),
        name=farmer["name"]
    )
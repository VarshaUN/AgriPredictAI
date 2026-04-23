from pydantic import BaseModel
from typing import Optional


# ── Yield Input (stored in Supabase) ─────────────────
class YieldInputRequest(BaseModel):
    crop_name: str
    season: str                 # kharif / rabi / zaid
    area: float                 # in acres
    fertilizer: float           # kg/acre
    pesticide: float            # kg/acre
    soil_type: str              # loamy / clay / sandy


class YieldInputResponse(BaseModel):
    id: str
    farmer_id: str
    crop_name: str
    season: str
    area: float
    fertilizer: float
    pesticide: float
    soil_type: str
    created_at: str


# ── Yield Prediction (from ML model) ─────────────────
class YieldPredictResponse(BaseModel):
    predicted_yield: float
    unit: str                   # quintals_per_acre


# ── Profit Estimation (from ML model) ────────────────
class ProfitResponse(BaseModel):
    estimated_profit_per_acre: float
    currency: str


# ── Crop Recommendation (from ML model) ──────────────
class CropRecommendRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


class CropRecommendResponse(BaseModel):
    recommended_crop: str
    confidence: str


# ── Disease Detection (from ML model) ────────────────
class DiseaseResponse(BaseModel):
    disease: str
    confidence_percent: float
    treatment: Optional[dict] = None
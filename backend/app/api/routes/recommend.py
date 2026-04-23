from fastapi import APIRouter, UploadFile, File, Header
from datetime import datetime

import app.path_setup  # noqa: F401 — register AgriPredictAI before MLmodels

from app.core.security import get_farmer_id
from app.core.supabase_client import supabase
from app.schemas.yield_schema import (
    YieldInputRequest, YieldInputResponse,
    YieldPredictResponse, ProfitResponse,
    CropRecommendRequest, CropRecommendResponse,
    DiseaseResponse
)
from MLmodels.models.ml_service import (
    predict_crop, predict_disease,
    predict_yield, calculate_profit,
    get_disease_treatment
)

router = APIRouter(tags=["AI Engine"])


# ── POST /yield-input ─────────────────────────────────
# Saves farmer's yield prediction inputs to Supabase
@router.post("/yield-input", response_model=YieldInputResponse, status_code=201)
def save_yield_input(data: YieldInputRequest, authorization: str = Header(...)):
    farmer_id = get_farmer_id(authorization)

    result = supabase.table("yield_inputs").insert({
        "farmer_id":  farmer_id,
        "crop_name":  str(data.crop_name).capitalize(),
        "season":     data.season,
        "area":       data.area,
        "fertilizer": data.fertilizer,
        "pesticide":  data.pesticide,
        "soil_type":  data.soil_type,
        "created_at": datetime.utcnow().isoformat()
    }).execute()

    if not result.data:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail="Failed to save yield input.")

    row = result.data[0]
    return YieldInputResponse(**row)


# ── GET /yield-input ──────────────────────────────────
# Fetches farmer's latest yield input + runs ML prediction
@router.get("/yield-input")
def get_yield_prediction(authorization: str = Header(...)):
    farmer_id = get_farmer_id(authorization)

    # Get farmer's state + soil data
    farmer = supabase.table("farmers").select("*").eq("id", farmer_id).execute()
    if not farmer.data:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Farmer not found.")
    f = farmer.data[0]

    # Get latest yield input
    result = supabase.table("yield_inputs") \
        .select("*") \
        .eq("farmer_id", farmer_id) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    if not result.data:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No yield input found. Please submit yield details first.")

    inp = result.data[0]

    # Call ML model
    yield_result = predict_yield(
        crop=inp["crop_name"],
        season=inp["season"],
        state=f["state"],
        area=inp["area"],
        annual_rainfall=f.get("rainfall", 100),  # fallback if not stored
        fertilizer=inp["fertilizer"],
        pesticide=inp["pesticide"]
    )

    # Also calculate profit
    profit_result = calculate_profit(
        predicted_yield=yield_result["predicted_yield"],
        crop=inp["crop_name"]
    )

    return {
        "yield_input": inp,
        "prediction": yield_result,
        "profit": profit_result
    }


# ── POST /recommend-crop ──────────────────────────────
@router.post("/recommend-crop", response_model=CropRecommendResponse)
def crop_recommendation(data: CropRecommendRequest, authorization: str = Header(...)):
    get_farmer_id(authorization)
    return predict_crop(
        N=data.nitrogen, P=data.phosphorus, K=data.potassium,
        temperature=data.temperature, humidity=data.humidity,
        ph=data.ph, rainfall=data.rainfall
    )


# ── POST /detect-disease ──────────────────────────────
@router.post("/detect-disease", response_model=DiseaseResponse)
async def disease_detection(
    file: UploadFile = File(...),
    authorization: str = Header(...)
):
    get_farmer_id(authorization)
    image_bytes = await file.read()
    result = predict_disease(image_bytes)

    # Get Gemini treatment advice
    treatment = get_disease_treatment(result["disease"])
    result["treatment"] = treatment

    return DiseaseResponse(**result)


# ── POST /predict-profit ──────────────────────────────
@router.post("/predict-profit", response_model=ProfitResponse)
def profit_estimation(
    predicted_yield: float,
    crop: str,
    msp_price: float = 2300,
    authorization: str = Header(...)
):
    get_farmer_id(authorization)
    return calculate_profit(predicted_yield=predicted_yield,
                            crop=crop, msp_price=msp_price)
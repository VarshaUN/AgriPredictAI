import json
import random
from pathlib import Path

from app.schemas.recommend_schema import (
    CropRecommendRequest, CropRecommendResponse,
    DiseaseResponse,
    YieldRequest, YieldResponse,
    ProfitRequest, ProfitResponse
)

MOCK_DATA_PATH = Path(__file__).parent.parent / "data" / "mock_data.json"


def _load_mock() -> dict:
    with open(MOCK_DATA_PATH) as f:
        return json.load(f)


# ── Crop Recommendation ───────────────────────────────
def recommend_crop(data: CropRecommendRequest) -> CropRecommendResponse:
    mock = _load_mock()

    # Match by state, fallback to first entry
    match = next(
        (r for r in mock["crop_recommendations"]
         if r["state"].lower() == data.state.lower()),
        mock["crop_recommendations"][0]
    )

    return CropRecommendResponse(**match)


# ── Disease Detection ─────────────────────────────────
def detect_disease(crop_name: str) -> DiseaseResponse:
    mock = _load_mock()
    detections = mock["disease_detections"]

    # Try exact crop name match first
    match = next(
        (d for d in detections
         if d["affected_crop"].lower() == crop_name.lower()),
        None
    )

    # No match — pick a random diseased entry so demo looks realistic
    if match is None:
        diseased = [d for d in detections if d["disease_name"] != "Healthy Plant"]
        match = random.choice(diseased) if diseased else detections[0]

    return DiseaseResponse(**match)


# ── Yield Prediction ──────────────────────────────────
def predict_yield(data: YieldRequest) -> YieldResponse:
    mock = _load_mock()

    # Match by crop + season, fallback to first entry
    match = next(
        (m for m in mock["yield_predictions"]
         if m["crop"].lower() == data.crop.lower()
         and m["season"].lower() == data.season.lower()),
        mock["yield_predictions"][0]
    )

    total_yield = round(match["predicted_yield_per_acre"] * data.area, 2)
    msp = match["msp_price_per_quintal"]

    return YieldResponse(
        crop=data.crop,
        predicted_yield_per_acre=match["predicted_yield_per_acre"],
        total_yield_quintals=total_yield,
        msp_price_per_quintal=msp,
        estimated_profit_inr=round((total_yield * msp) / 100, 2),
        confidence_score=match["confidence_score"],
        recommendation=match["recommendation"]
    )


# ── Profit Estimation ─────────────────────────────────
def estimate_profit(data: ProfitRequest) -> ProfitResponse:
    mock = _load_mock()

    # Match profit config by crop, fallback to first entry
    config = next(
        (p for p in mock["profit_estimations"]
         if p["crop"].lower() == data.crop.lower()),
        mock["profit_estimations"][0]
    )

    msp = config["msp_price_per_quintal"]
    gross_revenue = round((data.predicted_yield * msp) / 100, 2)

    # Cost = baseline + fertilizer cost + pesticide cost (scaled by area)
    fertilizer_cost = round(data.fertilizer * config["fertilizer_cost_per_kg"] * data.area, 2)
    pesticide_cost  = round(data.pesticide  * config["pesticide_cost_per_kg"]  * data.area, 2)
    baseline_cost   = round(config["baseline_cost_per_acre"] * data.area, 2)
    total_cost      = round(baseline_cost + fertilizer_cost + pesticide_cost, 2)

    net_profit      = round(gross_revenue - total_cost, 2)
    profit_per_acre = round(net_profit / data.area, 2) if data.area > 0 else 0

    # Break-even yield in quintals
    break_even = round((total_cost * 100) / msp, 2) if msp > 0 else 0

    return ProfitResponse(
        crop=data.crop,
        total_yield_quintals=data.predicted_yield,
        msp_price_per_quintal=msp,
        gross_revenue_inr=gross_revenue,
        total_cost_inr=total_cost,
        net_profit_inr=net_profit,
        profit_per_acre_inr=profit_per_acre,
        break_even_yield=break_even
    )
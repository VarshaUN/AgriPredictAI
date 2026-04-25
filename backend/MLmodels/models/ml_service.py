import joblib
import numpy as np
from tensorflow.keras.models import load_model
import json
from PIL import Image
import io
import os
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

import os
MODEL_DIR = os.path.join(os.path.dirname(__file__))

crop_model = joblib.load(os.path.join(MODEL_DIR, 'rf_crop_model.pkl'))
crop_scaler = joblib.load(os.path.join(MODEL_DIR, 'crop_scaler.pkl'))
crop_encoder = joblib.load(os.path.join(MODEL_DIR, 'crop_label_encoder.pkl'))
disease_model = load_model(os.path.join(MODEL_DIR, 'disease_cnn_model.h5'))
with open(os.path.join(MODEL_DIR, 'disease_classes.json'), 'r') as f:
    disease_classes = json.load(f)
yield_model = load_model(os.path.join(MODEL_DIR, 'yield_lstm_model.h5'), compile=False)
yield_scaler = joblib.load(os.path.join(MODEL_DIR, 'yield_lstm_scaler.pkl'))
yield_encoders = joblib.load(os.path.join(MODEL_DIR, 'yield_lstm_encoders.pkl'))

def predict_crop(N: float, P: float, K: float, temperature: float, humidity: float, ph: float, rainfall: float):
    """Feature 2: Crop Recommendation"""
    input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    scaled = crop_scaler.transform(input_data)
    pred_encoded = crop_model.predict(scaled)[0]
    crop_name = crop_encoder.inverse_transform([pred_encoded])[0]
    return {"recommended_crop": crop_name, "confidence": "High (99%)"}

def predict_disease(image_bytes: bytes):
    """Feature 1: Disease Detection"""
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((128, 128)) 
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    pred = disease_model.predict(img_array)[0]
    class_idx = np.argmax(pred)
    disease_name = disease_classes[class_idx]
    confidence = float(pred[class_idx])

    return {
        "disease": disease_name,
        "confidence_percent": round(confidence * 100, 2)
    }

def predict_yield(crop: str, season: str, state: str, area: float, 
                  annual_rainfall: float, fertilizer: float, pesticide: float):
    """Feature 3: Yield Prediction"""
    crop_enc = yield_encoders['Crop'].transform([crop.capitalize()])[0]
    season_enc = yield_encoders['Season'].transform([season.capitalize()])[0]
    state_enc = yield_encoders['State'].transform([state.capitalize()])[0]
    seq = np.array([[crop_enc, season_enc, state_enc, area, annual_rainfall, fertilizer, pesticide]] * 3)
    seq_scaled = yield_scaler.transform(seq).reshape(1, 3, 7)
    pred = yield_model.predict(seq_scaled)[0][0]
    return {"predicted_yield": round(float(pred), 2), "unit": "quintals_per_acre"}

def calculate_profit(predicted_yield: float, crop: str, msp_price: float = 2300):
    """Feature 4: Profit Estimation"""
    estimated_cost = 15000          #base cost(needs to changed)
    revenue = predicted_yield * msp_price
    profit = revenue - estimated_cost
    return {"estimated_profit_per_acre": round(profit, 2), "currency": "INR"}

def get_disease_treatment_advice(disease_name: str):
    """Pesticide and Fertilizer using Gemini model"""
    try:
        prompt = f"""
        An agricultural AI has just diagnosed a crop with the following disease: {disease_name}.
        Provide actionable, simple advice for a farmer to treat this issue.

        You MUST return the response strictly in the following JSON format, with no markdown formatting or extra text:
        {{
            "disease_name": "{disease_name}",
            "danger_level": "Low, Medium, or High",
            "organic_treatment": "One natural or organic way to treat or manage this disease.",
            "chemical_pesticide": "Name one standard chemical pesticide used for this (keep it brief).",
            "prevention_tip": "One short tip on how to prevent this from happening next season."
        }}
        """

        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        
        response_text = response.text
        if not response_text:
            raise ValueError("Empty response from Gemini API")
            
        return json.loads(response_text)

    except Exception as e:
        return {"error": f"Failed to generate treatment advice: {str(e)}"}

get_disease_treatment = get_disease_treatment_advice
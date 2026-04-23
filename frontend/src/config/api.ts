const BASE = import.meta.env.VITE_API_URL;
if (!BASE) console.warn("VITE_API_URL is NOT set. Frontend will not be able to connect to the backend.");

export const API = {
  // Auth  (prefix: /auth)
  register: `${BASE}/auth/register`,          // POST  — RegisterRequest → TokenResponse
  login: `${BASE}/auth/login`,                // POST  — LoginRequest    → TokenResponse
  saveSoil: `${BASE}/auth/profile/soil`,      // PATCH — SoilUpdateRequest (needs Bearer token)

  // AI Engine  (no prefix)
  saveYieldInput: `${BASE}/yield-input`,      // POST — YieldInputRequest  (needs Bearer token)
  getYieldPredict: `${BASE}/yield-input`,     // GET  — returns { yield_input, prediction, profit }
  detectDisease: `${BASE}/detect-disease`,    // POST — multipart/form-data file upload
  recommendCrop: `${BASE}/recommend-crop`,    // POST — CropRecommendRequest
  predictProfit: `${BASE}/predict-profit`,    // POST — query params: predicted_yield, crop, msp_price
};
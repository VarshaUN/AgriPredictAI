// frontend_api_client.ts
// This file contains TypeScript interfaces and API client functions 
// to help you easily connect your frontend to the AgriPredictAI backend.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// ==========================================
// 1. Types & Interfaces
// ==========================================

// --- Auth Schemas ---
export interface RegisterRequest {
  name: string;
  phone: string;
  password: string;
  state: string;
  location: string;
  land_area_acres: number;
}

export interface SoilUpdateRequest {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  farmer_id: string;
  name: string;
}

export interface MessageResponse {
  message: string;
}

// --- Yield & Crop Schemas ---
export interface YieldInputRequest {
  crop_name: string;
  season: string; // kharif / rabi / zaid
  area: number;
  fertilizer: number;
  pesticide: number;
  soil_type: string; // loamy / clay / sandy
}

export interface YieldInputResponse {
  id: string;
  farmer_id: string;
  crop_name: string;
  season: string;
  area: number;
  fertilizer: number;
  pesticide: number;
  soil_type: string;
  created_at: string;
}

export interface CropRecommendRequest {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface CropRecommendResponse {
  recommended_crop: string;
  confidence: string;
}

// --- Prediction & Profit Schemas ---
export interface YieldPredictResponse {
  predicted_yield: number;
  unit: string;
}

export interface ProfitResponse {
  estimated_profit_per_acre: number;
  currency: string;
}

export interface DiseaseResponse {
  disease: string;
  confidence_percent: number;
  treatment?: Record<string, any>;
}

// ==========================================
// 2. Fetch Utility
// ==========================================

// Helper to get auth token from local storage (or your state manager)
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("access_token");
  return token ? { "authorization": `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
};

// Generic fetch wrapper
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const controller = new AbortController();
    // Increase timeout to 5 minutes for disease detection
    const timeoutDuration = endpoint.includes('detect-disease') ? 300000 : 60000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    console.log(`[API] ${options.method || 'GET'} ${endpoint} - Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `API Request failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API] Response:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Error on ${endpoint}:`, error);
    throw error;
  }
}
// ==========================================
// 3. API Client Functions
// ==========================================

export const apiClient = {
  // --- Authentication ---
  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    return apiCall<TokenResponse>("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginRequest): Promise<TokenResponse> => {
    return apiCall<TokenResponse>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  updateSoilProfile: async (data: SoilUpdateRequest): Promise<MessageResponse> => {
    return apiCall<MessageResponse>("/auth/profile/soil", {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // --- Yield & ML Engine ---
  saveYieldInput: async (data: YieldInputRequest): Promise<YieldInputResponse> => {
    return apiCall<YieldInputResponse>("/yield-input", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  getYieldPrediction: async (): Promise<{ yield_input: any; prediction: YieldPredictResponse; profit: ProfitResponse }> => {
    return apiCall<{ yield_input: any; prediction: YieldPredictResponse; profit: ProfitResponse }>("/yield-input", {
      method: "GET",
      headers: getAuthHeaders(),
    });
  },

  recommendCrop: async (data: CropRecommendRequest): Promise<CropRecommendResponse> => {
    return apiCall<CropRecommendResponse>("/recommend-crop", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
  },

  predictProfit: async (predictedYield: number, crop: string, mspPrice: number = 2300): Promise<ProfitResponse> => {
    return apiCall<ProfitResponse>(`/predict-profit?predicted_yield=${predictedYield}&crop=${encodeURIComponent(crop)}&msp_price=${mspPrice}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
  },

  detectDisease: async (file: File): Promise<DiseaseResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    
    // Note: FormData handles Content-Type automatically (multipart/form-data boundary).
    // For authorization, we must strictly omit custom application/json headers for this request.
    const token = localStorage.getItem("access_token");
    const headers: HeadersInit = token ? { "authorization": `Bearer ${token}` } : {};

    return apiCall<DiseaseResponse>("/detect-disease", {
        method: "POST",
        headers: headers,
        body: formData,
    });
  }
};

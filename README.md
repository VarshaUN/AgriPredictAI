# AgriPredict AI 🌾

**What if every farmer in India had a personal agriculture expert in their pocket?**

That's what we built. In 24 hours.

---

## The Story Behind This

India feeds 1.4 billion people. But the people who grow our food? They're struggling.

A farmer in Vidarbha doesn't know if he should plant soybean or cotton this season. A woman in Karnataka sees her rice leaves turning yellow but can't get an expert to visit her village for days. A wheat farmer in Punjab irrigates every 5 days because "that's what papa did" — even when rain is coming tomorrow.

**150 million farming households. Most of them making life-changing decisions based on guesswork.**

We thought — what if we could change that with just a smartphone?

---

## What AgriPredict Actually Does

### You tell us where your farm is. We tell you what to grow.

Enter your location, soil type, and land area. Our ML models crunch real-time weather data, historical yields, and soil conditions — then tell you your predicted yield in quintals per acre, the current MSP, and your estimated profit. We even suggest which crop would make you more money this season.

### Your crop looks sick? Take a photo.

Upload a picture of the affected leaf. In under 5 seconds, our AI identifies the disease, tells you how dangerous it is, and gives you both organic and chemical treatment options. No waiting. No guessing. No losing half your field before help arrives.

### Not sure what to plant? We recommend.

Enter your soil's NPK values, pH, temperature, humidity, and rainfall. Our Random Forest model tells you the best crop for your exact conditions — not generic advice, but personalized to YOUR farm.

### We alert you before problems happen.

Heavy rain coming? We'll SMS you: "Skip irrigation today." Temperature spike? "Consider early harvest." We monitor, you act. Simple.

---

## How We're Different

| What Exists | The Problem | What We Do |
|---|---|---|
| CropIn | Costs lakhs/year, built for corporates | Free for every farmer |
| Fasal | Needs ₹8K/year + physical IoT sensors | Just needs a smartphone |
| Plantix | Only does disease detection | Prediction + Detection + Recommendation |
| Government Apps | Same generic advice for everyone | Personalized to YOUR farm |

**Nobody is giving the small Indian farmer a free, all-in-one AI tool. Until now.**

---

## Tech Stack

```
Frontend   →  React.js on Firebase Hosting
Backend    →  FastAPI (Python) on Google Cloud Run
ML Models  →  Random Forest + LSTM + CNN on Cloud Storage
Database   →  Supabase (PostgreSQL)
APIs       →  OpenWeather, Gemini AI, Twilio
Region     →  asia-south1 (Mumbai) for lowest latency
```

Everything serverless. Auto-scaling. Zero infrastructure to manage.

---

## The Models

**Crop Yield Prediction** — LSTM trained on government agricultural data and IMD weather records. Input your location, crop, and farming conditions — get a yield forecast in quintals per acre with profit estimation.

**Disease Detection** — CNN trained on 50,000+ labeled crop disease images. Upload a leaf photo, get diagnosis with treatment advice powered by Gemini AI.

**Crop Recommendation** — Random Forest model that takes your soil's NPK, pH, temperature, humidity, and rainfall to suggest the most suitable crop with high confidence.

---

## Architecture

```
User opens the app (Firebase Hosting)
  → Registers/Logs in (JWT auth via FastAPI)
    → Enters farm details + soil data (stored in Supabase)
      → Yield Prediction: LSTM model on Cloud Run
      → Disease Detection: CNN + Gemini on Cloud Run
      → Crop Recommendation: Random Forest on Cloud Run
        → Results displayed with treatment advice and profit estimates
```

---

## Run It Yourself

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## Team

We're four people who believe technology should work for those who need it most.

| Who | Role | What They Built |
|---|---|---|
| **Harsha Mohan** | Frontend Lead | React UI, all pages, responsive design |
| **Shreyas** | Backend Lead | FastAPI, Supabase integration, auth system |
| **Jhanvi Rani** | AI/ML Lead | LSTM, CNN, Random Forest models + Gemini integration |
| **Varsha U N ** | DevOps Lead | GCP deployment, Firebase hosting, Cloud Run, CI pipeline |

---

## Impact

Agriculture is 17% of India's GDP. 86% of Indian farmers are smallholders. The agritech market has only 1.5% tech penetration — 98.5% of the opportunity is untouched.

This project aligns with three UN Sustainable Development Goals:
- **SDG 1** — No Poverty
- **SDG 2** — Zero Hunger
- **SDG 13** — Climate Action

---

## Live Demo

**👉 [agripredictt-ai.web.app](https://agripredictt-ai.web.app)**

---

*Built with no sleep, mass chai, and the belief that AI should serve the people who feed us.*

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes import auth, recommend


@asynccontextmanager
async def lifespan(app: FastAPI):
    
    yield


app = FastAPI(
    title="AgriPredict AI",
    description="Backend API for smart crop yield forecasting and disease detection.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(recommend.router)


@app.get("/health", tags=["default"])
def health():
    return {"status": "AgriPredict API is live 🌾"}
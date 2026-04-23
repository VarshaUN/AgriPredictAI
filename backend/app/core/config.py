import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent.parent / ".env")

class Settings:
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")
    jwt_secret: str = os.getenv("JWT_SECRET", "agripredict-change-in-prod")
    jwt_expire_hours: int = 24
    openweather_api_key: str = os.getenv("OPENWEATHER_API_KEY", "")

settings = Settings()
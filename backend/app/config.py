import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./eqori.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Render.com specific
    PORT: int = int(os.getenv("PORT", 8000))

    # Environment detection
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production" or "render.com" in os.getenv("RENDER_EXTERNAL_URL", "")

settings = Settings()
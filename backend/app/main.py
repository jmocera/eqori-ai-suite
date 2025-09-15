from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

from .database import engine, Base
from .routes import auth, generation, blog

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Eqori AI Marketing Suite", version="1.0.0")

# Configure CORS
origins = [
    "http://localhost:3000",  # React dev server
    "http://localhost:80",    # Local production
    "https://eqori-frontend.onrender.com",  # Production frontend
    "https://*.onrender.com", # Render domains
]

# Allow all origins for development/demo purposes
# In production, specify exact origins above
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(generation.router)
app.include_router(blog.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Eqori AI Marketing Suite API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
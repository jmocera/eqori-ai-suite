from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routes import auth, generation

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Eqori AI Marketing Suite API",
    description="AI-Powered E-commerce Product Description & Marketing Suite",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(generation.router, prefix="/api", tags=["generation"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Eqori AI Marketing Suite API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
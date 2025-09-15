from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import openai
import os
from dotenv import load_dotenv

from ..database import get_db
from ..models import Generation, User
from ..schemas import GenerationCreate, GenerationUpdate, Generation as GenerationSchema
from ..routes.auth import get_current_user

load_dotenv()

router = APIRouter(prefix="/generation", tags=["Content Generation"])

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_product_description(product_name: str, category: str, features: str, target_audience: str, tone_of_voice: str, seo_keywords: str) -> str:
    prompt = f"""Create an SEO-optimized product description (200-300 words) for the following product:

Product Name: {product_name}
Category: {category}
Features: {features}
Target Audience: {target_audience}
Tone of Voice: {tone_of_voice}
SEO Keywords: {seo_keywords}

The description should be engaging, informative, and naturally incorporate the SEO keywords. Focus on benefits rather than just features."""

    try:
        client = openai.OpenAI(api_key=openai.api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert copywriter specializing in e-commerce product descriptions."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate product description: {str(e)}")

def generate_social_media_ads(product_name: str, category: str, features: str, target_audience: str, tone_of_voice: str) -> str:
    prompt = f"""Create 3 different social media ad copy variations for the following product:

Product Name: {product_name}
Category: {category}
Features: {features}
Target Audience: {target_audience}
Tone of Voice: {tone_of_voice}

Each ad should be:
- Short and engaging (under 100 words each)
- Include a clear call-to-action
- Be optimized for different platforms (Facebook/Instagram, Twitter, LinkedIn)

Format as:
**Ad 1 (Facebook/Instagram):**
[content]

**Ad 2 (Twitter):**
[content]

**Ad 3 (LinkedIn):**
[content]"""

    try:
        client = openai.OpenAI(api_key=openai.api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert social media marketer specializing in creating compelling ad copy."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.8
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate social media ads: {str(e)}")

def generate_email_content(product_name: str, category: str, features: str, target_audience: str, tone_of_voice: str) -> str:
    prompt = f"""Create email marketing content for the following product:

Product Name: {product_name}
Category: {category}
Features: {features}
Target Audience: {target_audience}
Tone of Voice: {tone_of_voice}

Create a complete email including:
- Subject line
- Email body with compelling introduction
- Product benefits highlight
- Clear call-to-action
- Professional closing

The email should be engaging and drive conversions."""

    try:
        client = openai.OpenAI(api_key=openai.api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert email marketer specializing in product promotion emails."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate email content: {str(e)}")

@router.post("/generate", response_model=GenerationSchema)
async def generate_content(
    generation_data: GenerationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI-powered marketing content for a product"""

    # Generate all content types
    product_description = generate_product_description(
        generation_data.product_name,
        generation_data.category or "",
        generation_data.features or "",
        generation_data.target_audience or "",
        generation_data.tone_of_voice or "",
        generation_data.seo_keywords or ""
    )

    social_media_ads = generate_social_media_ads(
        generation_data.product_name,
        generation_data.category or "",
        generation_data.features or "",
        generation_data.target_audience or "",
        generation_data.tone_of_voice or ""
    )

    email_content = generate_email_content(
        generation_data.product_name,
        generation_data.category or "",
        generation_data.features or "",
        generation_data.target_audience or "",
        generation_data.tone_of_voice or ""
    )

    # Save to database
    db_generation = Generation(
        user_id=current_user.id,
        product_name=generation_data.product_name,
        category=generation_data.category,
        features=generation_data.features,
        target_audience=generation_data.target_audience,
        tone_of_voice=generation_data.tone_of_voice,
        seo_keywords=generation_data.seo_keywords,
        product_description=product_description,
        social_media_ads=social_media_ads,
        email_content=email_content
    )

    db.add(db_generation)
    db.commit()
    db.refresh(db_generation)

    return db_generation

@router.get("/history", response_model=List[GenerationSchema])
async def get_user_generations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all generations for the current user"""
    generations = db.query(Generation).filter(Generation.user_id == current_user.id).order_by(Generation.created_at.desc()).all()
    return generations

@router.get("/{generation_id}", response_model=GenerationSchema)
async def get_generation(
    generation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific generation by ID"""
    generation = db.query(Generation).filter(
        Generation.id == generation_id,
        Generation.user_id == current_user.id
    ).first()

    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")

    return generation

@router.put("/{generation_id}", response_model=GenerationSchema)
async def update_generation(
    generation_id: int,
    generation_update: GenerationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a generation (e.g., toggle favorite status)"""
    generation = db.query(Generation).filter(
        Generation.id == generation_id,
        Generation.user_id == current_user.id
    ).first()

    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")

    # Update fields that are provided
    for field, value in generation_update.dict(exclude_unset=True).items():
        setattr(generation, field, value)

    db.commit()
    db.refresh(generation)
    return generation

@router.delete("/{generation_id}")
async def delete_generation(
    generation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a generation"""
    generation = db.query(Generation).filter(
        Generation.id == generation_id,
        Generation.user_id == current_user.id
    ).first()

    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")

    db.delete(generation)
    db.commit()
    return {"message": "Generation deleted successfully"}
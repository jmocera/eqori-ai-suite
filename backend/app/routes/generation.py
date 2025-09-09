import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter()

def generate_ai_content(product_input: schemas.ProductInput) -> schemas.GeneratedContent:
    """
    Placeholder function for AI content generation
    TODO: Replace with a real LLM API call (e.g., Anthropic, OpenAI)
    """
    
    # Sample generated content based on input
    product_name = product_input.product_name
    features = product_input.input_features
    audience = product_input.input_audience
    tone = product_input.input_tone.lower()
    
    # Generate description based on tone
    if tone == "luxury":
        description = f"Experience the pinnacle of {product_input.product_category.lower()} with {product_name}. Meticulously crafted for the discerning {audience.lower()}, this premium offering combines {features.lower()} in an unparalleled fusion of sophistication and performance. Each element has been thoughtfully designed to exceed expectations and redefine your standards. Indulge in the extraordinary and elevate your lifestyle with this exceptional {product_name}."
    elif tone == "playful":
        description = f"Get ready to fall in love with {product_name}! 🎉 Perfect for {audience.lower()} who want the best of both worlds. With amazing features like {features.lower()}, this {product_input.product_category.lower()} is about to become your new favorite thing. Trust us, once you try it, you won't want to go back to anything else. It's not just a product – it's your new best friend!"
    elif tone == "professional":
        description = f"{product_name} represents a significant advancement in {product_input.product_category.lower()} technology. Designed specifically for {audience.lower()}, this solution delivers {features.lower()} through proven methodologies and rigorous testing. Our commitment to quality ensures reliable performance and measurable results. Choose {product_name} for a professional-grade solution that meets the demanding requirements of today's market."
    else:  # informative
        description = f"{product_name} is a comprehensive {product_input.product_category.lower()} solution designed for {audience.lower()}. Key features include {features.lower()}, providing users with enhanced functionality and improved performance. This product addresses common challenges in the market while offering intuitive usability and reliable results. Learn more about how {product_name} can meet your specific needs and requirements."
    
    # Generate ad copy variations
    ad_copy = [
        f"🔥 New {product_name} is here! Perfect for {audience.lower()} with {features.lower()}. Get yours today!",
        f"Why settle for ordinary? {product_name} delivers {features.lower()} like never before. #{audience}",
        f"Game-changer alert! 🚨 {product_name} - the {product_input.product_category.lower()} {audience.lower()} have been waiting for!"
    ]
    
    # Generate email blurb
    email_blurb = f"We're excited to introduce {product_name}, our latest {product_input.product_category.lower()} designed specifically for {audience.lower()}. Featuring {features.lower()}, this innovative product is set to transform your experience. Don't miss out – order your {product_name} today and discover the difference quality makes!"
    
    return schemas.GeneratedContent(
        product_description=description,
        ad_copy=ad_copy,
        email_blurb=email_blurb
    )

@router.post("/generate", response_model=schemas.GenerationResponse)
def generate_content(
    product_input: schemas.ProductInput,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI content for a product and save to database"""
    
    # Generate AI content
    generated_content = generate_ai_content(product_input)
    
    # Save to database
    db_generation = models.Generation(
        user_id=current_user.id,
        product_name=product_input.product_name,
        product_category=product_input.product_category,
        input_features=product_input.input_features,
        input_audience=product_input.input_audience,
        input_tone=product_input.input_tone,
        input_keywords=product_input.input_keywords,
        generated_description=generated_content.product_description,
        generated_ad_copy=json.dumps(generated_content.ad_copy),
        generated_email_blurb=generated_content.email_blurb
    )
    
    db.add(db_generation)
    db.commit()
    db.refresh(db_generation)
    
    # Convert JSON string back to list for response
    response_data = schemas.GenerationResponse(
        id=db_generation.id,
        product_name=db_generation.product_name,
        product_category=db_generation.product_category,
        input_features=db_generation.input_features,
        input_audience=db_generation.input_audience,
        input_tone=db_generation.input_tone,
        input_keywords=db_generation.input_keywords,
        generated_description=db_generation.generated_description,
        generated_ad_copy=json.loads(db_generation.generated_ad_copy),
        generated_email_blurb=db_generation.generated_email_blurb,
        is_favorite=db_generation.is_favorite,
        created_at=db_generation.created_at
    )
    
    return response_data

@router.get("/generations", response_model=List[schemas.GenerationResponse])
def get_user_generations(
    skip: int = 0,
    limit: int = 50,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all generations for the current user"""
    generations = db.query(models.Generation).filter(
        models.Generation.user_id == current_user.id
    ).order_by(models.Generation.created_at.desc()).offset(skip).limit(limit).all()
    
    response_data = []
    for gen in generations:
        response_data.append(schemas.GenerationResponse(
            id=gen.id,
            product_name=gen.product_name,
            product_category=gen.product_category,
            input_features=gen.input_features,
            input_audience=gen.input_audience,
            input_tone=gen.input_tone,
            input_keywords=gen.input_keywords,
            generated_description=gen.generated_description,
            generated_ad_copy=json.loads(gen.generated_ad_copy),
            generated_email_blurb=gen.generated_email_blurb,
            is_favorite=gen.is_favorite,
            created_at=gen.created_at
        ))
    
    return response_data

@router.get("/generations/{generation_id}", response_model=schemas.GenerationResponse)
def get_generation(
    generation_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific generation by ID"""
    generation = db.query(models.Generation).filter(
        models.Generation.id == generation_id,
        models.Generation.user_id == current_user.id
    ).first()
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found"
        )
    
    return schemas.GenerationResponse(
        id=generation.id,
        product_name=generation.product_name,
        product_category=generation.product_category,
        input_features=generation.input_features,
        input_audience=generation.input_audience,
        input_tone=generation.input_tone,
        input_keywords=generation.input_keywords,
        generated_description=generation.generated_description,
        generated_ad_copy=json.loads(generation.generated_ad_copy),
        generated_email_blurb=generation.generated_email_blurb,
        is_favorite=generation.is_favorite,
        created_at=generation.created_at
    )

@router.put("/generations/{generation_id}", response_model=schemas.GenerationResponse)
def update_generation(
    generation_id: int,
    generation_update: schemas.GenerationUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update a generation (favorite status or content)"""
    generation = db.query(models.Generation).filter(
        models.Generation.id == generation_id,
        models.Generation.user_id == current_user.id
    ).first()
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found"
        )
    
    # Update fields if provided
    if generation_update.is_favorite is not None:
        generation.is_favorite = generation_update.is_favorite
    if generation_update.generated_description is not None:
        generation.generated_description = generation_update.generated_description
    if generation_update.generated_ad_copy is not None:
        generation.generated_ad_copy = json.dumps(generation_update.generated_ad_copy)
    if generation_update.generated_email_blurb is not None:
        generation.generated_email_blurb = generation_update.generated_email_blurb
    
    db.commit()
    db.refresh(generation)
    
    return schemas.GenerationResponse(
        id=generation.id,
        product_name=generation.product_name,
        product_category=generation.product_category,
        input_features=generation.input_features,
        input_audience=generation.input_audience,
        input_tone=generation.input_tone,
        input_keywords=generation.input_keywords,
        generated_description=generation.generated_description,
        generated_ad_copy=json.loads(generation.generated_ad_copy),
        generated_email_blurb=generation.generated_email_blurb,
        is_favorite=generation.is_favorite,
        created_at=generation.created_at
    )

@router.delete("/generations/{generation_id}")
def delete_generation(
    generation_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a generation"""
    generation = db.query(models.Generation).filter(
        models.Generation.id == generation_id,
        models.Generation.user_id == current_user.id
    ).first()
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found"
        )
    
    db.delete(generation)
    db.commit()
    
    return {"message": "Generation deleted successfully"}
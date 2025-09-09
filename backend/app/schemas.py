from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ProductInput(BaseModel):
    product_name: str
    product_category: str
    input_features: str
    input_audience: str
    input_tone: str
    input_keywords: str

class GeneratedContent(BaseModel):
    product_description: str
    ad_copy: List[str]
    email_blurb: str

class GenerationResponse(BaseModel):
    id: int
    product_name: str
    product_category: str
    input_features: str
    input_audience: str
    input_tone: str
    input_keywords: str
    generated_description: str
    generated_ad_copy: List[str]
    generated_email_blurb: str
    is_favorite: bool
    created_at: datetime

    class Config:
        from_attributes = True

class GenerationUpdate(BaseModel):
    is_favorite: Optional[bool] = None
    generated_description: Optional[str] = None
    generated_ad_copy: Optional[List[str]] = None
    generated_email_blurb: Optional[str] = None
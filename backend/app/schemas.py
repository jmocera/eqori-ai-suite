from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class GenerationBase(BaseModel):
    product_name: str
    category: Optional[str] = None
    features: Optional[str] = None
    target_audience: Optional[str] = None
    tone_of_voice: Optional[str] = None
    seo_keywords: Optional[str] = None

class GenerationCreate(GenerationBase):
    pass

class GenerationUpdate(BaseModel):
    product_name: Optional[str] = None
    category: Optional[str] = None
    features: Optional[str] = None
    target_audience: Optional[str] = None
    tone_of_voice: Optional[str] = None
    seo_keywords: Optional[str] = None
    is_favorited: Optional[bool] = None

class Generation(GenerationBase):
    id: int
    user_id: int
    product_description: Optional[str] = None
    social_media_ads: Optional[str] = None
    email_content: Optional[str] = None
    is_favorited: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
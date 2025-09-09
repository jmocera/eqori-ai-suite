from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    generations = relationship("Generation", back_populates="user")

class Generation(Base):
    __tablename__ = "generations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_name = Column(String, nullable=False)
    product_category = Column(String, nullable=False)
    input_features = Column(Text)
    input_audience = Column(String)
    input_tone = Column(String)
    input_keywords = Column(Text)
    generated_description = Column(Text)
    generated_ad_copy = Column(Text)  # JSON string for array of ad copies
    generated_email_blurb = Column(Text)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="generations")
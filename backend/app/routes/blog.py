from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import re
from ..database import get_db
from ..models import BlogPost, User
from ..schemas import BlogPostCreate, BlogPostUpdate, BlogPost as BlogPostSchema, BlogPostPublic
from ..auth import get_current_user, get_current_active_user
from openai import OpenAI
import os
from sqlalchemy import desc, func

router = APIRouter(prefix="/blog", tags=["blog"])

def create_slug(title: str) -> str:
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
    slug = re.sub(r'\s+', '-', slug.strip())
    return slug[:100]

def generate_blog_content(topic: str, category: str = "AI Marketing") -> dict:
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        # Generate blog content with SEO focus
        prompt = f"""
        Write a comprehensive blog post about "{topic}" in the {category} category.

        Create:
        1. SEO-optimized title (60 characters or less)
        2. Meta description (150-160 characters)
        3. Excerpt (150-200 characters)
        4. Full article content (800-1200 words) with proper headings
        5. SEO keywords (comma-separated)
        6. Tags (comma-separated)

        Focus on:
        - Actionable insights
        - Industry trends
        - Practical tips
        - Real-world examples
        - SEO optimization

        Format as JSON with keys: title, meta_description, excerpt, content, keywords, tags
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        import json
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate blog content: {str(e)}")

@router.post("/generate", response_model=BlogPostSchema)
async def generate_blog_post(
    topic: str,
    category: str = "AI Marketing",
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    content_data = generate_blog_content(topic, category)

    slug = create_slug(content_data["title"])

    # Check if slug exists and make it unique
    existing = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if existing:
        slug = f"{slug}-{datetime.now().strftime('%Y%m%d')}"

    blog_post = BlogPost(
        title=content_data["title"],
        slug=slug,
        content=content_data["content"],
        excerpt=content_data["excerpt"],
        meta_description=content_data["meta_description"],
        keywords=content_data["keywords"],
        category=category,
        tags=content_data["tags"],
        user_id=current_user.id,
        published_at=datetime.now()
    )

    db.add(blog_post)
    db.commit()
    db.refresh(blog_post)

    return blog_post

@router.get("/", response_model=List[BlogPostPublic])
async def get_blog_posts(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(BlogPost).filter(BlogPost.is_published == True)

    if category:
        query = query.filter(BlogPost.category == category)

    posts = query.order_by(desc(BlogPost.published_at)).offset(skip).limit(limit).all()
    return posts

@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(BlogPost.category).filter(
        BlogPost.is_published == True,
        BlogPost.category.isnot(None)
    ).distinct().all()
    return [cat[0] for cat in categories if cat[0]]

@router.get("/{slug}", response_model=BlogPostSchema)
async def get_blog_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(
        BlogPost.slug == slug,
        BlogPost.is_published == True
    ).first()

    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    # Increment view count
    post.view_count += 1
    db.commit()

    return post

@router.get("/admin/posts", response_model=List[BlogPostSchema])
async def get_admin_posts(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    posts = db.query(BlogPost).filter(BlogPost.user_id == current_user.id).order_by(desc(BlogPost.created_at)).offset(skip).limit(limit).all()
    return posts

@router.put("/{post_id}", response_model=BlogPostSchema)
async def update_blog_post(
    post_id: int,
    post_update: BlogPostUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(BlogPost).filter(
        BlogPost.id == post_id,
        BlogPost.user_id == current_user.id
    ).first()

    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    update_data = post_update.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(post, field, value)

    if post_update.title and post_update.title != post.title:
        post.slug = create_slug(post_update.title)

    db.commit()
    db.refresh(post)

    return post

@router.delete("/{post_id}")
async def delete_blog_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(BlogPost).filter(
        BlogPost.id == post_id,
        BlogPost.user_id == current_user.id
    ).first()

    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    db.delete(post)
    db.commit()

    return {"message": "Blog post deleted successfully"}

@router.post("/auto-generate")
async def auto_generate_daily_posts(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate daily blog posts for SEO and growth"""

    topics = [
        "AI Marketing Trends in 2024",
        "How to Write Converting Product Descriptions",
        "Social Media Ad Strategies for E-commerce",
        "Email Marketing Automation Best Practices",
        "SEO Tips for Product Pages",
        "AI Content Generation Tools Comparison",
        "Marketing Psychology for Better Conversions",
        "Customer Journey Optimization",
        "Content Marketing ROI Measurement",
        "Voice Search Optimization for Products"
    ]

    categories = ["AI Marketing", "E-commerce", "SEO", "Content Marketing", "Automation"]

    generated_posts = []

    for i, topic in enumerate(topics[:3]):  # Generate 3 posts per request
        try:
            category = categories[i % len(categories)]
            content_data = generate_blog_content(topic, category)

            slug = create_slug(content_data["title"])
            existing = db.query(BlogPost).filter(BlogPost.slug == slug).first()
            if existing:
                slug = f"{slug}-{datetime.now().strftime('%Y%m%d%H%M')}"

            blog_post = BlogPost(
                title=content_data["title"],
                slug=slug,
                content=content_data["content"],
                excerpt=content_data["excerpt"],
                meta_description=content_data["meta_description"],
                keywords=content_data["keywords"],
                category=category,
                tags=content_data["tags"],
                user_id=current_user.id,
                published_at=datetime.now()
            )

            db.add(blog_post)
            generated_posts.append(blog_post.title)

        except Exception as e:
            print(f"Error generating post for topic '{topic}': {str(e)}")
            continue

    db.commit()

    return {
        "message": f"Generated {len(generated_posts)} blog posts",
        "posts": generated_posts
    }
# Eqori AI Marketing Suite

An AI-Powered E-commerce Product Description & Marketing Suite built with FastAPI and React. Generate high-quality, SEO-optimized product descriptions, social media ad copy, and email marketing content for small businesses and dropshippers.

## Features

### Core Functionality
- **AI Content Generation**: Generate SEO-optimized product descriptions, social media ad copy, and email marketing content
- **User Authentication**: Secure JWT-based authentication system
- **Content Management**: Save, edit, and organize your generated content
- **Favorites System**: Mark important content as favorites for easy access
- **Content History**: View and manage all previously generated content

### Technical Features
- **Modern Stack**: FastAPI backend with React frontend
- **PostgreSQL Database**: Reliable data storage
- **Docker Support**: Easy deployment with Docker Compose
- **Responsive Design**: Clean, mobile-friendly interface
- **RESTful API**: Well-structured API endpoints

## Technology Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Relational database
- **JWT Authentication** - Secure token-based auth
- **Pydantic** - Data validation and settings management

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Clean, responsive styling

## Project Structure

```
eqori-ai-marketing-suite/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # Authentication logic
│   │   ├── database.py          # Database configuration
│   │   └── routes/
│   │       ├── auth.py          # Authentication routes
│   │       └── generation.py    # Content generation routes
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile              # Backend container config
│   └── .env.example            # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── contexts/          # React contexts (Auth)
│   │   ├── services/          # API service layer
│   │   ├── pages/             # Page components
│   │   └── App.jsx            # Main App component
│   ├── package.json           # Node.js dependencies
│   ├── Dockerfile            # Frontend container config
│   └── .env.example          # Environment variables template
├── docker-compose.yml        # Multi-container orchestration
└── README.md                # This file
```

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eqori-ai-marketing-suite
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your settings
   
   # Frontend  
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your settings
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend Setup

1. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up PostgreSQL database**
   ```bash
   # Install PostgreSQL and create database
   createdb eqori_db
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run the backend**
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Content Generation
- `POST /api/generate` - Generate marketing content
- `GET /api/generations` - Get user's content history
- `GET /api/generations/{id}` - Get specific generation
- `PUT /api/generations/{id}` - Update generation (edit/favorite)
- `DELETE /api/generations/{id}` - Delete generation

## Database Schema

### Users Table
- `id` - Primary key
- `email` - User email (unique)
- `password_hash` - Hashed password
- `created_at` - Account creation timestamp

### Generations Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `product_name` - Product name
- `product_category` - Product category
- `input_features` - Product features input
- `input_audience` - Target audience
- `input_tone` - Tone of voice
- `input_keywords` - SEO keywords
- `generated_description` - Generated product description
- `generated_ad_copy` - Generated social media ads (JSON)
- `generated_email_blurb` - Generated email content
- `is_favorite` - Favorite status
- `created_at` - Generation timestamp

## AI Integration

The application currently uses placeholder content generation for demonstration. To integrate with a real LLM service:

1. **Choose your LLM provider** (OpenAI, Anthropic, etc.)
2. **Update the generation function** in `backend/app/routes/generation.py`
3. **Replace the `generate_ai_content` function** with actual API calls
4. **Add your API keys** to environment variables

Example integration:
```python
# In backend/app/routes/generation.py
async def generate_ai_content(product_input: schemas.ProductInput):
    # Replace with actual LLM API call
    # e.g., OpenAI, Anthropic Claude, etc.
    response = await llm_client.generate(
        prompt=create_prompt(product_input),
        max_tokens=500
    )
    return parse_response(response)
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/eqori_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
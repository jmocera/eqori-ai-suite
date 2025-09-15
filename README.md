# Eqori AI Marketing Suite

A full-stack AI-powered application for generating comprehensive marketing content including SEO-optimized product descriptions, social media ads, and email marketing campaigns.

## 🚀 Features

### AI Content Generation
- **SEO-Optimized Product Descriptions**: 200-300 word descriptions incorporating target keywords
- **Social Media Ad Variations**: 3 unique ads optimized for Facebook/Instagram, Twitter, and LinkedIn
- **Email Marketing Content**: Complete email campaigns with subject lines and CTAs

### User Management
- User registration and authentication with JWT tokens
- Secure password hashing with bcrypt
- Protected routes and session management

### Content Management
- Save and manage all generated content
- Content history with search and filtering
- Favorite content for quick access
- Copy-to-clipboard functionality

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **OpenAI GPT-3.5-turbo**: AI content generation
- **JWT**: Secure authentication
- **SQLite**: Database (configurable for PostgreSQL)

### Frontend
- **React 18**: Modern JavaScript framework
- **React Router**: Client-side routing
- **Bootstrap 5**: CSS framework
- **Axios**: HTTP client for API calls

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- OpenAI API Key

## 🔧 Local Development Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=sqlite:///./eqori.db
SECRET_KEY=your-secret-key-here
```

5. Start the backend server:
```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Using Docker Compose

1. Set your OpenAI API key:
```bash
export OPENAI_API_KEY=your-openai-api-key-here
```

2. Build and start all services:
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: `http://localhost:80`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

## 🌐 Cloud Deployment

### Render.com

1. **Backend Deployment**:
   - Connect your GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables:
     - `OPENAI_API_KEY`
     - `SECRET_KEY`
     - `DATABASE_URL` (for PostgreSQL)

2. **Frontend Deployment**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL`

### DigitalOcean App Platform

1. Create a new app from your GitHub repository
2. Configure the backend service:
   - Source: `backend/`
   - Build command: `pip install -r requirements.txt`
   - Run command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Configure the frontend service:
   - Source: `frontend/`
   - Build command: `npm run build`
   - Output directory: `build`

## 📝 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

### Key Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /generation/generate` - Generate AI marketing content
- `GET /generation/history` - Get user's generation history
- `PUT /generation/{id}` - Update generation (favorite/unfavorite)
- `DELETE /generation/{id}` - Delete generation

## 🧪 Testing

The application includes comprehensive testing via Playwright for end-to-end testing:

1. User registration and authentication
2. AI content generation workflow
3. Content management and persistence
4. Navigation and UI interactions

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy ORM

## 📊 Performance Considerations

- Efficient database queries with SQLAlchemy
- Client-side routing with React Router
- Static asset caching with nginx
- Database connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue on GitHub.

---

Built with ❤️ using FastAPI, React, and OpenAI GPT-3.5-turbo
# WemaOne — Connected Banking Intelligence Platform

**One Customer Journey. One Connected Banking Ecosystem. One Intelligence Layer Powering Better Decisions.**

---

## Overview

WemaOne is a connected digital banking experience and intelligence platform designed around the complete customer journey. It connects customers, branches, payments, documents and intelligence into one seamless banking experience.

## Architecture

```
React (Vite + Tailwind CSS)
    ↓
Flask REST API
    ↓
Business Logic (Services)
    ↓
SQLite / PostgreSQL
```

## Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Recharts (available)

### Backend
- Python 3
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-Marshmallow
- bcrypt

## Features

### Core Customer Journey
1. **Discover** — Browse services and requirements
2. **Book** — Schedule appointments at branches
3. **Verify** — Upload and AI-verify documents (TrustVerify)
4. **Pay** — Process fees via WemaPay sandbox
5. **Visit** — Join digital queue (SmartQueue)
6. **Serve** — Branch officers manage queue
7. **Feedback** — Submit and AI-analyze feedback (SocialPulse)
8. **Intelligence** — Executive analytics dashboard

### Modules
- **SmartQueue** — Digital queue and appointment management
- **TrustVerify AI** — AI-powered document verification
- **WemaPay** — Integrated payment processing (sandbox)
- **SocialPulse** — AI feedback intelligence and sentiment analysis
- **BranchConnect** — Internal branch knowledge sharing
- **WemaOne Intelligence** — Executive analytics dashboard

## Local Setup

### Prerequisites
- Python 3.8+
- Node.js 18+

### Backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
python seed.py               # Seed demo data
python app.py                # Start on port 5000
```

### Frontend

```bash
cd Frontend
npm install
npm run dev                  # Start on port 5173
```

## Environment Variables

Create `Backend/.env` from `.env.example`:

```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///wemaone.db
CORS_ORIGINS=http://localhost:5173
AI_ENABLED=false
AI_PROVIDER=mock
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | david@test.com | password123 |
| Branch Officer | officer1@wemaone.com | password123 |
| Branch Manager | manager1@wemaone.com | password123 |
| Admin | admin@wemaone.com | password123 |
| Super Admin | superadmin@wemaone.com | password123 |

## Demo Flow

1. Login as **david@test.com** (Customer)
2. Browse services, check requirements
3. Book an appointment at a branch
4. Join queue, receive ticket WMA-XXXX
5. Upload documents, see TrustVerify analysis
6. Pay service fee via WemaPay sandbox
7. Submit feedback, see AI sentiment analysis
8. Login as **admin@wemaone.com**
9. View intelligence dashboard with insights
10. View BranchConnect solutions

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/services/ | List services |
| GET | /api/branches/ | List branches |
| POST | /api/appointments/ | Create appointment |
| GET | /api/appointments/slots | Get available slots |
| POST | /api/queues/ | Join queue |
| POST | /api/queues/:id/check-in | Check in |
| POST | /api/queues/:id/complete | Complete service |
| POST | /api/documents/upload | Upload document |
| POST | /api/payments/ | Process payment |
| POST | /api/feedback/ | Submit feedback |
| GET | /api/feedback/analysis | Get analysis |
| GET | /api/branchconnect/posts | List posts |
| POST | /api/branchconnect/posts | Create post |
| GET | /api/analytics/dashboard | Dashboard data |
| GET | /api/analytics/insights | AI insights |

## AI Integration

The application uses a mock AI provider by default. Set `AI_ENABLED=true` and configure `OPENAI_API_KEY` or `GEMINI_API_KEY` to use real AI services.

## Known Limitations

- Uses SQLite by default (switch to PostgreSQL for production)
- Mock payment processing (no real WemaPay integration)
- Mock OCR/AI verification (no real document scanning)
- No real-time WebSocket for queue updates
- No email/SMS notification service

## Future Wema Integrations

- Real WemaPay API integration
- Wema Bank branch data API
- Supabase PostgreSQL + Auth
- Real OCR document processing
- OpenAI/Gemini AI analysis
- WebSocket real-time updates
- Email/SMS notification service

# Luma — Customer Service for the Digital Economy

**One Connected Customer Service Delivery Experience.**

---

## Overview

Luma is a connected customer-service and operations-intelligence platform. It connects customers, branches, payments, documents and intelligence into one seamless service experience.

## Architecture

```
React (Vite + Tailwind CSS)
    ↓
Flask REST API
    ↓
Business Logic (Services)
    ↓
PostgreSQL (production) / SQLite (local fallback)
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
- psycopg2 (PostgreSQL driver)

## Features

### Core Customer Journey

1. **Discover** — Browse services and requirements
2. **Book** — Schedule appointments at branches
3. **Verify** — Upload and AI-verify documents (TrustVerify)
4. **Pay** — Pay fees with Bank Account via ALAT Authenticator
5. **Visit** — Join digital queue (SmartQueue)
6. **Serve** — Branch officers manage queue
7. **Feedback** — Submit and AI-analyze feedback (SocialPulse)
8. **Intelligence** — Executive analytics dashboard

### Modules

- **SmartQueue** — Digital queue and appointment management
- **TrustVerify AI** — AI-powered document verification
- **ALAT Authenticator** — Pay with Bank Account (Wema/ALAT API)
- **SocialPulse** — AI feedback intelligence and sentiment analysis
- **BranchConnect** — Internal branch knowledge sharing
- **Luma Intelligence** — Executive analytics dashboard

## Local Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL (optional locally — SQLite is the fallback)

### Backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env         # then edit values
python seed.py               # Seed demo data (drops + recreates)
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

# PostgreSQL in production; SQLite fallback if blank.
DATABASE_URL=postgresql://user:password@host:5432/luma

# 1 = seed demo data on first boot, 0 = never seed
SEED_DATA=0

CORS_ORIGINS=http://localhost:5173

# AI (free tiers) — groq | gemini | mock
AI_ENABLED=false
AI_PROVIDER=mock
GROQ_API_KEY=
GEMINI_API_KEY=

# ALAT Authenticator (Pay with Bank Account)
ALAT_SANDBOX=true
ALAT_BASE_URL=https://sandbox-api.wemabank.com/alat/authenticator
ALAT_CLIENT_ID=
ALAT_CLIENT_SECRET=
ALAT_CALLBACK_URL=
```

Frontend uses `Frontend/.env` (see `Frontend/.env.example`):

```
VITE_API_URL=            # blank = same-origin /api reverse proxy
```

## Demo Credentials

| Role           | Email                  | Password    |
| -------------- | ---------------------- | ----------- |
| Customer       | david@test.com         | password123 |
| Branch Officer | officer1@luma.com      | password123 |
| Branch Manager | manager1@luma.com      | password123 |
| Admin          | admin@luma.com         | password123 |
| Super Admin    | superadmin@luma.com    | password123 |

## Demo Flow

1. Login as **david@test.com** (Customer)
2. Browse services, check requirements
3. Book an appointment at a branch
4. Join queue, receive ticket LUM-XXXX
5. Upload documents, see TrustVerify analysis
6. Initiate a fee payment via ALAT Authenticator (approve in ALAT app)
7. Submit feedback, see AI sentiment analysis
8. Login as **admin@luma.com**
9. View intelligence dashboard with insights
10. View BranchConnect solutions

## API Endpoints

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| POST   | /api/auth/register              | Register user            |
| POST   | /api/auth/login                 | Login                    |
| GET    | /api/auth/me                    | Get current user         |
| GET    | /api/services/                  | List services            |
| GET    | /api/branches/                  | List branches            |
| POST   | /api/appointments/              | Create appointment       |
| GET    | /api/appointments/slots         | Get available slots      |
| POST   | /api/queues/                    | Join queue               |
| POST   | /api/queues/:id/check-in        | Check in                 |
| POST   | /api/queues/:id/complete        | Complete service         |
| POST   | /api/documents/upload           | Upload document          |
| POST   | /api/payments/                  | Initiate ALAT payment    |
| POST   | /api/payments/:id/verify        | Verify ALAT payment      |
| POST   | /api/feedback/                  | Submit feedback          |
| GET    | /api/feedback/analysis          | Get analysis             |
| GET    | /api/branchconnect/posts        | List posts               |
| POST   | /api/branchconnect/posts        | Create post              |
| GET    | /api/analytics/dashboard        | Dashboard data           |
| GET    | /api/analytics/insights         | AI insights              |
| GET    | /api/notifications/             | My notifications         |
| GET    | /api/notifications/unread-count | Unread count             |
| POST   | /api/notifications/broadcast    | Admin broadcast          |
| GET    | /api/audit-logs/                | Audit trail (admin)      |
| GET    | /api/system/health              | Health check             |
| GET    | /api/system/info                | Version / environment    |
| GET    | /api/system/stats               | Entity counts            |
| GET    | /api/social-studio/overview     | Feedback intelligence    |
| POST   | /api/social-studio/analyze      | Analyze text with AI     |

## AI Integration

Luma uses a deterministic **mock** provider by default (works offline, costs nothing). Set `AI_ENABLED=true` and `AI_PROVIDER=groq` or `gemini` with a free API key to use real models:

- **Groq** — `GROQ_API_KEY`, model `llama-3.3-70b-versatile` (free tier, OpenAI-compatible)
- **Gemini** — `GEMINI_API_KEY`, model `gemini-2.0-flash` (free AI Studio key)

## Deployment

```bash
# Production
export FLASK_ENV=production
export DATABASE_URL=postgresql://...
export SECRET_KEY=...
export JWT_SECRET_KEY=...
export CORS_ORIGINS=https://your-frontend-domain
export SEED_DATA=0

gunicorn --bind 0.0.0.0:8000 wsgi:app
```

Build the frontend with `npm run build` (output in `Frontend/dist`) and set `VITE_API_URL` to your API origin if not served behind a same-origin `/api` reverse proxy.

## Known Limitations

- Payments require real `ALAT_CLIENT_ID` / `ALAT_CLIENT_SECRET`; until configured they fail with `ALAT_NOT_CONFIGURED` (no fake success)
- Mock OCR/AI verification when no AI key is configured
- No real-time WebSocket for queue updates
- No email/SMS notification delivery (in-app notifications only)
- Local file storage for uploads (use object storage in production)

## Future Integrations

- Real Wema Bank branch data API
- Object storage for document uploads
- Supabase PostgreSQL + Auth
- Real OCR document processing
- WebSocket real-time updates
- Email/SMS notification delivery

# Non_queue_Bank (NQB) — One Connected Customer Service Delivery Experience

**Multi-tenant SaaS platform connecting customers, branches, payments, documents and AI-driven intelligence into one seamless banking-service experience.**

---

## Overview

Non_queue_Bank (NQB) is a turnkey, white-label-ready customer-service platform for banks and financial institutions. It ships as a **full multi-tenant SaaS product**: each organization (bank, fintech, branch network) gets its own isolated workspace with its own users, branches, services, appointments, queues, documents, payments and analytics. A built-in platform console lets the operator onboard new customers, manage plans, and monitor every org.

The product is fully demo-able out of the box: one-command seeding creates a complete organization with customers, officers, queues, documents and AI-generated insights.

> Multi-tenant data model, tenant resolution, and the platform console are documented in [`docs/multi-tenancy.md`](docs/multi-tenancy.md).

## Architecture

```
React (Vite + Tailwind CSS)
    ↓
Flask REST API (JWT + role-based access)
    ↓
Business Logic (Services layer)
    ↓
PostgreSQL (production) / SQLite (local fallback)
    ↓
Multi-tenant: every row is scoped by organization_id
```

Every tenant (bank/fintech) is represented by an `Organization` row with a unique slug. All business data is scoped to `organization_id`, resolved at the API layer from the JWT (`org_id` claim) or from an explicit `?org=` slug on public endpoints. Legacy data is backfilled into a default org automatically on first boot.

## Technology Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Recharts
- Custom SVG icon system

### Backend

- Python 3 (Flask 3)
- Flask-SQLAlchemy
- Flask-JWT-Extended (JWT auth with role + org claims)
- Flask-CORS
- Flask-Marshmallow
- SQLAlchemy 2.0
- bcrypt
- psycopg2 (PostgreSQL driver)
- flask-limiter (rate limiting)
- pytest (test suite: 25 passing tests)

## Features

### SaaS / Tenant Layer

- **Organizations** — self-serve workspace signup (`/workspace`), unique slug, org type (BANK/FINTECH/CUSTOMER), plan tier
- **Subscriptions** — plan tiers (Starter / Pro / Enterprise), status lifecycle (trialing → active → cancelled), start/end dates
- **Tenant isolation** — all rows scoped by `organization_id`; API resolves org from JWT or public slug
- **Platform console** — `SUPER_ADMIN` console to create/update orgs, change plans, and view per-org stats
- **Auto-migration** — adds missing `organization_id` columns and backfills legacy data on boot (SQLite + PostgreSQL)

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

- **Multi-tenant workspaces** — org onboarding, plan management, per-org data isolation
- **SmartQueue** — Digital queue and appointment management
- **TrustVerify AI** — AI-powered document verification
- **ALAT Authenticator** — Pay with Bank Account (Wema/ALAT API)
- **SocialPulse** — AI feedback intelligence and sentiment analysis
- **BranchConnect** — Internal branch knowledge sharing
- **NQB Intelligence** — Executive analytics dashboard
- **Audit trail** — full per-org audit logging of actions

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

Alternatively, set `SEED_DATA=1` in `Backend/.env` — the app auto-creates tables, applies tenant migrations, creates/backs-up the default `nqb` organization, and seeds demo data on first boot (idempotent).

### Frontend

```bash
cd Frontend
npm install
npm run dev                  # Start on port 5173
```

### Tests

```bash
cd Backend
python -m pytest -q          # 25 tests: core flows + multi-tenant isolation
```

### Frontend build + lint

```bash
cd Frontend
npm run build
npm run lint
```

## Environment Variables

Create `Backend/.env` from `.env.example`:

```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# PostgreSQL in production; SQLite fallback if blank.
DATABASE_URL=postgresql://user:password@host:5432/nqb

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

The seeded `Non_queue_Bank` organization ships with these accounts (all `password123`):

| Role           | Email                  | Password    |
| -------------- | ---------------------- | ----------- |
| Customer       | david@test.com         | password123 |
| Branch Officer | officer1@nqb.app      | password123 |
| Branch Manager | manager1@nqb.app      | password123 |
| Admin          | admin@nqb.app         | password123 |
| Super Admin    | superadmin@nqb.app    | password123 |

## Demo Flow

1. Visit `/workspace` — create your own organization (bank or fintech) and admin account in seconds
2. Login as **david@test.com** (Customer) to see a seeded org's experience
3. Browse services, check requirements
4. Book an appointment at a branch
5. Join queue, receive ticket LUM-XXXX
6. Upload documents, see TrustVerify analysis
7. Initiate a fee payment via ALAT Authenticator (approve in ALAT app)
8. Submit feedback, see AI sentiment analysis
9. Login as **superadmin@nqb.app** to open the platform console and manage orgs/plans
10. Login as **admin@nqb.app** for branch admin, intelligence dashboard and BranchConnect

## API Overview

| Method | Endpoint                             | Description                        |
| ------ | ------------------------------------ | ---------------------------------- |
| POST   | /api/auth/register                   | Register user (joins an org)       |
| POST   | /api/auth/login                      | Login                               |
| GET    | /api/auth/me                         | Get current user                   |
| GET    | /api/organizations/                  | Public org list                    |
| GET    | /api/organizations/:slug             | Org by slug                        |
| POST   | /api/organizations/                  | Self-serve workspace signup        |
| GET    | /api/organizations/me                | My org (JWT)                       |
| *      | /api/organizations/platform          | Platform console (SUPER_ADMIN)     |
| GET    | /api/services/                       | List services                      |
| GET    | /api/branches/                       | List branches                      |
| POST   | /api/appointments/                   | Create appointment                 |
| GET    | /api/appointments/slots              | Get available slots                |
| POST   | /api/queues/                         | Join queue                         |
| POST   | /api/queues/:id/check-in             | Check in                           |
| POST   | /api/queues/:id/complete             | Complete service                   |
| POST   | /api/documents/upload                | Upload document                    |
| POST   | /api/payments/                       | Initiate ALAT payment              |
| POST   | /api/payments/:id/verify             | Verify ALAT payment                |
| POST   | /api/feedback/                       | Submit feedback                    |
| GET    | /api/feedback/analysis               | Get analysis                       |
| GET    | /api/branchconnect/posts             | List posts                         |
| GET    | /api/analytics/dashboard             | Dashboard data                     |
| GET    | /api/analytics/insights              | AI insights                        |
| GET    | /api/notifications/                  | My notifications                   |
| GET    | /api/audit-logs/                     | Audit trail (admin)                |
| GET    | /api/system/health                   | Health check                       |
| GET    | /api/system/info                     | Version / environment              |

All endpoints are tenant-scoped: authenticated calls use your org from the JWT; public listing endpoints accept `?org=<slug-or-id>`.

## AI Integration

NQB uses a deterministic **mock** provider by default (works offline, costs nothing). Set `AI_ENABLED=true` and `AI_PROVIDER=groq` or `gemini` with a free API key to use real models:

- **Groq** — `GROQ_API_KEY`, model `llama-3.3-70b-versatile` (free tier, OpenAI-compatible)
- **Gemini** — `GEMINI_API_KEY`, model `gemini-2.0-flash` (free AI Studio key)

## Deployment

### Backend on Render (API + PostgreSQL)

1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, select the repo. Render reads `render.yaml` and creates `luma-api` (Flask, `gunicorn wsgi:app`, rootDir `Backend`) and `luma-db` (PostgreSQL).
3. Set the `sync: false` secrets: `CORS_ORIGINS` (your frontend URL), `ALAT_CLIENT_ID`, `ALAT_CLIENT_SECRET`, and optionally `GROQ_API_KEY` / `GEMINI_API_KEY`.
4. `SEED_DATA=1` seeds demo data on first boot (idempotent — skipped once data exists).
5. Health check: `GET https://<luma-api>.onrender.com/api/system/health`

### Frontend on Render / Vercel

1. Import the repo (root directory `Frontend`, Vite auto-detected).
2. Add `VITE_API_URL=https://<luma-api>.onrender.com/api`.
3. Add a Rewrite so SPA routing works: `/*` → `/index.html` (200). Keep the `/api/*` pass-through to the backend.
4. Copy the frontend URL back into `CORS_ORIGINS` and redeploy the API.

### Manual / other hosts

```bash
export FLASK_ENV=production
export DATABASE_URL=postgresql://...
export SECRET_KEY=...
export JWT_SECRET_KEY=...
export CORS_ORIGINS=https://your-frontend-domain
export SEED_DATA=0

gunicorn --bind 0.0.0.0:8000 wsgi:app
```

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
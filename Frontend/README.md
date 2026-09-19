# Luma — Frontend

React 19 + Vite + Tailwind CSS web app for the Luma customer-service platform.

## Setup

```bash
npm install
```

## Configuration

Copy `Frontend/.env.example` to `Frontend/.env`:

```
VITE_API_URL=            # blank = same-origin /api reverse proxy
```

Point `VITE_API_URL` at the backend root, e.g. `https://luma-backend.onrender.com/api`.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start dev server on port 5173        |
| `npm run build`   | Production build to `dist/`          |
| `npm run lint`    | Oxlint static checks                 |
| `npm run preview` | Preview the production build         |

## Structure

```
src/
├── components/        Shared UI (Navbar, ScrollReveal, SvgIcon, ui/...)
├── context/           AuthContext (login/register, workspace signup)
├── pages/
│   ├── public/        Landing, Register, Login, CreateWorkspace
│   ├── customer/      Customer journey (services, appointments, queue, docs, payments)
│   ├── branch/        Branch officer/manager dashboards
│   └── admin/         Admin + platform dashboards
├── routes/            Protected route wrappers (per role)
└── App.jsx            Route definitions
```

## SPA Routing

For non-Vite hosts, add a rewrite rule so every path serves `index.html`:

- Render: Rewrite `/*` → `/index.html` (200)
- Vercel: handled by `vercel.json` (`/assets/*` and `/videos/*` stay static)
# Multi-Tenancy Architecture

Non_queue_Bank (NQB) is a single-deploy multi-tenant SaaS: one API + one database serves many
bank/fintech organizations, each fully isolated.

## Entity Model

```
Organization ── 1:N ── User, Branch, Service, Document, Payment,
   (name,            Feedback, BranchPost, BranchSolution,
    slug,             QueueTicket, Appointment, Notification,
    type, plan)      AuditLog
         │
         └── 1:1 ── Subscription
              (plan: STARTER | PRO | ENTERPRISE,
               status: TRIALING | ACTIVE | CANCELLED, start/end date)
```

Every tenant table carries `organization_id` (nullable + indexed) as a
ForeignKey to `organizations.id`.

## Resolving the Tenant

**Tenant resolution order** (in `services/tenant.py`):

1. **Authenticated requests** — the JWT carries `org_id` as an
   `additional_claim` at login/register time (`routes/auth.py`). All
   `*_org_id()` helpers return the JWT org, and every route scopes queries
   with it. A user can never see another org's rows (verified by tests).
2. **Public endpoint** (e.g. `GET /api/services/`) — reads `?org=<slug-or-id>`
   via `resolve_public_org_id()`, falling back to the default org (slug `nqb`) so
   the demo keeps working with a plain URL.
3. **Registration** — `register` accepts `organization_id` or
   `organization_slug`, defaults to the first org.

## Boot-Time Migration (`app.py:_ensure_tenant_schema`)

On every boot, before the server accepts traffic:

1. Create missing tables (including `organizations`, `subscriptions`).
2. For each table in `TENANT_TABLES`, if `organization_id` is missing, run
   `ALTER TABLE ... ADD COLUMN organization_id INTEGER` (SQLite and
   PostgreSQL both supported; SQLite also handles the column-only case via
   `_ensure_columns`).
3. `ensure_default_org()` creates the default org (slug `nqb`), renaming a
   legacy `luma` org if one exists.
4. `backfill_org_rows()` assigns any rows with `NULL organization_id` to the
   default org, so a pre-SaaS database upgrades cleanly with zero manual work.

## Role Model

| Role          | Scope                                   |
| ------------- | --------------------------------------- |
| CUSTOMER      | Their own docs, payments, appointments  |
| OFFICER       | Their branch's queue + services         |
| MANAGER       | Branch-level management                 |
| ADMIN         | Org-level admin (default workspace owner) |
| SUPER_ADMIN   | Platform console: all orgs, plans, stats |

## Platform Console

`/api/organizations/platform` endpoints are gated to `SUPER_ADMIN` and expose:

- `GET` — list all orgs
- `POST` — create an org
- `PATCH /:id` — update org/plan (e.g. plan upgrade)
- `GET /:id/stats` — entity counts per org

## Testing

`tests/test_saas.py` covers: workspace signup, slug uniqueness, org listing,
register-with-org, tenant isolation (user A cannot see user B's org data),
public scope resolution, platform-admin gating, and plan updates.
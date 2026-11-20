# VINK Group API

Fastify + PostgreSQL backend for the VINK Group website.

| Area | What it does |
|---|---|
| Enquiries | Stores contact-form submissions (incl. insurance & immigration details), routes email by enquiry type, auto-replies to the sender |
| Newsletter | Subscribe / unsubscribe (one-click link) / resubscribe; never reveals who is subscribed |
| Careers | Job listings and applications (CV and LinkedIn as https links) |
| News | Articles with draft/published, categories, featured flag |
| Admin | Password-protected API powering the `/admin` dashboard on the website, with CSV export |

## Run locally

```bash
cd server
pnpm install
ADMIN_PASSWORD='choose-something-long' pnpm dev      # http://localhost:8787
```

With no `DATABASE_URL` it uses an on-disk embedded Postgres (PGlite) in `server/.data`, so nothing needs installing.
In another terminal run the website from the repo root (`pnpm dev`); Vite proxies `/api` to the API.
The admin dashboard is at `/admin` on the website.

## Test

```bash
pnpm test                                                       # in-memory Postgres
TEST_DATABASE_URL=postgres://user:pass@host/emptydb pnpm test   # real PostgreSQL
```

29 tests cover validation, spam protection, auth, CORS, rate limits, and CSV/SQL-injection safety.

## Deploy on Railway

1. In your Railway project: **New → Database → PostgreSQL**.
2. **New → GitHub Repo → this repo**, then in that service's **Settings → Root Directory** set `/server`.
3. Add the variables from `.env.example` (for `DATABASE_URL` use a reference variable to the Postgres service).
4. Generate a public domain for the API service.
5. On the **website** service, add the build variable `VITE_API_URL=https://<your-api-domain>` and redeploy.
6. Put the website's URL in the API's `ALLOWED_ORIGINS`.

Tables are created automatically on boot; sample jobs and articles are seeded only while those tables are empty.
The production server refuses to start without `DATABASE_URL` and a strong `SESSION_SECRET`.

## API

Public

- `GET  /api/health`
- `POST /api/enquiries`
- `POST /api/newsletter/subscribe` · `GET /api/newsletter/unsubscribe?token=`
- `GET  /api/jobs` · `POST /api/jobs/:slug/apply`
- `GET  /api/articles?category=&limit=` · `GET /api/articles/:slug`

Admin (`Authorization: Bearer <token>` from `POST /api/admin/login`)

- `GET /api/admin/stats`
- `GET|PATCH|DELETE /api/admin/enquiries[/:id]` · `GET /api/admin/enquiries/export.csv`
- `GET|PATCH|DELETE /api/admin/applications[/:id]`
- `GET|DELETE /api/admin/subscribers[/:id]` · `GET /api/admin/subscribers/export.csv`
- `GET|POST|PATCH|DELETE /api/admin/articles[/:id]`
- `GET|POST|PATCH|DELETE /api/admin/jobs[/:id]`

Validation failures return `422 { error, message, fields: { fieldName: "message" } }`.

## Security & privacy

- Strict input validation (zod), 100 KB body limit, parameterised SQL only, HTML-escaped emails.
- Per-IP rate limits (forms ≈ 6 per 10 min, admin login 8 per 15 min), honeypot field, CORS allow-list, Helmet headers.
- Admin sessions are HMAC-signed and expire (12 h); passwords are compared in constant time.
- IP addresses are stored only as salted hashes. Consent is recorded with a timestamp, and admins can delete any record (right to erasure under POPIA).
- CSV exports neutralise spreadsheet-formula injection.

## Not included yet

File uploads (applications take CV links), double opt-in newsletter confirmation, and bulk newsletter sending
(use Resend broadcasts or similar with the exported subscriber list).

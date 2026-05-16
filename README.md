# Bruno Portfolio

Full-stack portfolio project built with **React, TypeScript, Cloudflare Pages, Cloudflare Workers, D1, R2, and Drizzle ORM**.

This is not only a static personal site. It includes a public portfolio, a protected backstage admin, database-backed content editing, R2 image management, and Cloudflare-hosted analytics integration in one codebase.

## Live Site

- Portfolio: https://portfolio.jackhellowin.win/
- API origin in production: same origin under `/api/*`

## Current Capabilities

### Frontend

- Public portfolio with dark/light mode and bilingual content
- FrontStage sections for hero, about, experience, works, skills, and contact
- BackStage admin for overview, content, works, skills, users, messages, and settings
- Works image editing flow backed by Cloudflare R2 rather than local asset URLs

### Backend

- Cloudflare Worker API built with Hono
- D1-backed data for works, skills, self content, users, content blocks, experiences, and messages
- JWT auth with optional environment-admin credentials
- R2 upload/delete API for work images
- Cloudflare Analytics read endpoint for the admin dashboard

## Architecture

```text
portfolio/
├── frontend/                  # React + Vite application deployed to Cloudflare Pages
│   ├── src/                   # FrontStage, BackStage, hooks, styles, API clients
│   └── public/                # Static assets and Pages routing config
├── workers/                   # Cloudflare Worker API
│   ├── src/routes/            # Auth, works, skills, upload, analytics, content, messages
│   ├── src/drizzle/schema/    # D1 schemas
│   └── migrations/            # D1 migrations applied by Wrangler
├── data-migration/            # Historical migration helpers / source data
├── openspec/                  # Spectra / OpenSpec artifacts
└── .github/workflows/         # Frontend and Worker deployment workflows
```

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Redux Toolkit
- Tailwind CSS
- `cobe` globe accent

### Backend

- Cloudflare Workers
- Hono
- Cloudflare D1
- Cloudflare R2
- Drizzle ORM
- JWT-based authentication

### Workflow

- pnpm
- GitHub Actions
- Spectra / OpenSpec

## Local Development

### Prerequisites

- Node.js 18+
- pnpm 9+
- Cloudflare Wrangler CLI

### Install

```bash
cd frontend
pnpm install

cd ../workers
pnpm install
```

### Run the full app locally

Terminal 1:

```bash
cd workers
pnpm run dev
```

Terminal 2:

```bash
cd frontend
pnpm run dev --host 127.0.0.1 --port 4173
```

The frontend dev server proxies `/api/*` to `http://127.0.0.1:8787`, so local login, works, skills, and admin features only work when the Worker is also running.

Useful local URLs:

- Frontend: `http://127.0.0.1:4173/`
- Worker: `http://127.0.0.1:8787/`
- Health check: `http://127.0.0.1:8787/health`

### Local database setup

```bash
cd workers
pnpm run db:migrate:local
```

If you add a new D1 migration later, apply it locally before testing the related UI or API change.

## Environment Variables And Secrets

### Worker bindings

Defined in `workers/wrangler.toml`:

- `DB` - D1 database binding
- `IMAGES_BUCKET` - R2 bucket binding

Configured as Worker secrets / variables in Cloudflare:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `CF_ANALYTICS_API_TOKEN`
- `CF_ZONE_ID`

Notes:

- `ADMIN_USERNAME` and `ADMIN_PASSWORD` provide the environment-admin login fallback used by `/api/auth/login`.
- `CF_ANALYTICS_API_TOKEN` should be an Analytics read token only.
- Do not commit secret values into the repo or README.

### GitHub Actions secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `VITE_API_PREFIX` only when intentionally overriding the default same-origin API behavior

## API Surface

### Public

- `GET /api/works`
- `GET /api/skills`
- `GET /api/social-media`
- `GET /api/self-content`
- `GET /api/content-blocks`
- `GET /api/experiences`

### Auth / Admin

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/upload`
- `DELETE /api/upload/:key`
- `GET /api/messages`
- `PATCH /api/messages/:id/read`
- `DELETE /api/messages/:id`
- `GET /api/admin/analytics`

## Deployment

### Frontend only

Use this when the change is limited to `frontend/**`.

Automatic:

- Push to `main`
- `.github/workflows/deploy-frontend.yml` builds and deploys Cloudflare Pages

Manual:

```bash
cd frontend
pnpm run build
wrangler pages deploy dist --project-name portfolio --branch main
```

### Worker only

Use this when the change touches `workers/**`, backend secrets, routes, or D1 schema.

Automatic:

- Push to `main`
- `.github/workflows/deploy-workers.yml` deploys the Worker and then applies remote D1 migrations

Manual:

```bash
cd workers
wrangler deploy --config wrangler.toml
wrangler d1 migrations apply bruno-portfolio-db --remote
```

Important:

- Frontend deployment does **not** redeploy the Worker.
- Worker deployment does **not** rebuild Pages.
- If you change schema and code together, deploy the Worker and apply the migration in the same release window.
- If the Cloudflare token can deploy Pages but cannot run D1 migrations, update the token permissions before relying on the Worker workflow.

## Updating Content

### Text content

- Use BackStage `Content` for bilingual hero/about text.
- Content blocks are stored in D1 through `/api/content-blocks`.

### Work experience

- Use BackStage content editing for structured experience records.
- Experience rows support:
  - date range
  - bilingual role and organization
  - location
  - tags
  - bilingual bullet lists

### Works images

- Works images should live in R2 and be served from `https://images.jackhellowin.win/...`
- Use the BackStage work editor image preview flow to replace or delete images.
- Do not reintroduce local image URLs for editable work cards unless intentionally changing the storage model.

## Maintenance Checklist

Before merging a future change:

1. Run `pnpm run build` in `frontend/`.
2. Run `pnpm exec tsc --noEmit` in `workers/`.
3. If a route or schema changed, verify the matching Worker migration exists.
4. If works images changed, confirm the R2 URL returns `200`.
5. If admin auth changed, test both login and protected route behavior.
6. If deployment behavior changed, review both GitHub workflows separately.
7. Keep Spectra / OpenSpec artifacts in sync with shipped behavior.

After deployment:

1. Verify `/api/works`, `/api/skills`, `/api/content-blocks`, and `/api/experiences`.
2. Verify BackStage login and one protected endpoint.
3. Verify at least one R2 work image loads from the public site.
4. Confirm the live site is serving the newest built asset bundle.

## Development Workflow

This project uses a spec-driven workflow:

1. Discuss or propose the change when requirements are still moving
2. Implement against the accepted Spectra / OpenSpec artifacts
3. Ingest requirement changes back into the artifacts when scope shifts
4. Verify the result
5. Archive completed changes after the implementation and docs agree

## License

MIT

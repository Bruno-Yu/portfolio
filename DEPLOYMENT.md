# Deployment Guide

This document explains how to deploy the **bruno-portfolio** project to Cloudflare and set up automatic deployments via GitHub Actions.

## Architecture

| Component | Deployment Target | Service |
|-----------|------------------|---------|
| Frontend | Cloudflare Pages | `bruno-portfolio.pages.dev` |
| Backend | Cloudflare Workers | `bruno-portfolio-api.workers.dev` |

## Prerequisites

1. **Cloudflare Account** with:
   - Cloudflare Pages enabled
   - Cloudflare Workers enabled
   - D1 database created

2. **GitHub Repository** with the code pushed

3. **Wrangler CLI** installed:
   ```bash
   npm install -g wrangler
   ```

## Manual Deployment

### 1. Frontend Deployment (Cloudflare Pages)

#### Option A: Direct Deployment
```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=bruno-portfolio
```

#### Option B: Git Integration (Recommended)
1. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click "Create a project"
3. Connect to GitHub and select this repository
4. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click "Deploy"

### 2. Backend Deployment (Cloudflare Workers)

#### Create D1 Database
```bash
cd workers
npx wrangler d1 create bruno-portfolio-db
```

Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "bruno-portfolio-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

#### Run Database Migrations
```bash
# Apply migrations to local database
npx wrangler d1 migrations apply --local

# Apply migrations to production database
npx wrangler d1 migrations apply --remote
```

#### Deploy Workers
```bash
npx wrangler deploy
```

#### Set Environment Secrets
```bash
npx wrangler secret put DB_NAME
npx wrangler secret put DB_TABLE_PREFIX
# Add other secrets as needed
```

### 3. Connect Frontend to Backend

After deploying the Workers, update the frontend environment variables:

**Development** (`.env`):
```env
VITE_API_PREFIX=http://localhost:8787
```

**Production** (Cloudflare Pages Settings):
```env
VITE_APP_API=https://bruno-portfolio-api.YOUR_USERNAME.workers.dev
```

## Automatic Deployment (GitHub Actions)

This project includes GitHub Actions workflows for automatic deployment on every push to `main`.

### Workflow Files

| Workflow | Purpose |
|----------|---------|
| `.github/workflows/deploy-frontend.yml` | Deploys frontend to Cloudflare Pages |
| `.github/workflows/deploy-workers.yml` | Deploys backend to Cloudflare Workers |

### Setup Instructions

#### 1. Create Cloudflare API Token

1. Go to [Cloudflare Dashboard → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template or create custom with:
   - **Permissions**: Workers & Pages: Edit
   - **Account Resources**: Your account
4. Copy the generated token

#### 2. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions:

| Secret Name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID (found in Dashboard) |
| `CLOUDFLARE_D1_DATABASE_ID` | Your D1 database ID |

To find your Account ID:
```bash
npx wrangler whoami
```

#### 3. Configure D1 Database ID

Update `workers/wrangler.toml` with your D1 database ID (non-sensitive):
```toml
[[d1_databases]]
binding = "DB"
database_name = "bruno-portfolio-db"
database_id = "${CLOUDFLARE_D1_DATABASE_ID}"
```

#### 4. Enable GitHub Actions

Push to `main` branch will automatically trigger deployments.

### Deployment Flow

```
Push to main
    ↓
GitHub Actions triggered
    ↓
├── Deploy Frontend → Cloudflare Pages
├── Deploy Workers → Cloudflare Workers
└── Run migrations → Cloudflare D1 (if schema changed)
    ↓
Deployment complete!
```

## Environment Variables Reference

### Frontend (Vite)

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `VITE_API_PREFIX` | `http://localhost:8787` | - | Local Workers API URL |
| `VITE_APP_API` | - | Workers prod URL | Production API URL |

Set in:
- Development: `.env` file
- Production: Cloudflare Pages Settings → Environment variables

### Backend (Workers)

| Variable | How to Set | Description |
|----------|------------|-------------|
| `DB` | Binding | D1 database binding |
| Secrets | `wrangler secret put` | Sensitive credentials |

## Troubleshooting

### Frontend Build Fails
```bash
cd frontend
npm install
npm run build
```

### Workers Deployment Fails
```bash
cd workers
npx wrangler deploy --log-level=debug
```

### Database Connection Issues
```bash
# Check local database
npx wrangler d1 execute --local --file=./drizzle/migrations/*.sql

# Check production database
npx wrangler d1 execute --remote --command="SELECT * FROM works"
```

### CORS Issues
Ensure your Workers CORS middleware allows requests from your Pages domain:
```typescript
// workers/src/middleware/cors.ts
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev
    'https://bruno-portfolio.pages.dev', // Production
  ],
  // ...
}
```

## Useful Commands

```bash
# Local development
npm run dev               # Run both frontend and workers
npm run dev --workspace=frontend  # Frontend only
npm run dev --workspace=workers   # Workers only

# Build
npm run build --workspaces

# Database
npx wrangler d1 migrations apply --local
npx wrangler d1 migrations apply --remote
npx wrangler d1 studio

# Deployment
npx wrangler deploy
```

## Links

- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler)

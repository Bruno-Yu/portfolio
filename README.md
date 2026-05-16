# Bruno Portfolio

Full-stack portfolio project built with **React, TypeScript, Cloudflare Workers, D1, and Drizzle ORM**.

This project is more than a static personal site: it combines a modern front end, a serverless backend, existing-data migration, and a spec-driven development workflow in one codebase.  
It demonstrates end-to-end product delivery across UI, API, persistence, and deployment.

## Live demo

- Portfolio: https://portfolio.jackhellowin.win/

## What this project demonstrates

- Full-stack product delivery with a React front end and Cloudflare Workers backend
- API and data-layer design with D1 and Drizzle ORM
- Moving existing records into a new database-backed architecture
- Spec-driven development through OpenSpec artifacts
- Production-oriented deployment workflow across Pages and Workers

## Architecture

```text
bruno-portfolio/
├── frontend/              # React + Vite frontend application
├── workers/               # Cloudflare Workers backend (TypeScript)
│   ├── src/               # API routes, services, middleware
│   └── drizzle/           # Database schema & migrations
├── data-migration/        # Migration scripts & source data
└── openspec/              # Spec-driven development artifacts
```

## Tech stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- ESLint + Prettier

### Backend
- Cloudflare Workers
- Cloudflare D1
- Drizzle ORM
- RESTful API

### Development workflow
- OpenSpec
- GitHub Actions

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare Wrangler CLI

### Setup

```bash
npm install

cd frontend
npm run dev

cd ../workers
npm run dev
```

## Deployment

- Frontend: Cloudflare Pages via GitHub Actions
- Backend: Cloudflare Workers

```bash
cd workers
npx wrangler deploy
```

## Project structure

### Frontend (`frontend/`)
- `src/` - React components, hooks, utilities
- `public/` - static assets
- `vite.config.ts` - Vite configuration

### Backend (`workers/`)
- `src/index.ts` - Worker entry point
- `src/routes/` - API route handlers
- `src/services/` - business logic
- `src/middleware/` - auth, CORS, validation
- `drizzle/schema/` - database schemas

### Data migration (`data-migration/`)
- scripts and source data used to move existing records into the new database

### Documentation (`openspec/`)
- project context
- change proposals
- workflow conventions

## Development workflow

This project uses a spec-driven workflow:

1. Define the change
2. Review the design
3. Implement against the approved spec
4. Verify the result

## Development note

This project was built with AI-assisted development support.  
Architecture decisions, requirement breakdown, review, integration, and final verification were still owned by me.

## License

MIT

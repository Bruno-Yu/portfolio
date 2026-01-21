# Bruno Portfolio

A full-stack personal portfolio website showcasing attractions and projects, built with modern web technologies.

## 🏗️ Architecture

```
bruno-portfolio/
├── frontend/              # React + Vite frontend application
├── workers/               # Cloudflare Workers backend (TypeScript)
│   ├── src/              # API routes, services, middleware
│   └── drizzle/          # Database schema & migrations
├── data-migration/        # Migration scripts & legacy data
└── openspec/             # Spec-Driven Development artifacts
```

## 🚀 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- ESLint + Prettier

### Backend (Serverless)
- Cloudflare Workers
- Cloudflare D1 (SQLite database)
- Drizzle ORM
- RESTful API

### Development
- OpenSpec (Spec-Driven Development)
- Git for version control

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare Wrangler CLI (`npm install -g wrangler`)

### Setup
```bash
# Install dependencies for all workspaces
npm install

# Frontend development
cd frontend
npm run dev

# Workers development (in another terminal)
cd workers
npm run dev
```

## 🔧 Deployment

### Frontend
Deployed to Cloudflare Pages via GitHub Actions.

### Backend
Deploy to Cloudflare Workers:
```bash
cd workers
npx wrangler deploy
```

## 📁 Project Structure

### Frontend (`frontend/`)
- `src/` - React components, hooks, utilities
- `public/` - Static assets
- `index.html` - Entry point
- `vite.config.ts` - Vite configuration

### Backend (`workers/`)
- `src/index.ts` - Worker entry point
- `src/routes/` - API route handlers
- `src/services/` - Business logic
- `src/middleware/` - Auth, CORS, validation
- `drizzle/schema/` - Database schemas
- `wrangler.toml` - Workers configuration

### Database (`data-migration/`)
- `db.json` - Legacy data from JSON Server

### Documentation (`openspec/`)
- `project.md` - Project context and conventions
- `AGENTS.md` - AI assistant instructions
- `changes/` - Change proposals

## 🛠️ Development Workflow

This project uses **OpenSpec (Spec-Driven Development)**:

1. **Create Proposal** - Define changes in `openspec/changes/`
2. **Review & Approve** - Review design before implementation
3. **Implement** - Follow approved spec
4. **Verify** - Ensure implementation matches spec

See `openspec/AGENTS.md` for details.

## 📝 License

MIT

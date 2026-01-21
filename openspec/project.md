# Project Context

## Purpose
Bruno Portfolio is a personal portfolio website showcasing projects, skills, and professional background. Migrated from JSON Server to Cloudflare Workers + D1 database for improved scalability and performance.

## Tech Stack
- **Frontend**: React 18 + TypeScript, Vite, TailwindCSS
- **Backend**: Cloudflare Workers (Hono framework), D1 (SQLite database), Drizzle ORM
- **Deployment**: Cloudflare Pages (frontend), Cloudflare Workers (backend)
- **Development**: pnpm workspaces, TypeScript, ESLint + Prettier

## Project Conventions

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Import aliases: `@` maps to `frontend/src`

### Architecture Patterns
- RESTful API design with Hono routing
- Separation of concerns: routes, services, middleware
- Environment-based configuration (.env files)

### Testing Strategy
- Manual testing via curl during development
- CI/CD via GitHub Actions

### Git Workflow
- Feature branches for new changes
- Main branch for production deployments
- Conventional commits

## Domain Context
- Portfolio data structure: works, skills, social_media, self_content
- API endpoints: /api/works, /api/skills, /api/social-media, /api/self-content
- Frontend served from `/portfolio/` subdirectory

## Important Constraints
- D1 database ID is public (not sensitive)
- API token and Account ID must remain secret
- All environment variables for frontend must start with `VITE_`

## External Dependencies
- Cloudflare Workers & Pages hosting
- Cloudflare D1 database
- Imgur for image hosting (legacy data)
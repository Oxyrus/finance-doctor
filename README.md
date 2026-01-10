# finance-doctor

![CI](https://github.com/Oxyrus/finance-doctor/actions/workflows/ci.yml/badge.svg)

Privacy-first personal finance tracking with Telegram bot integration.

## Setup

1. Install Node.js 22.12+ (LTS)
2. Clone repository
3. Copy `.env.example` to `.env` and fill in values
4. Run `npm install` at root

## Development

- Frontend: `npm run dev:frontend` (http://localhost:5173)
- Backend: `npm run dev:backend` (http://localhost:3000)

### Running CI Checks Locally

Before pushing, run these commands to ensure CI will pass:

```bash
npm run type-check  # TypeScript type checking
npm run lint        # ESLint linting
npm run build       # Build verification
npm run test:unit   # Unit tests
```

All checks must pass for pull requests to be merged.

## Tech Stack

- Frontend: Vue 3 + TypeScript + Vite + Tailwind CSS
- Backend: Fastify + TypeScript + SQLite + Drizzle ORM
- Monorepo: npm workspaces

## Environment Variables

See `.env.example` for required configuration.

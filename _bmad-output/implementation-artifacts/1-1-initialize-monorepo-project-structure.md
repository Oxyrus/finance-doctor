# Story 1.1: Initialize Monorepo Project Structure

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **a properly configured monorepo structure with separate frontend and backend workspaces**,
So that **I can develop both applications with shared dependencies and unified tooling**.

## Acceptance Criteria

**Given** a new project repository
**When** the monorepo is initialized
**Then** the project has the following structure:
- Root `package.json` with workspaces configured for "frontend" and "backend"
- `.gitignore` file excluding node_modules, .env files, and build artifacts
- `.env.example` file documenting required environment variables
- `README.md` with project overview and setup instructions

**And** running `npm install` at root successfully installs all workspace dependencies

**And** the monorepo supports running scripts across workspaces

## Tasks / Subtasks

- [ ] Initialize root monorepo structure (AC: Root package.json with workspaces)
  - [ ] Create root package.json with "private": true and workspaces array ["frontend", "backend"]
  - [ ] Create comprehensive .gitignore file
  - [ ] Create .env.example with all required environment variables documented
  - [ ] Create README.md with project overview, setup instructions, and development workflow

- [ ] Initialize frontend workspace (AC: Vue 3 + TypeScript + Vite ready)
  - [ ] Run `npm create vite@latest frontend -- --template vue-ts`
  - [ ] Verify frontend/package.json, vite.config.ts, and tsconfig.json are created
  - [ ] Test dev server starts successfully with `npm run dev` in frontend directory

- [ ] Initialize backend workspace (AC: Fastify + TypeScript foundation ready)
  - [ ] Create backend directory structure (src/, src/routes/, src/services/, src/db/)
  - [ ] Create backend/package.json with Fastify and TypeScript dependencies
  - [ ] Create backend/tsconfig.json with strict mode and ES modules
  - [ ] Create basic backend/src/server.ts with Fastify setup
  - [ ] Test server starts with simple health check endpoint

- [ ] Verify monorepo integration (AC: Workspaces install and run correctly)
  - [ ] Run `npm install` at root - verify all workspace dependencies installed
  - [ ] Verify no dependency conflicts between workspaces
  - [ ] Test running workspace scripts from root (npm run dev --workspace=frontend)
  - [ ] Commit initial project structure to git

## Dev Notes

### Critical Architecture Patterns

**Monorepo Structure Decision:**
- Using npm workspaces (not Lerna, Nx, or Turborepo) for simplicity
- Root package.json with "private": true to prevent accidental publishing
- Workspaces: ["frontend", "backend"] configuration
- All dependencies hoisted to root node_modules when possible
- Individual package.json files maintain workspace-specific dependencies

**TypeScript Configuration:**
- TypeScript 5.x MUST be consistent across both workspaces
- Strict mode enabled in both frontend and backend
- ES modules throughout (type: "module" in package.json)
- No CommonJS allowed

**Critical Version Requirements (as of January 2026):**

**Node.js Version:**
- **CRITICAL:** Use Node.js 22.x (current LTS), NOT 20.x
- Node.js 20.x reaches EOL April 2026 (only 3 months away)
- Node.js 22.x supported until April 2027
- Vite 6 requires Node.js 20.19+ or 22.12+ minimum
- Source: [Node.js Releases](https://nodejs.org/en/about/previous-releases), [Node.js End-of-Life](https://endoflife.date/nodejs)

**Vite Version:**
- Vite 6.x (latest major version)
- create-vite version 8.2.0
- Command: `npm create vite@latest frontend -- --template vue-ts`
- Note: Recent issue with vue-ts template build errors - verify dependencies after creation
- Source: [Vite Getting Started](https://vite.dev/guide/), [create-vite npm](https://www.npmjs.com/package/create-vite)

**Tailwind CSS Version:**
- **Decision:** Use Tailwind CSS v3.x for this project (NOT v4)
- v4.0 was recently released but requires Safari 16.4+, Chrome 111+, Firefox 128+
- v3.4 provides broader browser compatibility (requirement: latest 2 versions of modern browsers)
- v4 has breaking configuration changes (@import instead of @tailwind directives)
- For stability and compatibility, stick with v3.4.x
- Source: [Tailwind CSS Releases](https://github.com/tailwindlabs/tailwindcss/releases), [Tailwind CSS Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

**npm Workspaces Best Practices:**
- Root package.json: "private": true flag prevents accidental publishing
- Workspaces field: array of package directories ["frontend", "backend"]
- Installing dependencies: `npm install <package> --workspace=<workspace-name>`
- Running scripts: `npm run <script> --workspace=<workspace-name>` or `npm run <script> --workspaces` for all
- Hoisting: Common dependencies automatically hoisted to root node_modules
- TypeScript: Will need TypeScript Project References for proper monorepo type checking
- Source: [npm Workspaces Guide](https://medium.com/@leticia-mirelly/a-comprehensive-guide-to-npm-workspaces-and-monorepos-ce0cdfe1c625), [npm Workspaces for Monorepo Management](https://earthly.dev/blog/npm-workspaces-monorepo/)

### Project Structure Notes

**Complete Directory Structure to Create:**
```
finance-doctor/
├── package.json                    # Root with workspaces: ["frontend", "backend"]
├── .gitignore                      # Comprehensive gitignore
├── .env.example                    # Environment variable documentation
├── README.md                       # Project overview and setup instructions
├── frontend/                       # Vue 3 + TypeScript + Vite workspace
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── layouts/
│   │   ├── composables/
│   │   ├── stores/
│   │   ├── schemas/                # Zod validation (shared with backend)
│   │   ├── router/
│   │   ├── App.vue
│   │   └── main.ts
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tsconfig.node.json
├── backend/                        # Fastify + TypeScript + Drizzle workspace
│   ├── src/
│   │   ├── routes/                 # API route handlers (thin layer)
│   │   ├── services/               # Business logic (thick layer)
│   │   ├── db/                     # Database schema and migrations
│   │   │   ├── schema.ts
│   │   │   ├── index.ts
│   │   │   └── migrations/
│   │   ├── middleware/             # Fastify middleware
│   │   ├── schemas/                # Zod validation (shared with frontend)
│   │   └── server.ts               # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── drizzle.config.ts
└── node_modules/                   # Hoisted dependencies (created by npm install)
```

**Alignment with Project Architecture:**
- Matches architecture decision: Custom Monorepo with Official Tools
- Frontend: Vite official vue-ts template (clean, minimal, latest)
- Backend: Custom Fastify setup (full control, appropriate scale)
- No pre-configured starters (team experience allows manual setup)
- Source: [Architecture.md - Starter Template Evaluation](#database-layer-architecture)

**Critical .gitignore Entries:**
```
# Dependencies
node_modules/

# Environment files - NEVER commit secrets
.env
.env.local
.env.*.local

# Database files - NEVER commit data
*.db
*.db-*
/backups/

# Build outputs
dist/
dist-ssr/
*.local
build/

# Logs
logs/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

**Required Environment Variables (.env.example):**
```
# Backend Configuration
NODE_ENV=development
PORT=3000
DATABASE_PATH=./data/finance.db

# Authentication
SESSION_SECRET=your-session-secret-here-change-in-production

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here

# Frontend URL (for CORS if needed, though same-domain deployment avoids this)
FRONTEND_URL=http://localhost:5173
```

**Security Checklist (CRITICAL):**
- ❌ NEVER commit `.env` files
- ❌ NEVER commit database files (`*.db`)
- ❌ NEVER commit `node_modules/`
- ❌ NEVER commit tokens or secrets
- ✅ Review `.gitignore` before first commit
- ✅ Keep `TELEGRAM_BOT_TOKEN` in environment only
- Source: [Project-context.md - Security Checklist](#critical-dont-miss-rules)

### Technical Requirements

**Frontend (Vue 3 + TypeScript + Vite):**

**Package Dependencies to Install:**
```json
{
  "dependencies": {
    "vue": "^3.5.0",
    "vue-router": "^4.0.0",
    "pinia": "^2.0.0",
    "axios": "^1.0.0",
    "chart.js": "^4.0.0",
    "vue-chartjs": "^5.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "~5.7.0",
    "vite": "^6.0.0",
    "vue-tsc": "^2.0.0"
  }
}
```

**Vite Configuration (vite.config.ts):**
- Port: 5173 (Vite default)
- HMR enabled for development
- Build target: ES modules for modern browsers only
- No legacy browser support needed

**TypeScript Configuration (tsconfig.json):**
- strict: true (mandatory)
- target: "ESNext"
- module: "ESNext"
- moduleResolution: "bundler"
- Source: [Project-context.md - TypeScript Configuration](#language-specific-rules-typescriptjavascript)

**Backend (Fastify + TypeScript):**

**Package Dependencies to Install:**
```json
{
  "dependencies": {
    "fastify": "^5.0.0",
    "@fastify/cors": "^10.0.0",
    "@fastify/helmet": "^12.0.0",
    "@fastify/env": "^5.0.0",
    "@fastify/session": "^11.0.0",
    "@fastify/swagger": "^9.0.0",
    "drizzle-orm": "^0.37.0",
    "better-sqlite3": "^11.0.0",
    "node-telegram-bot-api": "^0.66.0",
    "zod": "^3.0.0",
    "pino": "^9.0.0",
    "bcrypt": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "~5.7.0",
    "@types/node": "^22.0.0",
    "@types/better-sqlite3": "^7.0.0",
    "tsx": "^4.0.0",
    "drizzle-kit": "^0.27.0",
    "eslint": "^9.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0"
  }
}
```

**Fastify Server Setup (server.ts minimum):**
```typescript
import Fastify from 'fastify';

const server = Fastify({
  logger: true, // Pino logger enabled
});

// Health check endpoint (minimal for story 1.1)
server.get('/api/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
```

**TypeScript Configuration (tsconfig.json):**
- strict: true (mandatory)
- target: "ES2022"
- module: "ESNext"
- moduleResolution: "bundler"
- esModuleInterop: true
- Source: [Project-context.md - TypeScript Configuration](#language-specific-rules-typescriptjavascript)

### Architecture Compliance

**Adherence to Architectural Decisions:**

**Database Layer (Deferred for Later Stories):**
- Drizzle ORM chosen over Prisma (lightweight, SQL-oriented)
- SQLite with better-sqlite3 driver (synchronous, performant)
- Schema in `backend/src/db/schema.ts`
- Migrations via drizzle-kit
- **NOT IMPLEMENTED IN THIS STORY** - just install dependencies
- Source: [Architecture.md - Database Layer Architecture](#database-layer-architecture)

**Authentication (Deferred for Later Stories):**
- Session-based with @fastify/session
- Shared household login
- HttpOnly, Secure, SameSite cookies
- **NOT IMPLEMENTED IN THIS STORY** - just install dependencies
- Source: [Architecture.md - Authentication & Security](#authentication--security)

**API Design:**
- RESTful with JSON responses
- `/api/*` prefix for all endpoints
- Structured error responses
- @fastify/swagger for documentation
- **MINIMAL IN THIS STORY** - just health check endpoint
- Source: [Architecture.md - API & Communication Patterns](#api--communication-patterns)

**State Management:**
- Pinia for Vue 3 (official solution)
- Stores in `frontend/src/stores/`
- Composition API pattern
- **NOT IMPLEMENTED IN THIS STORY** - just create directory structure
- Source: [Architecture.md - Frontend Architecture](#frontend-architecture)

**Component Architecture:**
- Hybrid organization: components/, views/, layouts/, composables/, stores/
- **NOT IMPLEMENTED IN THIS STORY** - just create directory structure
- Source: [Architecture.md - Component Architecture](#frontend-architecture)

### Library/Framework Requirements

**Critical Technology Constraints:**

**Node.js Runtime:**
- Version: 22.12+ (NOT 20.x due to April 2026 EOL)
- Type: LTS (Long Term Support)
- Justification: Node 20.x EOL is April 2026, Node 22.x supported until April 2027
- Source: [Web Research - Node.js 20 LTS 2026](#web-research-findings)

**Frontend Framework Stack:**
- Vue 3.5.x (Composition API only, no Options API)
- Vite 6.x (requires Node.js 22.12+)
- TypeScript 5.7.x (consistent across monorepo)
- Tailwind CSS 3.4.x (NOT v4 - broader browser compatibility)
- Source: [Architecture.md - Frontend Architecture](#frontend-architecture)

**Backend Framework Stack:**
- Fastify 5.x (performance-focused, plugin-based)
- TypeScript 5.7.x (strict mode enabled)
- Drizzle ORM 0.37.x (type-safe, SQL-oriented)
- better-sqlite3 11.x (synchronous SQLite driver)
- Pino 9.x (Fastify default logger)
- Source: [Architecture.md - Core Architectural Decisions](#core-architectural-decisions)

**Shared Libraries:**
- Zod 3.x (validation across frontend and backend)
- TypeScript definitions shared via workspace references
- Source: [Architecture.md - Data Architecture](#data-architecture)

**Development Tools:**
- tsx 4.x (TypeScript execution for backend dev)
- drizzle-kit 0.27.x (database migrations)
- ESLint 9.x with TypeScript plugins
- Source: [Architecture.md - Build Tooling](#architectural-decisions-provided-by-starter)

**Testing Tools (Install but not configure in this story):**
- Vitest (frontend + backend unit tests)
- Playwright (E2E tests)
- Source: [Architecture.md - Testing Strategy](#infrastructure--deployment)

### File Structure Requirements

**Root Level Files (MANDATORY):**

**package.json:**
```json
{
  "name": "finance-doctor",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:backend": "npm run dev --workspace=backend",
    "build:frontend": "npm run build --workspace=frontend",
    "build:backend": "npm run build --workspace=backend",
    "install:all": "npm install",
    "clean": "rm -rf node_modules frontend/node_modules backend/node_modules"
  },
  "engines": {
    "node": ">=22.12.0",
    "npm": ">=10.0.0"
  }
}
```

**README.md Structure:**
```markdown
# finance-doctor

Privacy-first personal finance tracking with Telegram bot integration.

## Setup

1. Install Node.js 22.12+ (LTS)
2. Clone repository
3. Copy `.env.example` to `.env` and fill in values
4. Run `npm install` at root

## Development

- Frontend: `npm run dev:frontend` (http://localhost:5173)
- Backend: `npm run dev:backend` (http://localhost:3000)

## Tech Stack

- Frontend: Vue 3 + TypeScript + Vite + Tailwind CSS
- Backend: Fastify + TypeScript + SQLite + Drizzle ORM
- Monorepo: npm workspaces

## Environment Variables

See `.env.example` for required configuration.
```

**Directory Structure Must Match:**
- Frontend: Vite vue-ts template structure (src/, public/, index.html)
- Backend: Custom structure (src/routes/, src/services/, src/db/, src/middleware/, src/schemas/)
- Root: package.json, .gitignore, .env.example, README.md
- Source: [Project-context.md - Code Organization](#code-quality--style-rules)

**Naming Conventions (ENFORCED):**
- Directories: lowercase (frontend/, backend/, src/, components/)
- TypeScript files: camelCase (server.ts, expenseService.ts)
- Vue components: PascalCase (ExpenseList.vue, DashboardView.vue)
- Config files: lowercase (vite.config.ts, tsconfig.json, drizzle.config.ts)
- Source: [Architecture.md - Naming Patterns](#naming-patterns)

### Testing Requirements

**For This Story:**
- Manual verification only (no automated tests yet)
- Verify `npm install` succeeds at root
- Verify `npm run dev:frontend` starts Vite dev server
- Verify `npm run dev:backend` starts Fastify server
- Verify health check endpoint responds: `curl http://localhost:3000/api/health`

**Test Framework Setup (Install only, don't configure):**
- Vitest: `npm install -D vitest --workspace=frontend` and `--workspace=backend`
- Playwright: `npm install -D @playwright/test --workspace=frontend`
- **Configuration and test writing deferred to Story 1.6 (CI/CD Pipeline)**
- Source: [Architecture.md - Testing Strategy](#infrastructure--deployment)

**Testing Patterns (For Future Reference):**
- Co-located tests: `ExpenseList.test.ts` next to `ExpenseList.vue`
- Test naming: Same as source file + `.test.ts`
- NO separate `__tests__/` directory
- Source: [Architecture.md - Test File Organization](#structure-patterns)

### References

All technical details extracted from:

**Epic and Story Context:**
- [Epics.md - Epic 1: Project Foundation & Infrastructure](/_bmad-output/planning-artifacts/epics.md#epic-1-project-foundation--infrastructure)
- [Epics.md - Story 1.1: Initialize Monorepo Project Structure](/_bmad-output/planning-artifacts/epics.md#story-11-initialize-monorepo-project-structure)

**Architecture Decisions:**
- [Architecture.md - Starter Template Evaluation](/_bmad-output/planning-artifacts/architecture.md#starter-template-evaluation)
- [Architecture.md - Selected Approach: Custom Monorepo with Official Tools](/_bmad-output/planning-artifacts/architecture.md#selected-approach-custom-monorepo-with-official-tools)
- [Architecture.md - Project Structure](/_bmad-output/planning-artifacts/architecture.md#project-structure)
- [Architecture.md - Database Layer Architecture](/_bmad-output/planning-artifacts/architecture.md#database-layer-architecture)
- [Architecture.md - Core Architectural Decisions](/_bmad-output/planning-artifacts/architecture.md#core-architectural-decisions)
- [Architecture.md - Implementation Patterns](/_bmad-output/planning-artifacts/architecture.md#implementation-patterns--consistency-rules)

**Product Requirements:**
- [PRD.md - Technical Architecture Considerations](/_bmad-output/planning-artifacts/prd.md#technical-architecture-considerations)
- [PRD.md - Web Application Specific Requirements](/_bmad-output/planning-artifacts/prd.md#web-application-specific-requirements)
- [PRD.md - MVP Strategy & Philosophy](/_bmad-output/planning-artifacts/prd.md#mvp-strategy--philosophy)

**Project Coding Standards:**
- [Project-context.md - Technology Stack & Versions](/_bmad-output/project-context.md#technology-stack--versions)
- [Project-context.md - Critical Implementation Rules](/_bmad-output/project-context.md#critical-implementation-rules)
- [Project-context.md - TypeScript Configuration](/_bmad-output/project-context.md#language-specific-rules-typescriptjavascript)
- [Project-context.md - File Naming Conventions](/_bmad-output/project-context.md#code-quality--style-rules)
- [Project-context.md - Environment Configuration](/_bmad-output/project-context.md#development-workflow-rules)
- [Project-context.md - Security Checklist](/_bmad-output/project-context.md#critical-dont-miss-rules)

**Web Research (Latest Versions & Best Practices):**
- Node.js 20 LTS Status: [Node.js Releases](https://nodejs.org/en/about/previous-releases), [endoflife.date](https://endoflife.date/nodejs)
- Vite 6 Setup: [Vite Getting Started](https://vite.dev/guide/), [create-vite npm](https://www.npmjs.com/package/create-vite)
- npm Workspaces: [Comprehensive Guide](https://medium.com/@leticia-mirelly/a-comprehensive-guide-to-npm-workspaces-and-monorepos-ce0cdfe1c625), [Earthly Blog](https://earthly.dev/blog/npm-workspaces-monorepo/)
- Tailwind CSS: [Releases](https://github.com/tailwindlabs/tailwindcss/releases), [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent during implementation_

### Completion Notes List

_To be filled by dev agent with implementation notes_

### File List

_To be filled by dev agent with all created/modified files_

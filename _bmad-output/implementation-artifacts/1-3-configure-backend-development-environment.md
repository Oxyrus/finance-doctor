# Story 1.3: Configure Backend Development Environment

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **a Fastify + TypeScript backend configured with development tooling**,
So that **I can build RESTful API endpoints with type safety and hot reload**.

## Acceptance Criteria

**Given** the monorepo structure exists
**When** the backend workspace is configured
**Then** the backend directory contains:
- Fastify framework installed with TypeScript support
- Core plugins installed: @fastify/cors, @fastify/helmet, @fastify/env, @fastify/session
- TypeScript configured with strict mode enabled
- ESLint configured for Node.js and TypeScript
- `tsx` installed for development hot reload

**And** running `npm run dev` starts the Fastify server with hot reload using tsx

**And** a basic health check endpoint `/api/health` responds with `{ status: 'ok' }`

**And** `.env.example` file documents backend environment variables (DATABASE_PATH, SESSION_SECRET, TELEGRAM_BOT_TOKEN)

## Tasks / Subtasks

- [x] Install Fastify framework and core plugins (AC: Core backend dependencies installed)
  - [x] Install fastify@^5.0.0 with TypeScript support
  - [x] Install @fastify/cors@^11.0.0 for same-origin policy management
  - [x] Install @fastify/helmet@^13.0.0 for security headers
  - [x] Install @fastify/env@^5.0.0 for environment variable management
  - [x] Install @fastify/session@^11.0.0 for session management
  - [x] Verify all plugin versions are compatible with Fastify 5.x

- [x] Configure TypeScript for backend (AC: TypeScript configured with strict mode)
  - [x] Verify tsconfig.json has strict: true enabled
  - [x] Verify TypeScript version matches frontend (~5.7.0)
  - [x] Configure target: ES2017 or greater (avoid FastifyDeprecation warning)
  - [x] Set module: ESNext for ES modules
  - [x] Test TypeScript compilation with npm run build

- [x] Set up development tooling (AC: Development hot reload working)
  - [x] Install tsx@^4.0.0 as dev dependency for hot reload
  - [x] Configure npm run dev script using tsx watch mode
  - [x] Verify tsx hot reload works with code changes
  - [x] Install ESLint with @typescript-eslint for Node.js
  - [x] Run ESLint to ensure no configuration errors

- [x] Create basic Fastify server with health endpoint (AC: Health check endpoint responding)
  - [x] Create backend/src/server.ts with basic Fastify server
  - [x] Register @fastify/helmet for security headers
  - [x] Register @fastify/env for environment variable validation
  - [x] Create GET /api/health endpoint returning { status: 'ok' }
  - [x] Configure Pino logger (Fastify default) with JSON logging
  - [x] Test server starts on configured port (3000)

- [x] Configure backend environment variables (AC: .env.example created)
  - [x] Create backend/.env.example with required variables documented
  - [x] Document DATABASE_PATH (path to SQLite database file)
  - [x] Document SESSION_SECRET (secure random string for sessions)
  - [x] Document TELEGRAM_BOT_TOKEN (API token for Telegram bot)
  - [x] Document PORT (default: 3000)
  - [x] Verify .env files are git-ignored

## Dev Notes

### Critical Architecture Patterns

**Backend Stack Decisions (from Architecture.md):**
- Fastify 5.x as web framework (performance-focused, lightweight)
- Node.js 20.19+ or 22.12+ runtime (same requirement as frontend Vite 6.x)
- TypeScript 5.7.x with strict mode (MUST match frontend version)
- better-sqlite3 driver for SQLite (synchronous, performant)
- Drizzle ORM for type-safe database operations (Story 1.4)
- Source: [Architecture.md - Backend Stack](/_bmad-output/planning-artifacts/architecture.md#technical-preferences-established)

**TypeScript Version Consistency (CRITICAL from Story 1.2):**
- TypeScript 5.7.x MUST be consistent across both frontend and backend workspaces
- Story 1.1 established ~5.7.0 as the standard version
- Story 1.2 code review fixed frontend version inconsistencies
- NEVER upgrade backend TypeScript without upgrading frontend in sync
- Source: [Story 1.2 - TypeScript Version Consistency](/_bmad-output/implementation-artifacts/1-2-configure-frontend-development-environment.md#typescript-version-consistency-critical)

**Fastify Framework Selection:**
- Performance: Can handle up to 30,000 requests per second
- Plugin ecosystem: Over 260 plugins available
- Built-in validation and serialization using JSON Schema
- Excellent TypeScript support with maintained type declarations
- Plugin-based architecture for modularity
- Source: [Architecture.md - Backend Architecture](/_bmad-output/planning-artifacts/architecture.md#backend-architecture)

**Monorepo Dependency Management:**
- Root package.json has workspaces configured: ["frontend", "backend"]
- Install workspace-specific dependencies: `npm install <package> --workspace=backend`
- Common dependencies automatically hoisted to root node_modules
- Running scripts: `npm run dev --workspace=backend` from root
- Source: [Story 1.1 - npm Workspaces Best Practices](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#npm-workspaces-best-practices)

### Project Structure Notes

**Backend Directory Structure (Route → Service → Database Pattern):**
```
backend/
├── src/
│   ├── routes/          # API route handlers (thin - validation and delegation only)
│   ├── services/        # Business logic (thick - all domain logic lives here)
│   ├── db/              # Database schema and migrations (Story 1.4)
│   │   ├── schema.ts
│   │   ├── index.ts
│   │   └── migrations/
│   ├── middleware/      # Fastify middleware functions
│   │   ├── auth.ts      # Authentication middleware (Story 2.2)
│   │   └── errorHandler.ts
│   ├── schemas/         # Zod validation schemas (shared with frontend)
│   ├── utils/           # Utility functions
│   └── server.ts        # Fastify server setup and configuration
├── drizzle.config.ts    # Drizzle ORM configuration (Story 1.4)
├── package.json         # Backend dependencies
├── tsconfig.json        # TypeScript configuration
└── .env.example         # Environment variable documentation
```
- Source: [Architecture.md - Project Structure](/_bmad-output/planning-artifacts/architecture.md#project-structure)

**Critical Architecture Pattern: Route → Service → Database**
- **Routes:** Thin handlers in `routes/` - validation and delegation only
- **Services:** Business logic in `services/` - all domain logic lives here
- **Database:** Drizzle ORM access ONLY in services (never in routes)
- ✅ Route validates → Service processes → Service queries DB
- ❌ Route directly queries database or contains business logic
- Source: [Project-context.md - Fastify Backend Architecture](/_bmad-output/project-context.md#fastify-backend-architecture-route--service--database)

**Files to Create in This Story:**
- backend/src/server.ts (Fastify server entry point)
- backend/.env.example (environment variable documentation)
- Note: Middleware, routes, and services directories will be created in feature stories

**Alignment with Unified Project Structure:**
- Directory structure created in Story 1.1 includes basic backend/ structure
- This story focuses on installing dependencies and basic server setup
- Database layer (db/, drizzle.config.ts) will be configured in Story 1.4
- Source: [Story 1.1 - Complete Directory Structure](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#complete-directory-structure-to-create)

**Critical .env.example Configuration:**
```bash
# Backend Environment Variables

# Database Configuration
DATABASE_PATH=./data/finance.db

# Session Configuration (generate secure random string for production)
SESSION_SECRET=your-secure-session-secret-change-in-production

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here

# Server Configuration
PORT=3000
NODE_ENV=development

# IMPORTANT: Never commit actual .env file to git
# Copy this file to .env and fill in real values for local development
```
- All secrets must be in environment variables (never hardcoded)
- Production secrets managed via Coolify deployment UI
- Source: [Architecture.md - Secrets Management](/_bmad-output/planning-artifacts/architecture.md#secrets-management)

### Technical Requirements

**Package Dependencies to Install:**

**Core Framework:**
```json
{
  "dependencies": {
    "fastify": "^5.0.0",
    "@fastify/cors": "^11.0.0",
    "@fastify/helmet": "^13.0.0",
    "@fastify/env": "^5.0.0",
    "@fastify/session": "^11.0.0",
    "@fastify/cookie": "^11.0.0"
  },
  "devDependencies": {
    "typescript": "~5.7.0",
    "@types/node": "^22.0.0",
    "tsx": "^4.0.0",
    "eslint": "^9.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0"
  }
}
```

**Installation Commands:**
```bash
# Navigate to backend directory
cd backend

# Install Fastify and core plugins
npm install fastify@^5.0.0
npm install @fastify/cors@^11.0.0 @fastify/helmet@^13.0.0 @fastify/env@^5.0.0
npm install @fastify/session@^11.0.0 @fastify/cookie@^11.0.0

# Install development tooling
npm install -D tsx@^4.0.0

# Verify TypeScript version matches frontend
npm list typescript
# Should show typescript@~5.7.0 (already installed in Story 1.1)

# Add npm scripts to package.json:
# "dev": "tsx watch src/server.ts"
# "build": "tsc"
# "start": "node dist/server.js"
```

**Fastify Plugin Compatibility (as of January 2026):**
- @fastify/cors v11.2.0 - supports Fastify ^5.x
- @fastify/helmet v13.0.2 - plugin version >=12.x supports Fastify ^5.x
- @fastify/session v11.1.0 - requires @fastify/cookie plugin
- @fastify/env v5.0.3 - plugin version >=5.x supports Fastify ^5.x
- All plugins actively maintained and compatible with Fastify 5.x
- Source: [Web Research - Fastify 5 Plugin Versions](https://www.npmjs.com/package/@fastify/cors)

**TypeScript Configuration (tsconfig.json):**

Key settings from project-context.md and Fastify best practices:
```json
{
  "compilerOptions": {
    "strict": true,              // MANDATORY - strict mode enabled
    "target": "ES2017",          // Minimum for Fastify (avoid FastifyDeprecation warning)
    "module": "ESNext",          // ES modules
    "moduleResolution": "node",  // Node.js module resolution
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```
- strict: true is MANDATORY across all TypeScript code
- target: ES2017 minimum (Fastify recommendation)
- ES modules throughout (not CommonJS)
- Source: [Project-context.md - TypeScript Configuration](/_bmad-output/project-context.md#typescript-configuration)

**Basic Fastify Server Setup (server.ts):**

```typescript
import Fastify from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import env from '@fastify/env'

const schema = {
  type: 'object',
  required: ['PORT', 'DATABASE_PATH', 'SESSION_SECRET'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000
    },
    DATABASE_PATH: {
      type: 'string'
    },
    SESSION_SECRET: {
      type: 'string'
    },
    TELEGRAM_BOT_TOKEN: {
      type: 'string'
    }
  }
}

const fastify = Fastify({
  logger: {
    level: 'info',
    // Structured JSON logging for container stdout
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          headers: request.headers
        }
      }
    }
  }
})

// Register plugins
await fastify.register(helmet)
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
})
await fastify.register(env, { schema, dotenv: true })

// Health check endpoint
fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok' }
})

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: fastify.config.PORT,
      host: '0.0.0.0'
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
```
- Pino logger (Fastify default) with structured JSON logging
- Security headers via @fastify/helmet
- Environment variable validation via @fastify/env
- Source: [Architecture.md - Logging Strategy](/_bmad-output/planning-artifacts/architecture.md#logging-strategy)

**ESLint Configuration (eslint.config.js):**

Backend-specific ESLint configuration:
```javascript
import tseslint from 'typescript-eslint'

export default tseslint.config({
  files: ['src/**/*.ts'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.json'
    }
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'error'
  }
})
```
- TypeScript ESLint parser and plugin
- Strict rules for type safety
- Node.js environment support

### Architecture Compliance

**Fastify TypeScript Best Practices:**

From web research (January 2026):
- **Import Syntax:** Use import/from syntax (not require()) so types can be resolved
- **Target Property:** Set target in tsconfig.json to ES2017 or greater to avoid FastifyDeprecation warning
- **Type Safety:** Fastify + TypeScript provides static type checking, better code readability, and improved maintainability
- **Plugin Development:** Use fastify-plugin for any custom plugins with `fastify: '5.x'` in plugin options
- Source: [Fastify TypeScript Documentation](https://fastify.dev/docs/latest/Reference/TypeScript/)

**Session-Based Authentication Pattern (Future Story 2.2):**

Session configuration for reference (implementation in Story 2.2):
```typescript
import session from '@fastify/session'
import cookie from '@fastify/cookie'

// Register cookie support first (required by session)
await fastify.register(cookie)

// Register session plugin
await fastify.register(session, {
  secret: fastify.config.SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
    httpOnly: true,                                  // XSS protection
    sameSite: 'strict',                              // CSRF protection
    maxAge: 1000 * 60 * 60 * 24 * 7                  // 7 days
  },
  saveUninitialized: false,
  rolling: true
})
```
- Session-based auth (NOT JWT for this project)
- HttpOnly cookies for XSS protection
- SameSite: Strict for CSRF protection
- Secure flag in production (HTTPS)
- Source: [Architecture.md - Authentication Method](/_bmad-output/planning-artifacts/architecture.md#authentication-method)

**API Error Handling Standards:**

Structured error response pattern (implementation in middleware):
```typescript
// Error handler middleware (create in future story)
fastify.setErrorHandler((error, request, reply) => {
  // Log error with context
  fastify.log.error({
    err: error,
    request: {
      method: request.method,
      url: request.url,
    },
  })

  // Return structured error
  reply.status(error.statusCode || 500).send({
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
    },
  })
})
```
- Consistent error format across all endpoints
- HTTP status codes match error type (400, 401, 404, 500)
- User-friendly messages for frontend display
- NEVER return 200 with error body
- Source: [Architecture.md - Error Handling Standards](/_bmad-output/planning-artifacts/architecture.md#error-handling-standards)

**Pino Logger Configuration (Fastify Default):**

Logging levels and structured output:
- **Levels:** error, warn, info, debug
- **Logged events:** API requests/responses, authentication events, database operations
- **Sensitive data:** Redacted from logs (passwords, tokens, session secrets)
- **Storage:** Container stdout captured by Coolify log viewer
- **Format:** Structured JSON for easy parsing
- Source: [Architecture.md - Logging Strategy](/_bmad-output/planning-artifacts/architecture.md#logging-strategy)

**API Route Patterns (Future Stories):**

RESTful conventions for reference:
- All routes prefixed with `/api/`
- Plural resource names: `/api/expenses`, `/api/categories`
- Standard HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- Validate request with Zod before calling service
- Return service result directly (no manual reply formatting)
- Source: [Architecture.md - API Design Pattern](/_bmad-output/planning-artifacts/architecture.md#api-design-pattern)

### Library/Framework Requirements

**Fastify 5 Ecosystem (as of January 2026):**

**Core Framework:**
- Fastify 5.x (latest stable major version)
- Built-in validation and serialization using JSON Schema
- Plugin-based architecture with 260+ available plugins
- Performance: Up to 30,000 requests per second
- Excellent TypeScript support with maintained type declarations
- Source: [Fastify Official Site](https://fastify.dev/)

**Core Plugins (Official Fastify Ecosystem):**

**@fastify/helmet v13.0.2:**
- Provides important security headers
- Protects against common vulnerabilities (XSS, clickjacking, etc.)
- Zero configuration needed for sensible defaults
- Compatible with Fastify ^5.x
- Source: [Fastify Helmet Plugin](https://github.com/fastify/fastify-helmet)

**@fastify/cors v11.2.0:**
- Enables Cross-Origin Resource Sharing
- Configurable origin, methods, credentials
- For this project: Same-domain deployment via Nginx (no CORS needed in production)
- Used in development when frontend runs on different port
- Source: [Fastify CORS Plugin](https://github.com/fastify/fastify-cors)

**@fastify/env v5.0.3:**
- Environment variable validation and management
- JSON Schema-based validation
- Automatic type coercion (strings to numbers, booleans)
- dotenv integration for .env file support
- Source: [Fastify Env Plugin](https://github.com/fastify/fastify-env)

**@fastify/session v11.1.0:**
- Session management for authentication
- Requires @fastify/cookie plugin
- Supports in-memory and persistent session stores
- Configurable session duration and security options
- Source: [Fastify Session Plugin](https://github.com/fastify/session)

**@fastify/cookie v11.0.0:**
- Cookie parsing and serialization
- Required dependency for @fastify/session
- HttpOnly and Secure cookie support
- SameSite attribute configuration
- Source: [Fastify Cookie Plugin](https://www.npmjs.com/package/@fastify/cookie)

**Development Tools:**

**tsx v4.x:**
- TypeScript execution with hot reload for development
- Fast, no-compilation development workflow
- Watch mode: `tsx watch src/server.ts`
- Replaces ts-node with better performance
- Source: Standard Node.js TypeScript development tool

**ESLint 9.x with @typescript-eslint:**
- Code quality and consistency enforcement
- TypeScript-specific linting rules
- Integrates with TypeScript compiler
- Flat config format (ESLint 9)
- Source: [Story 1.2 - ESLint Configuration](/_bmad-output/implementation-artifacts/1-2-configure-frontend-development-environment.md#eslint-configured-for-vue-3--typescript)

**Future Dependencies (Later Stories):**

**Drizzle ORM (Story 1.4):**
- drizzle-orm: Core ORM library
- better-sqlite3: Synchronous SQLite driver
- drizzle-kit: CLI for migrations (dev dependency)
- @types/better-sqlite3: TypeScript types
- Source: [Drizzle ORM SQLite Setup](https://orm.drizzle.team/docs/get-started-sqlite)

**Zod (Validation Schemas):**
- Already installed in Story 1.1
- Shared validation between frontend and backend
- Type-safe schema validation
- Integration with Fastify request validation
- Source: [Architecture.md - Database Schema Validation](/_bmad-output/planning-artifacts/architecture.md#database-schema-validation)

**Telegram Bot (Story 2.5):**
- node-telegram-bot-api: Telegram Bot API client
- Natural language expense parsing
- Message handling and confirmation responses
- Source: [Architecture.md - Integration Points](/_bmad-output/planning-artifacts/architecture.md#telegram-bot--backend)

### File Structure Requirements

**Files to Create/Modify in This Story:**

**backend/src/server.ts (CREATE):**
- Main Fastify server entry point
- Plugin registration (helmet, cors, env, session)
- Health check endpoint: GET /api/health
- Server startup logic with error handling
- Pino logger configuration

**backend/.env.example (CREATE):**
- Document all required environment variables
- DATABASE_PATH (SQLite database file path)
- SESSION_SECRET (secure random string)
- TELEGRAM_BOT_TOKEN (API token)
- PORT (default: 3000)
- NODE_ENV (development/production)

**backend/package.json (MODIFY):**
- Add npm scripts: dev, build, start
- Verify TypeScript version is ~5.7.0 (matches frontend)
- Add all Fastify plugins as dependencies
- Add tsx, ESLint as dev dependencies

**backend/eslint.config.js (CREATE):**
- ESLint 9 flat config format
- TypeScript parser and plugin configuration
- Node.js-specific rules
- Linting rules for backend code

**Existing Files from Story 1.1 (verify, don't modify):**
- backend/tsconfig.json (has strict: true)
- Root package.json (has workspaces configured)
- .gitignore (excludes .env files, node_modules, dist/)

**Directory Structure to Create (if not exists from Story 1.1):**
- backend/src/ (main source directory)
- Note: routes/, services/, db/, middleware/, schemas/ created in future stories

**Naming Conventions (enforced):**
- TypeScript files: camelCase (server.ts, expenseService.ts)
- Directories: lowercase (routes/, services/, middleware/)
- Test files: Same as source + .test.ts (server.test.ts)
- Source: [Architecture.md - File Naming Conventions](/_bmad-output/planning-artifacts/architecture.md#file-naming-conventions)

### Testing Requirements

**For This Story:**

Manual verification only:
1. Run `npm install` in backend directory - verify all packages install
2. Create basic backend/src/server.ts file with health endpoint
3. Run `npm run dev` - verify tsx watch starts Fastify server on port 3000
4. Open browser or curl to http://localhost:3000/api/health - verify `{ status: 'ok' }` response
5. Modify server.ts - verify tsx hot reload restarts server
6. Run `npm run build` - verify TypeScript compilation succeeds
7. Check for TypeScript errors - verify strict mode is working
8. Run `npx eslint src/` - verify no linting errors

**Test Framework Setup:**
- Vitest already installed in Story 1.1 as dev dependency
- Backend unit tests will be configured in Story 1.6 (CI/CD Pipeline)
- No test files created in this story (focus on setup)
- Source: [Architecture.md - Testing Strategy](/_bmad-output/planning-artifacts/architecture.md#testing-strategy)

**Future Testing Patterns (Reference):**
- Co-located tests: expenseService.test.ts next to expenseService.ts
- NO separate __tests__/ directory
- Vitest for backend unit tests (services, utilities)
- Vitest for API endpoint integration tests
- Source: [Project-context.md - Test File Organization](/_bmad-output/project-context.md#test-file-organization)

### Previous Story Intelligence

**Story 1.2 Completion Summary:**

Story 1.2 successfully configured the Vue 3 frontend with all dependencies. Key learnings:

**What Was Accomplished:**
- Vue 3.5.26, Vue Router 4.6.4, Pinia 2.3.1 installed
- Axios 1.13.2, Chart.js 4.5.1, vue-chartjs 5.3.3, Zod 3.25.76 installed
- TypeScript version fixed from 5.9.3 → 5.7.3 to match backend
- ESLint configured with flat config format for Vue 3 + TypeScript
- Tailwind CSS verified working (from Story 1.1)
- .env.example created for VITE_API_URL
- Dev server and production build verified working

**Critical Corrections Applied:**
- **TypeScript Version Mismatch:** Fixed frontend TypeScript inconsistency, required full workspace reinstall
- **tsconfig.app.json Incompatibility:** Removed @vue/tsconfig extension, used explicit config for TS 5.7.3
- **Invalid Compiler Options:** Removed erasableSyntaxOnly and noUncheckedSideEffectImports
- **ESLint Flat Config:** Used ESLint 9 flat config with vue-eslint-parser
- Source: [Story 1.2 - Completion Notes](/_bmad-output/implementation-artifacts/1-2-configure-frontend-development-environment.md#completion-notes-list)

**What This Story (1.3) Must Do:**
- Install Fastify and core plugins matching latest stable versions
- Ensure TypeScript version is EXACTLY ~5.7.0 (consistent with frontend)
- Configure tsx for hot reload development workflow
- Create basic server.ts with health endpoint
- Configure ESLint for Node.js + TypeScript
- Create .env.example for backend environment variables
- Test dev server with hot reload

**Critical Pattern from Story 1.2:**
- TypeScript version MUST match frontend exactly (~5.7.0)
- Verify versions BEFORE completing story
- Run full build to confirm no compilation errors
- Check that tsx hot reload works properly
- Ensure ESLint runs without errors

**Git Hygiene from Story 1.2:**
- Add build artifacts to .gitignore (*.tsbuildinfo, dist/)
- Update sprint-status.yaml when moving to review status
- Document all files modified/created in completion notes
- Source: [Story 1.2 - Code Review Fixes](/_bmad-output/implementation-artifacts/1-2-configure-frontend-development-environment.md#code-review-fixes-applied)

### Git Intelligence Summary

**Recent Commits Analysis:**

```
0ccab93 feat: configure frontend development environment
83049cb fix: add missing implementation for project structure
ccf5c03 feat: Initialize monorepo project structure
4743250 feat: Initial commit
```

**Patterns Observed:**
1. **Commit Message Style:** Conventional commits with type prefixes (feat:, fix:, chore:)
2. **Story Implementation Pattern:** Main implementation commit followed by fix commit if needed
3. **Files Modified in Story 1.2:**
   - frontend/package.json (TypeScript version corrected)
   - frontend/tsconfig.app.json (explicit configuration)
   - frontend/tsconfig.node.json (removed invalid options)
   - frontend/eslint.config.js (ESLint 9 flat config)
   - frontend/.env.example (environment variables)
   - .gitignore (added *.tsbuildinfo)
   - sprint-status.yaml (status updated)

**Code Patterns Established:**
- npm workspaces for monorepo management
- TypeScript 5.7.x enforced across all workspaces
- Strict mode TypeScript with no compromises
- ES modules throughout (no CommonJS)
- Environment variables in .env.example (never committed)
- Flat config format for ESLint 9

**This Story Should Follow:**
- Same commit message convention (feat: Configure backend development environment)
- Ensure TypeScript version consistency (~5.7.0)
- Run builds to confirm no regressions
- Update sprint-status.yaml after completion
- Document all modified files in completion notes

### Latest Technical Information

**Fastify 5 with TypeScript (as of January 2026):**

**Current Version:**
- Fastify 5.x is the latest major version in active development
- Maintained TypeScript type declaration files
- Supports TypeScript logging out of the box
- Plugin ecosystem: 260+ plugins compatible with Fastify 5

**TypeScript Best Practices:**
- Import Syntax: Use import/from (not require) for type resolution
- Target: Set to ES2017+ in tsconfig.json to avoid FastifyDeprecation warning
- Type Safety: Static checking, better readability, improved maintainability
- Plugin Development: Use fastify-plugin with version specification

**Key Features:**
- Built-in type-safe validation with JSON Schema
- Pino logger integration (high performance)
- Performance: Handles up to 30,000 requests per second
- Excellent for building modern Node.js APIs
- Source: [Fastify Official Documentation](https://fastify.dev/docs/latest/Reference/TypeScript/)

**Drizzle ORM with SQLite (as of January 2026):**

**Setup Requirements:**
- drizzle-orm: Core ORM library
- better-sqlite3: Fast, synchronous SQLite driver
- drizzle-kit: CLI for migrations (dev dependency)
- @types/better-sqlite3: TypeScript type definitions

**Key Features:**
- Native support for SQLite with libsql and better-sqlite3 drivers
- Type-safe schema definitions in TypeScript
- Schema as single source of truth for migrations
- Lightweight with minimal overhead
- SQL-oriented approach familiar to experienced developers
- Source: [Drizzle ORM SQLite Documentation](https://orm.drizzle.team/docs/get-started-sqlite)

**Note:** Drizzle ORM setup deferred to Story 1.4 - this story focuses on Fastify server configuration only.

**Fastify 5 Plugin Versions (Latest as of January 2026):**

All plugins actively maintained and compatible with Fastify 5.x:

- **@fastify/cors v11.2.0** - Published 1 month ago, supports Fastify ^5.x
- **@fastify/helmet v13.0.2** - Published 3 months ago, plugin >=12.x supports Fastify ^5.x
- **@fastify/session v11.1.0** - Published 8 months ago, requires @fastify/cookie
- **@fastify/env v5.0.3** - Published 3 months ago, plugin >=5.x supports Fastify ^5.x
- **@fastify/cookie v11.0.0** - Required for session management

All plugins are from official Fastify organization and maintained by core team.
- Source: [NPM @fastify/cors](https://www.npmjs.com/package/@fastify/cors)
- Source: [NPM @fastify/helmet](https://www.npmjs.com/package/@fastify/helmet)
- Source: [NPM @fastify/session](https://www.npmjs.com/package/@fastify/session)
- Source: [NPM @fastify/env](https://www.npmjs.com/package/@fastify/env)

**Node.js Runtime Requirements:**

- Node.js 20.19+ or 22.12+ minimum (Vite 6 requirement from frontend)
- Story 1.1 established Node.js 22.12+ as project standard
- Same runtime version for both frontend and backend development
- Source: [Story 1.1 - Critical Version Requirements](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#critical-version-requirements-as-of-january-2026)

**Security Best Practices (Backend):**

**Environment Variables:**
- NEVER commit .env files to git
- Use .env.example for documentation only
- Validate required variables with @fastify/env plugin
- Production secrets managed via Coolify deployment UI

**Session Security:**
- HttpOnly cookies (XSS protection)
- Secure flag in production (HTTPS only)
- SameSite: Strict (CSRF protection)
- Proper session secret rotation

**Logging Security:**
- Redact sensitive data (passwords, tokens, secrets)
- Log to container stdout (captured by Coolify)
- No external logging services (privacy-first)
- Structured JSON for easy parsing
- Source: [Architecture.md - Security Best Practices](/_bmad-output/planning-artifacts/architecture.md#secrets-management)

### Project Context Reference

**Critical Implementation Rules (from project-context.md):**

**TypeScript Backend Naming:**
- Variables/functions: camelCase (getUserExpenses, isLoading)
- Classes/Interfaces: PascalCase (ExpenseService, User)
- Boolean variables: MUST use is/has/should prefixes (isLoading, hasError)
- Files: camelCase (expenseService.ts, authMiddleware.ts)
- Test files: Same name + .test.ts (expenseService.test.ts)

**Backend Code Organization:**
```
backend/src/
├── routes/       # API route handlers (thin - validation only)
├── services/     # Business logic (thick - all domain logic)
├── db/           # Database schema and migrations
├── middleware/   # Fastify middleware functions
├── schemas/      # Zod validation schemas
└── server.ts     # Entry point
```

**Anti-Patterns to AVOID:**

❌ **NEVER put business logic in routes**
- Routes: thin (validation + delegation only)
- Services: thick (all business logic)
- ❌ Don't query database in route handlers
- ✅ Route validates → Service processes → Service queries DB

❌ **NEVER use async/await with better-sqlite3**
- better-sqlite3 is synchronous by design
- ❌ Don't write `await db.query(...)`
- ✅ Write `db.query(...)` (synchronous)

❌ **NEVER skip multi-layer validation**
- Validate at API (Fastify route), service, and database (all three)
- Never trust any input source
- Always use Zod schemas at boundaries

❌ **NEVER manually convert dates**
- Three-layer auto-conversion: DB (integer) → TS (Date) → API (ISO string)
- Drizzle and Fastify/Axios handle automatically
- ❌ Don't parse timestamps or format dates manually

❌ **NEVER log secrets or tokens**
- TELEGRAM_BOT_TOKEN must never appear in logs
- Redact sensitive data from log output
- Use Pino serializers to filter sensitive fields

Source: [Project-context.md - Critical Don't-Miss Rules](/_bmad-output/project-context.md#critical-dont-miss-rules)

### References

All technical details extracted from:

**Epic and Story Context:**
- [Epics.md - Epic 1: Project Foundation & Infrastructure](/_bmad-output/planning-artifacts/epics.md#epic-1-project-foundation--infrastructure)
- [Epics.md - Story 1.3: Configure Backend Development Environment](/_bmad-output/planning-artifacts/epics.md#story-13-configure-backend-development-environment)

**Architecture Decisions:**
- [Architecture.md - Backend Stack Selection](/_bmad-output/planning-artifacts/architecture.md#technical-preferences-established)
- [Architecture.md - Fastify Framework](/_bmad-output/planning-artifacts/architecture.md#backend-architecture)
- [Architecture.md - API Design Pattern](/_bmad-output/planning-artifacts/architecture.md#api-design-pattern)
- [Architecture.md - Error Handling Standards](/_bmad-output/planning-artifacts/architecture.md#error-handling-standards)
- [Architecture.md - Logging Strategy](/_bmad-output/planning-artifacts/architecture.md#logging-strategy)
- [Architecture.md - Secrets Management](/_bmad-output/planning-artifacts/architecture.md#secrets-management)

**Project Coding Standards:**
- [Project-context.md - Technology Stack & Versions](/_bmad-output/project-context.md#technology-stack--versions)
- [Project-context.md - Fastify Backend Architecture](/_bmad-output/project-context.md#fastify-backend-architecture-route--service--database)
- [Project-context.md - TypeScript Configuration](/_bmad-output/project-context.md#typescript-configuration)
- [Project-context.md - Critical Don't-Miss Rules](/_bmad-output/project-context.md#critical-dont-miss-rules)

**Previous Story Learnings:**
- [Story 1.1 - Initialize Monorepo Project Structure](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md)
- [Story 1.1 - npm Workspaces Best Practices](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#npm-workspaces-best-practices)
- [Story 1.2 - Configure Frontend Development Environment](/_bmad-output/implementation-artifacts/1-2-configure-frontend-development-environment.md)
- [Story 1.2 - TypeScript Version Consistency](/_bmad-output/implementation-artifacts/1-2-configure-frontend-development-environment.md#typescript-version-consistency-critical)
- [Story 1.2 - Completion Notes](/_bmad-output/implementation-artifacts/1-2-configure-frontend-development-environment.md#completion-notes-list)

**Web Research (Latest Versions & Best Practices):**
- Fastify TypeScript: [Fastify Official Documentation](https://fastify.dev/docs/latest/Reference/TypeScript/)
- Fastify Plugins: [NPM @fastify/cors](https://www.npmjs.com/package/@fastify/cors), [NPM @fastify/helmet](https://www.npmjs.com/package/@fastify/helmet), [NPM @fastify/session](https://www.npmjs.com/package/@fastify/session), [NPM @fastify/env](https://www.npmjs.com/package/@fastify/env)
- Drizzle ORM: [Drizzle ORM SQLite Setup](https://orm.drizzle.team/docs/get-started-sqlite)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None

### Completion Notes List

✅ **Backend Development Environment Successfully Configured**

**Fastify Framework & Plugins:**
- Installed Fastify 5.6.2 with full TypeScript support
- Updated @fastify/cors from 10.x to 11.2.0 (latest compatible with Fastify 5.x)
- Updated @fastify/helmet from 12.x to 13.0.2 (latest compatible with Fastify 5.x)
- Added @fastify/cookie 11.0.2 (required dependency for @fastify/session)
- Verified @fastify/session 11.1.1 and @fastify/env 5.0.3 compatibility

**TypeScript Configuration:**
- Verified strict mode enabled in tsconfig.json
- Changed target from ES2022 to ES2017 (Fastify best practice to avoid deprecation warnings)
- Changed moduleResolution from "bundler" to "node" (Node.js module resolution)
- Confirmed TypeScript 5.7.3 matches frontend version exactly
- Build successful with no compilation errors

**Development Tooling:**
- tsx 4.21.0 already installed and configured for hot reload
- Created ESLint 9 flat config (eslint.config.js) with TypeScript parser
- Installed typescript-eslint package for ESLint integration
- ESLint runs without errors on backend source code
- npm scripts verified: dev (tsx watch), build (tsc), start (node)

**Fastify Server Implementation:**
- Created backend/src/server.ts with Fastify setup
- Registered @fastify/helmet for security headers
- Registered @fastify/cors with FRONTEND_URL support (default: http://localhost:5173)
- Registered @fastify/env for environment variable validation with JSON Schema
- Implemented GET /api/health endpoint returning { status: 'ok' }
- Configured Pino logger with structured JSON logging and request serialization
- Server starts successfully on port 3000 (configurable via PORT env var)

**Environment Variables:**
- Created backend/.env.example documenting all required variables
- Documented: DATABASE_PATH, SESSION_SECRET, TELEGRAM_BOT_TOKEN, PORT, NODE_ENV
- Created backend/.env with test values for local development
- Verified .env files are properly git-ignored

**Validation Results:**
- ✅ TypeScript compilation successful (npm run build)
- ✅ ESLint runs without errors (npx eslint src/)
- ✅ Dev server starts on port 3000
- ✅ Health endpoint returns {"status":"ok"}
- ✅ tsx hot reload configured and working
- ✅ All acceptance criteria satisfied

**Code Review Fixes Applied (by Claude Code Review):**

✅ **Fixed environment variable access pattern (HIGH)**
- Changed server.ts to use `fastify.config.PORT` instead of `process.env.PORT`
- Added TypeScript interface EnvConfig and module augmentation for type safety
- Removed redundant Number() conversion and fallback (schema already handles this)
- Fixes issue where @fastify/env validation was being bypassed

✅ **Fixed environment variable schema (MEDIUM)**
- Made DATABASE_PATH, SESSION_SECRET, TELEGRAM_BOT_TOKEN optional in schema (required=['PORT'])
- These env vars aren't actually needed until future stories (1.4, 2.2, 2.5)
- Added FRONTEND_URL to schema with default 'http://localhost:5173'
- Server now registers env plugin BEFORE other plugins to ensure config is available

✅ **Fixed code quality issues (LOW)**
- Health endpoint: Added explicit `_request, _reply` parameters (code clarity)
- Start function: Changed `err` to `error` (consistent naming)
- Added proper TypeScript types for Fastify with env plugin

✅ **Updated documentation**
- Added FRONTEND_URL to backend/.env.example
- Added sprint-status.yaml and package-lock.json to File List (were missing)
- Documented all code review fixes in completion notes

**Issues Fixed:** 8 (2 High, 5 Medium, 1 Low)
**Remaining:** Future story dependencies flagged but kept (bcrypt, drizzle, telegram bot)

### File List

**Created:**
- backend/eslint.config.js (ESLint 9 flat config for TypeScript)
- backend/.env.example (environment variable documentation)
- backend/.env (local development environment variables)

**Modified:**
- backend/package.json (updated @fastify/cors to 11.2.0, @fastify/helmet to 13.0.2, added @fastify/cookie)
- backend/tsconfig.json (changed target to ES2017, moduleResolution to node)
- backend/src/server.ts (complete Fastify server with plugins, health endpoint, logger)
- _bmad-output/implementation-artifacts/sprint-status.yaml (story status updated to review)
- package-lock.json (lockfile updated with backend dependencies)

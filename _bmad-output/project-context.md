---
project_name: 'finance-doctor'
user_name: 'Andres'
date: '2026-01-03'
sections_completed: ['technology_stack', 'language_specific', 'framework_specific', 'testing', 'code_quality', 'workflow', 'critical_rules']
status: 'complete'
rule_count: 85
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**Frontend:**
- Vue 3.x with TypeScript 5.x
- Vite 6.x (build tool)
- Tailwind CSS 3.x (styling)
- Pinia (state management)
- Chart.js (data visualization)

**Backend:**
- Fastify 5.x with TypeScript 5.x
- Node.js 20+ (required)
- Drizzle ORM with better-sqlite3 driver (synchronous SQLite)
- @fastify/session (session management)
- Zod (validation - shared with frontend)

**Testing:**
- Vitest (unit/integration tests)
- Playwright (E2E tests)

**Deployment:**
- Docker containerization
- Nginx reverse proxy
- Coolify VPS hosting

**Critical Constraints:**
- TypeScript 5.x MUST be consistent across monorepo
- Modern browsers only (Chrome, Firefox, Safari latest 2 versions - NO IE)
- better-sqlite3 uses synchronous driver (not async)

## Critical Implementation Rules

### Language-Specific Rules (TypeScript/JavaScript)

**Naming Conventions:**
- TypeScript code: camelCase for variables, functions, properties
- Database fields: snake_case (Drizzle auto-converts between layers)
- Components/Classes: PascalCase
- Boolean variables: MUST use `is`, `has`, `should` prefixes
  - ✅ `isLoading`, `hasError`, `shouldValidate`
  - ❌ `loading`, `error`, `validate`

**Type Definitions:**
- Prefer `interface` over `type` for object shapes (extensibility)
- Use `type` only for unions, intersections, or primitive aliases
- ✅ `interface User { id: number; name: string; }`
- ❌ `type User = { id: number; name: string; }`

**Import/Export:**
- Named exports preferred over default exports
- Shared validation schemas: `frontend/src/schemas/` and `backend/src/schemas/`
- Import types with `import type { ... }` when importing only types

**Error Handling:**
- Structured error format required: `{ success: false, error: { code: string, message: string } }`
- HTTP status codes MUST match error types (400 for validation, 401 for auth, 404 for not found, 500 for server)
- Always catch async errors with try/catch
- User-friendly messages only (no stack traces to frontend)

**Date Handling (CRITICAL - Three-Layer Pattern):**
- Database layer: Unix timestamps as integers (`expense_date: integer`)
- TypeScript code: Date objects (`expenseDate: Date`)
- API JSON: ISO 8601 strings (`"2024-01-15T10:30:00Z"`)
- Drizzle ORM auto-converts DB ↔ TS, Fastify/Axios auto-converts TS ↔ JSON
- NEVER manually convert - trust the framework layer conversions

**TypeScript Configuration:**
- Strict mode enabled (strict: true)
- ES modules only (not CommonJS)
- Consistent tsconfig.json across frontend/backend monorepo

### Framework-Specific Rules (Vue 3 + Fastify)

**Vue 3 Component Organization (Hybrid Structure):**
- `components/` - Reusable UI components
- `views/` - Page-level components (route targets)
- `layouts/` - Layout wrappers
- `composables/` - Reusable composition functions (use `use*` naming)
- `stores/` - Pinia state management

**Vue Composition API:**
- MUST use `<script setup>` syntax (not Options API)
- Composables: `useExpenses()`, `useAuth()`, `useCategories()`
- Props: `defineProps<{ userId: number; isActive: boolean }>()`
- Emits: `defineEmits<{ submit: [data: FormData]; cancel: [] }>()`

**Pinia Store Patterns (CRITICAL - Granular Loading States):**
- State MUST include separate loading flags for each operation:
  ```typescript
  state: () => ({
    items: [],
    isLoading: false,      // For fetching
    isCreating: false,     // For create operation
    isUpdating: false,     // For update operation
    isDeleting: false,     // For delete operation
    error: null
  })
  ```
- Actions handle async with try/catch and set appropriate loading state
- Store files: `expenses.ts`, `categories.ts`, `auth.ts`

**Fastify Backend Architecture (Route → Service → Database):**
- **Routes:** Thin handlers in `routes/` - validation and delegation only
- **Services:** Business logic in `services/` - all domain logic lives here
- **Database:** Drizzle ORM access ONLY in services (never in routes)
- ✅ Route validates → Service processes → Service queries DB
- ❌ Route directly queries database or contains business logic

**Fastify Route Patterns:**
- All routes prefixed with `/api/`
- RESTful conventions: GET (read), POST (create), PUT (update), DELETE (delete)
- Validate request with Zod before calling service
- Return service result directly (no manual reply formatting)

**Authentication & Sessions:**
- Use `@fastify/session` with HttpOnly cookies
- Session-based auth (NOT JWT for this project)
- Same-domain deployment via Nginx (no CORS needed)
- Secure session cookies in production

### Testing Rules

**Testing Stack:**
- Vitest: Unit and integration tests (frontend + backend)
- Playwright: E2E tests (full-stack)
- Test files: Co-located with source (`.test.ts` next to `.ts`)
  - ✅ `expenseService.ts` + `expenseService.test.ts`
  - ❌ Separate `__tests__/` directory

**Test Structure:**
- Use `describe()` for grouping related tests
- Use `it()` or `test()` for individual cases
- Arrange-Act-Assert pattern for clarity
- Descriptive test names: "should create expense with valid data"

**Mock Usage:**
- Mock external dependencies in unit tests (database, APIs)
- Use `vi.mock()` for module mocking
- Reset mocks in `beforeEach()` to prevent test pollution
- Keep mocks simple and focused

**Test Boundaries:**
- **Unit:** Test single function/component in isolation (mock all dependencies)
- **Integration:** Test services with real Drizzle ORM (use test database)
- **E2E:** Playwright tests full stack (real database, real browser)

**Coverage Focus:**
- Prioritize critical business logic (services, validation, state management)
- Test happy paths AND error cases
- Test edge cases: empty arrays, null values, validation failures, boundary conditions
- Don't force 100% coverage - focus on meaningful tests

### Code Quality & Style Rules

**File Naming Conventions:**
- Vue components: PascalCase (`ExpenseForm.vue`, `CategoryList.vue`)
- TypeScript files: camelCase (`expenseService.ts`, `authMiddleware.ts`)
- Test files: Match source + `.test.ts` (`expenseService.test.ts`)
- Composables: `use` prefix (`useExpenses.ts`, `useAuth.ts`)
- Store files: Singular noun (`expenses.ts`, `categories.ts`, `auth.ts`)

**Code Organization (Monorepo):**
```
frontend/src/
├── components/   # Reusable UI components
├── views/        # Page-level route components
├── layouts/      # Layout wrappers
├── composables/  # Composition functions
├── stores/       # Pinia stores
├── schemas/      # Zod validation schemas
└── router/       # Vue Router config

backend/src/
├── routes/       # API route handlers (thin)
├── services/     # Business logic (thick)
├── db/           # Database schema + migrations
├── middleware/   # Fastify middleware
├── schemas/      # Zod validation schemas
└── server.ts     # Entry point
```

**Naming Summary:**
- Variables/functions: camelCase
- Classes/Interfaces/Components: PascalCase
- Database fields: snake_case
- Booleans: `is*`, `has*`, `should*` prefixes
- Constants: UPPER_SNAKE_CASE (only if truly constant)

**Documentation:**
- NO unnecessary comments - prefer self-documenting code
- Only comment WHY, never WHAT (code shows what)
- Complex business logic: Brief explanation only
- NO auto-generated JSDoc unless building public API
- Clear naming > comments

**Code Style:**
- Early returns over nested conditionals
- Max nesting depth: 3 levels
- Keep functions focused and small
- One responsibility per function/class

### Development Workflow Rules

**Environment Configuration:**
- Local: `.env` files (NEVER commit to git)
- Production: Coolify environment variables
- Required env vars: `TELEGRAM_BOT_TOKEN`, `SESSION_SECRET`, database connection
- Always maintain `.env.example` with dummy values for documentation

**Docker & Deployment:**
- Docker containerization required for local dev and production
- Multi-stage Dockerfiles (build stage + runtime stage)
- docker-compose.yml for local development
- Nginx reverse proxy for same-domain deployment (no CORS)
- Production: Coolify VPS hosting

**Database Management:**
- Drizzle migrations in `backend/src/db/migrations/`
- Generate: `drizzle-kit generate` (creates migration from schema changes)
- Apply: `drizzle-kit migrate` (runs migrations)
- NEVER modify existing migrations - always create new ones
- Database file `finance.db` NOT committed to git
- Backup: 30-day retention via automated cron script

**Git Workflow:**
- Branch naming: `feature/`, `fix/`, `chore/` prefixes
- Commit messages: Conventional commits
  - `feat:` for new features
  - `fix:` for bug fixes
  - `chore:` for maintenance
- Main branch: `main` (protected)
- Small, focused commits preferred

**Security Checklist (CRITICAL):**
- NEVER commit `.env` files
- NEVER commit database files (`*.db`)
- NEVER commit `node_modules/`
- NEVER commit tokens or secrets
- Review `.gitignore` before first commit
- Keep `TELEGRAM_BOT_TOKEN` in environment only

### Critical Don't-Miss Rules

**Anti-Patterns to AVOID:**

❌ **NEVER mix database and TypeScript naming**
- Database: `snake_case`, TypeScript: `camelCase`
- Drizzle auto-converts - trust the ORM
- ❌ Don't use `expense_date` in TypeScript code
- ✅ Use `expenseDate` in TypeScript, let Drizzle map to DB

❌ **NEVER manually convert dates**
- Three-layer auto-conversion: DB (integer) → TS (Date) → API (ISO string)
- Drizzle and Fastify/Axios handle this automatically
- ❌ Don't parse timestamps or format dates manually
- ✅ Trust framework conversions

❌ **NEVER skip multi-layer validation**
- Validate at frontend, API, and database (all three layers)
- Never trust frontend input in backend
- Always use Zod schemas
- ❌ Don't assume data is valid from your own UI

❌ **NEVER put business logic in routes**
- Routes: thin (validation + delegation only)
- Services: thick (all business logic)
- ❌ Don't query database in route handlers
- ✅ Route validates → Service processes → Service queries DB

❌ **NEVER use async/await with better-sqlite3**
- better-sqlite3 is synchronous by design
- ❌ Don't write `await db.query(...)`
- ✅ Write `db.query(...)` (synchronous)

**Edge Cases & Gotchas:**

⚠️ **Backdated expenses:** Allow past dates (recovery scenario), reject future dates
⚠️ **Category deletion:** Check for existing expenses first (foreign key integrity)
⚠️ **Empty states:** Handle gracefully (no expenses, no categories, no monthly data)
⚠️ **Telegram bot latency:** Keep under 10 seconds (critical for user habit formation)
  - Validate quickly, save, respond immediately
  - Don't do heavy processing in bot handler

**Security Rules (CRITICAL):**

🔒 **Privacy-first architecture**
- NEVER add third-party analytics or tracking
- NEVER send financial data to external services
- NEVER use cloud storage for expenses
- Local-first: SQLite on VPS only

🔒 **Token & credential security**
- `TELEGRAM_BOT_TOKEN` in environment variables ONLY
- NEVER hardcode tokens in source
- NEVER log tokens or secrets
- HttpOnly cookies for sessions (XSS protection)

🔒 **Input validation**
- Validate Telegram input (untrusted user input)
- Validate API requests (don't trust your own frontend)
- Use Zod schemas for type-safe validation

**Performance Gotchas:**

⚡ **Required database indexes:** `expense_date`, `category_id` (queries slow without them)
⚡ **Chart data aggregation:** Pre-calculate totals in backend (don't send 1,500 raw expenses)
⚡ **Lazy loading:** Load current month first (2s target), historical months on demand

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-01-03

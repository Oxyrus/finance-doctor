---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - '/Users/andres/Projects/finance-doctor/_bmad-output/planning-artifacts/product-brief-finance-doctor-2026-01-02.md'
  - '/Users/andres/Projects/finance-doctor/_bmad-output/planning-artifacts/prd.md'
workflowType: 'architecture'
project_name: 'finance-doctor'
user_name: 'Andres'
date: '2026-01-02'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

finance-doctor has 34 functional requirements organized across 7 capability areas:

1. **Expense Tracking & Entry (FR1-FR5)** - Telegram bot-based natural language expense logging with backdating support for recovery scenarios
2. **Category Management (FR6-FR10)** - Custom category definition and management, required for all expense entries
3. **Dashboard & Spending Visualization (FR11-FR17)** - Current month expense viewing with category breakdowns, responsive across desktop and mobile browsers
4. **Monthly Reporting & Insights (FR18-FR21)** - Month-end summaries with spending pattern identification and actionable insights
5. **Data Management & Retrieval (FR22-FR27)** - Persistent storage with 12-month historical data support and efficient date-range filtering
6. **User Access & Authentication (FR28-FR31)** - Shared household access with multi-device session management
7. **Onboarding & Setup (FR32-FR34)** - Initial category setup and Telegram account connection

The architectural challenge is integrating three distinct components (Telegram bot input, Node.js backend, Vue.js dashboard) into a cohesive system that maintains data consistency and privacy guarantees.

**Non-Functional Requirements:**

37 non-functional requirements define critical architectural constraints:

**Performance Requirements (NFR1-NFR9):**
- Telegram bot expense entry: 10-second maximum latency (critical for habit formation)
- Dashboard initial load: 2-second target for current month
- Historical data (12 months): 3-second load target
- Chart rendering: 500ms maximum
- Efficient handling of 1,200-1,500 expense entries
- Database indexing on date and category fields
- Lazy loading for historical months

**Security & Privacy Requirements (NFR10-NFR19):**
- Local-first data storage with no third-party dependencies
- No external data sharing or cloud storage of financial data
- Authentication between Vue app and Node.js backend
- Telegram bot token secured in environment variables
- No third-party analytics or tracking scripts
- Backend-only data persistence (minimal browser storage)

**Reliability Requirements (NFR20-NFR28):**
- Telegram bot: 99%+ uptime
- Zero data loss tolerance
- Graceful error recovery without data corruption
- Clear error messaging
- Support for backdated entries without integrity issues

**Integration Requirements (NFR29-NFR37):**
- Telegram Bot API integration with natural language parsing
- Shared Node.js backend for both bot and Vue dashboard
- Single database for unified data access
- Modern evergreen browser support only (Chrome, Firefox, Safari - latest 2 versions)
- No IE or legacy browser compatibility needed

**Scale & Complexity:**

- **Primary domain:** Web application (full-stack JavaScript)
- **Complexity level:** Low
- **Target users:** 2 (household members)
- **Data volume:** 1,200-1,500 expense entries over 12 months
- **Estimated architectural components:** 3 major components (Telegram bot handler, Node.js API backend, Vue.js SPA frontend)

### Technical Constraints & Dependencies

**Mandatory Technology Decisions (from PRD):**
- **Frontend:** Vue.js SPA with refresh-based updates (no real-time WebSockets/polling)
- **Backend:** Node.js serving both web app and Telegram bot
- **Integration:** Telegram Bot API for mobile input channel
- **Browser targets:** Modern evergreen browsers only (no legacy support)

**Deferred Decisions:**
- **Database:** SQLite vs Postgres (both viable, decision deferred to implementation)
  - SQLite: Simpler deployment, single-file database, perfect for personal use
  - Postgres: More robust, better for potential future scaling

**Hard Constraints:**
- Privacy-first: No cloud storage or third-party data sharing allowed
- Local deployment: Must support self-hosted deployment on personal infrastructure
- Refresh-based updates: Explicitly avoiding real-time sync complexity
- No SEO requirements: Personal tool, not public-facing

### Cross-Cutting Concerns Identified

**Privacy & Data Security**
- Affects: All components (bot, backend, frontend)
- Impact: Drives local-first architecture, no external service dependencies, secure token management
- Decision areas: Data storage location, session management, authentication strategy

**Performance & Responsiveness**
- Affects: Telegram bot response time, dashboard load performance, database query efficiency
- Impact: Bot latency is critical for habit formation; dashboard speed enables mid-month check-ins
- Decision areas: Database indexing strategy, lazy loading approach, query optimization

**Data Integrity & Consistency**
- Affects: Expense-category relationships, backdated entries, concurrent access
- Impact: Zero data loss tolerance requires robust persistence and validation
- Decision areas: Database schema design, transaction handling, validation rules

**Multi-Device Access**
- Affects: Web dashboard, authentication, session management
- Impact: Household members access from multiple devices (desktop, mobile browsers)
- Decision areas: Session strategy, responsive design implementation, state management

**Maintainability & Simplicity**
- Affects: Overall architecture, deployment strategy, long-term operations
- Impact: Solo/small team maintenance requires simple, understandable architecture
- Decision areas: Framework choices, deployment approach, monitoring needs

## Starter Template Evaluation

### Primary Technology Domain

**Full-stack web application** with separate frontend and backend in a monorepo structure:
- **Frontend:** Vue 3 SPA with TypeScript and Tailwind CSS
- **Backend:** Fastify API server with TypeScript
- **Database:** SQLite with Drizzle ORM
- **Deployment:** Docker containerized application for VPS hosting

### Technical Preferences Established

Based on collaborative discussion with the development team:

**Language & Type Safety:**
- TypeScript across both frontend and backend for type safety and developer experience

**Frontend Stack:**
- Vue 3 with Composition API (team has extensive Vue experience)
- Tailwind CSS for utility-first styling
- Vite as build tool (modern, fast, Vue 3 optimized)

**Backend Stack:**
- Fastify framework (performance-focused, lightweight)
- SQLite database (perfect for household-scale personal tool, simpler deployment)
- Drizzle ORM (lightweight, type-safe, SQL-oriented)

**Deployment & Infrastructure:**
- Docker containerization for consistent deployment
- Self-hosted VPS deployment
- Monorepo structure for simplified development and deployment

### Starter Options Considered

**Option 1: Official CLI Tools (Manual Setup)**
- Vite official `vue-ts` template + manual Tailwind configuration
- Custom Fastify backend setup
- Pros: Clean, minimal, full control, latest versions
- Cons: Requires manual configuration of tooling

**Option 2: Community Pre-configured Starters**
- Frontend: Uninen/vite-ts-tailwind-starter (includes Vue 3, TypeScript, Tailwind, Vitest, Playwright)
- Backend: marcoturi/fastify-boilerplate (Fastify 5 with clean architecture patterns)
- Pros: Everything pre-configured, testing setup included
- Cons: Opinionated choices, potential overhead for simple use case

**Option 3: Simple Monorepo with Official Tools (Selected)**
- Combine official Vite template with custom backend setup in monorepo
- Manual configuration guided by team's experience level
- Pros: Balance of structure and flexibility, team controls all decisions
- Cons: More initial setup than pre-configured starters

### Selected Approach: Custom Monorepo with Official Tools

**Rationale for Selection:**

Given the team's extensive experience with Vue and Node.js, a custom setup using official tools provides the best balance of:
- **Clean foundation:** Start with minimal, well-maintained official tools
- **Full control:** Team can make informed decisions about every dependency
- **Appropriate scale:** Avoid enterprise patterns unnecessary for household-scale application
- **Learning opportunity:** Manual Tailwind and Drizzle setup takes minimal time for experienced developers
- **Maintainability:** Simple structure easier to maintain long-term

The monorepo structure simplifies development workflow and Docker deployment while keeping frontend and backend properly separated.

**Project Structure:**
```
finance-doctor/
├── frontend/              # Vue 3 + TypeScript + Tailwind SPA
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/               # Fastify + TypeScript + Drizzle API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── db/           # Database schema and migrations
│   │   └── server.ts     # Fastify server setup
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml     # Container orchestration
├── Dockerfile.frontend
├── Dockerfile.backend
├── package.json           # Root package for shared scripts
└── README.md
```

**Initialization Commands:**

**Frontend Setup:**
```bash
# Create Vite project with Vue 3 + TypeScript template
npm create vite@latest frontend -- --template vue-ts

# Navigate to frontend and install Tailwind CSS
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install additional frontend dependencies
npm install vue-router@4
npm install axios  # For API communication
npm install chart.js vue-chartjs  # For spending visualizations
```

**Backend Setup:**
```bash
# Create backend directory and initialize
mkdir backend && cd backend
npm init -y

# Install Fastify and core plugins
npm install fastify
npm install @fastify/cors @fastify/helmet @fastify/env
npm install node-telegram-bot-api  # Telegram Bot integration

# Install Drizzle ORM and SQLite
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3

# Install TypeScript and development tools
npm install -D typescript @types/node tsx
npm install -D eslint @typescript-eslint/parser @typescript/eslint-plugin
npx tsc --init
```

**Root Monorepo Setup:**
```bash
# Initialize root package.json for shared scripts
npm init -y

# Add workspace configuration to root package.json:
# "workspaces": ["frontend", "backend"]
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript 5.x across frontend and backend
- Node.js 20.19+ or 22.12+ runtime (Vite requirement)
- ES modules throughout (modern JavaScript)

**Frontend Architecture:**
- Vue 3.x with Composition API as default pattern
- Vite 6.x for build tooling and development server
- Tailwind CSS 3.x for utility-first styling with PostCSS processing
- Vue Router 4 for client-side routing
- Chart.js for data visualization (spending charts)

**Backend Architecture:**
- Fastify 5.x framework with plugin-based architecture
- Drizzle ORM for type-safe database operations
- better-sqlite3 driver for performant local SQLite access
- node-telegram-bot-api for Telegram Bot integration
- @fastify/cors for cross-origin resource sharing
- @fastify/helmet for security headers
- @fastify/env for environment variable management

**Build Tooling:**
- Vite for frontend bundling with HMR (Hot Module Replacement)
- esbuild-based optimization for production builds
- TypeScript compiler (tsc) for backend type checking
- tsx for backend development with hot reload
- drizzle-kit for database schema management and migrations

**Code Organization:**
- Frontend: Component-based architecture with clear separation (components/, views/, composables/, stores/)
- Backend: Route-based organization with service layer pattern
- Shared types possible via TypeScript definition files
- Database schema as single source of truth (Drizzle schema files)

**Development Experience:**
- Vite dev server with instant HMR for frontend
- tsx watch mode for backend hot reload
- TypeScript strict mode for maximum type safety
- ESLint for code quality and consistency
- Monorepo workspace for unified dependency management

**Testing Strategy (Post-MVP):**
- Vitest for frontend unit/component testing (Vite-native)
- Playwright for end-to-end testing
- Node.js native test runner or Vitest for backend unit tests
- Drizzle migrations for database schema testing

**Docker Deployment:**
- Multi-stage builds for optimized container images
- Frontend: Nginx-based static file serving
- Backend: Node.js runtime with production dependencies only
- Docker Compose for local development and VPS deployment
- SQLite database file mounted as volume for data persistence

**Security Defaults:**
- @fastify/helmet provides secure HTTP headers
- @fastify/cors configured for specific origin control
- Telegram bot token secured via environment variables
- No sensitive data in browser storage (session-only)
- TypeScript prevents many common runtime errors

### Database Layer Architecture

**Drizzle ORM Selection Rationale:**

For the SQLite use case, Drizzle ORM was selected over Prisma for these reasons:

**Performance & Footprint:**
- Lightweight runtime with minimal overhead (critical for VPS deployment)
- SQL-like query syntax closer to database operations
- Smaller bundle size compared to Prisma
- Excellent TypeScript inference without code generation overhead

**Developer Experience:**
- Type-safe schema definitions in TypeScript
- Schema as single source of truth for migrations
- drizzle-kit for migration generation and management
- SQL-oriented approach familiar to experienced developers

**SQLite Optimization:**
- Native better-sqlite3 driver support (synchronous, fast)
- No driver adapter complexity (unlike Prisma 7)
- Optimized for local-first databases
- Efficient query building for simple schemas

**Drizzle Setup Pattern:**
```typescript
// backend/src/db/schema.ts - Type-safe schema definition
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey(),
  amount: integer('amount').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

### Integration Points

**Telegram Bot ↔ Backend:**
- node-telegram-bot-api processes incoming messages
- Natural language parsing in backend service layer
- Direct database writes via Drizzle ORM
- Confirmation messages sent back via Telegram API

**Vue Frontend ↔ Backend:**
- RESTful API communication via axios
- CORS configured for specific frontend origin
- JWT or session-based authentication (TBD in auth decisions)
- Refresh-based data fetching (no WebSockets)

**Backend ↔ Database:**
- Drizzle ORM provides type-safe query interface
- better-sqlite3 synchronous driver for SQLite operations
- Migration-based schema evolution via drizzle-kit
- Connection pooling not needed (SQLite single-file)

### Next Steps

**Project Initialization** should be the first implementation story, including:
1. Execute frontend initialization commands
2. Execute backend initialization commands
3. Configure Tailwind CSS in frontend
4. Set up TypeScript configurations
5. Create initial Docker configuration
6. Verify development environment setup
7. Commit initial project structure

This establishes the technical foundation before implementing any features.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Database schema and validation strategy (Zod integration)
- Authentication method (session-based with shared household login)
- API error handling standards (structured responses)
- Environment configuration approach (.env local, Coolify production)
- Backup strategy (automated daily SQLite backups)

**Important Decisions (Shape Architecture):**
- State management approach (Pinia)
- Component architecture patterns (hybrid organization)
- API documentation strategy (@fastify/swagger)
- CI/CD pipeline setup (GitHub Actions + Coolify)
- Logging strategy (Pino with container stdout)

**Deferred Decisions (Post-MVP):**
- Caching strategy (not needed for current scale)
- Rate limiting (unnecessary for household use)
- Off-site backups (local VPS sufficient for MVP)
- Advanced monitoring/alerting (Coolify logs sufficient initially)

### Data Architecture

**Database Schema Validation**
- **Decision:** Zod integration for runtime validation
- **Rationale:** Type-safe validation that works seamlessly with TypeScript and Drizzle ORM. Validates Telegram bot input parsing, API requests, and database operations.
- **Implementation:**
  - Shared Zod schemas between frontend and backend
  - Drizzle schema integrated with Zod for consistency
  - Runtime validation at API boundaries (Telegram bot input, HTTP endpoints)
- **Affects:** All data input points (Telegram bot, API endpoints, database writes)

**Database Migrations**
- **Decision:** drizzle-kit for schema management and migrations
- **Rationale:** Already established in starter template evaluation. Type-safe migrations generated from Drizzle schema definitions.
- **Implementation:**
  - Schema defined in `backend/src/db/schema.ts`
  - Migrations generated via `drizzle-kit generate`
  - Applied via `drizzle-kit migrate`
- **Affects:** Database schema evolution, deployment process

**Caching Strategy**
- **Decision:** No caching for MVP
- **Rationale:** SQLite with better-sqlite3 is performant enough for 1,200-1,500 entries. Refresh-based UI doesn't require real-time cache invalidation. Simpler architecture.
- **Future consideration:** Can add in-memory caching for category list if needed (unlikely)
- **Affects:** API response times, architecture complexity

### Authentication & Security

**Authentication Method**
- **Decision:** Session-based authentication with shared household login
- **Implementation:**
  - @fastify/session with secure session cookies
  - Single shared username/password for household members
  - Sessions stored server-side (in-memory or SQLite for persistence across restarts)
  - HttpOnly, Secure, SameSite cookies
- **Rationale:**
  - Both household members access same financial data
  - More secure than JWT (sessions can be invalidated server-side)
  - Simpler than individual accounts with complex permissions
  - No tokens stored in browser localStorage
- **Affects:** Web dashboard access, API endpoint protection

**API Security Configuration**
- **Decision:** Same-domain deployment via Nginx reverse proxy, no rate limiting
- **Implementation:**
  - Nginx serves frontend static files
  - Nginx proxies `/api/*` requests to Fastify backend
  - No CORS needed (same origin)
  - @fastify/helmet for security headers
  - No rate limiting (known 2-user household)
- **Rationale:**
  - Simpler and more secure than CORS
  - Self-hosted with known users eliminates need for rate limiting
  - Privacy-first: no external security services
- **Affects:** Deployment architecture, API access patterns

**Secrets Management**
- **Decision:** .env files for local development, Coolify environment variables for production
- **Implementation:**
  - `.env.example` files in git with dummy values
  - Actual `.env` files git-ignored
  - Coolify UI manages production secrets
  - Required variables: TELEGRAM_BOT_TOKEN, SESSION_SECRET, DATABASE_PATH, FRONTEND_URL
- **Rationale:**
  - Standard development practice
  - Coolify provides secure secret management
  - No secrets in git repository
- **Affects:** Local development setup, production deployment

### API & Communication Patterns

**API Design Pattern**
- **Decision:** RESTful API with JSON responses
- **Implementation:**
  - Resource-based endpoints: `/api/expenses`, `/api/categories`
  - Standard HTTP methods: GET, POST, PUT, DELETE
  - JSON request/response bodies
  - Refresh-based frontend fetching (no WebSockets)
- **Rationale:** Already established in PRD requirements. Simple, well-understood, sufficient for use case.
- **Affects:** Frontend-backend communication, API client implementation

**API Documentation**
- **Decision:** @fastify/swagger with OpenAPI specification
- **Implementation:**
  - Auto-generated API documentation from route schemas
  - Swagger UI available at `/docs` endpoint (development only)
  - Schema validation integrated with Zod
- **Rationale:**
  - Minimal setup overhead with Fastify
  - Useful for development and testing
  - Self-documenting API
  - Helps when returning to project after breaks
- **Affects:** API development workflow, testing approach

**Error Handling Standards**
- **Decision:** Structured error responses with matching HTTP status codes
- **Implementation:**
  ```typescript
  // HTTP Status Code: 400, 404, 500, etc.
  // Response Body:
  {
    "error": {
      "code": "INVALID_CATEGORY",
      "message": "User-friendly error message"
    }
  }
  ```
- **Rationale:**
  - Consistent error format across all endpoints
  - User-friendly messages for frontend display
  - Telegram bot can send error.message in confirmations
  - HTTP status codes match response body (never 200 with error)
  - Easier debugging and error tracking
- **Affects:** All API endpoints, frontend error handling, Telegram bot responses

### Frontend Architecture

**State Management**
- **Decision:** Pinia for centralized state management
- **Implementation:**
  - Pinia stores for expenses, categories, authentication
  - Located in `frontend/src/stores/`
  - Composition API pattern
  - Vue DevTools integration for debugging
- **Rationale:**
  - Official Vue state management solution
  - Lightweight with minimal overhead
  - Excellent TypeScript support
  - DevTools provide useful debugging capabilities
  - Provides structure without excessive complexity
- **Affects:** Data flow patterns, component communication, state persistence

**Component Architecture**
- **Decision:** Hybrid organization pattern
- **Structure:**
  ```
  frontend/src/
  ├── components/          # Shared/reusable components
  │   ├── ExpenseList.vue
  │   ├── CategoryChart.vue
  │   └── MonthSelector.vue
  ├── views/               # Page-level components
  │   ├── DashboardView.vue
  │   ├── CategoriesView.vue
  │   └── ReportsView.vue
  ├── composables/         # Reusable composition functions
  │   ├── useExpenses.ts
  │   └── useCategories.ts
  ├── stores/              # Pinia stores
  │   ├── expenses.ts
  │   └── categories.ts
  └── layouts/             # Layout wrappers
      └── DefaultLayout.vue
  ```
- **Rationale:**
  - Standard Vue 3 pattern that scales well
  - Clear separation of concerns
  - Easy to locate components by purpose
  - Supports component reusability
- **Affects:** Code organization, developer navigation, component discovery

**Routing Strategy**
- **Decision:** Vue Router 4 with client-side routing
- **Implementation:**
  - Hash mode or history mode (based on Nginx configuration)
  - Route-level code splitting for performance
  - Navigation guards for authentication
- **Rationale:** Already established in starter template. Standard for Vue 3 SPAs.
- **Affects:** Navigation, lazy loading, authentication flow

### Infrastructure & Deployment

**Deployment Strategy**
- **Decision:** Coolify for automated deployment, GitHub Actions for CI
- **Implementation:**
  - **Coolify:** Auto-deploys on git push to main branch
  - **GitHub Actions CI Pipeline:**
    - TypeScript type checking (frontend + backend)
    - ESLint linting
    - Unit tests (Vitest)
    - E2E tests (Playwright)
    - Build verification
  - Pipeline runs on pull requests and main branch pushes
  - Failed checks block merge/deployment
- **Rationale:**
  - Coolify handles self-hosted deployment elegantly
  - GitHub Actions ensures quality before deployment
  - Automated testing from MVP prevents regressions
  - No external CI/CD dependencies beyond GitHub
- **Affects:** Development workflow, deployment process, code quality gates

**Testing Strategy**
- **Decision:** Comprehensive test suite from MVP phase
- **Implementation:**
  - **Backend Unit Tests:** Vitest for services, API endpoints, Telegram bot parsing
  - **Frontend Component Tests:** Vitest for Vue components
  - **E2E Tests:** Playwright for critical user flows
  - Test coverage requirements enforced in CI
- **Rationale:**
  - Testing from start ensures quality and prevents technical debt
  - Catches bugs before production deployment
  - Supports confident refactoring
  - Zero data loss tolerance (NFR23) requires robust testing
- **Affects:** Development workflow, deployment confidence, code quality

**Environment Configuration**
- **Decision:** .env files for local development, Coolify environment variables for production
- **Implementation:**
  - `.env.example` committed to git with dummy values
  - Actual `.env` files git-ignored
  - Developer copies `.env.example` to `.env` and fills real values
  - Coolify manages production environment variables via UI
  - Docker Compose uses env_file for local development
- **Rationale:**
  - Standard practice for secret management
  - Coolify provides secure, easy-to-update secret storage
  - No secrets committed to version control
- **Affects:** Local development setup, production deployment, secret management

**Logging Strategy**
- **Decision:** Pino logger with container stdout, Coolify log viewer
- **Implementation:**
  - **Backend:** Pino (Fastify default) with structured JSON logging
  - **Log levels:** error, warn, info, debug
  - **Logged events:** API requests/responses (sensitive data redacted), Telegram bot messages, database operations, authentication events
  - **Storage:** Container stdout captured by Coolify
  - **Frontend:** Console errors in development, minimal production logging
- **Rationale:**
  - Coolify provides built-in log viewing
  - No extra infrastructure needed
  - Sufficient for household-scale debugging
  - Privacy-first: no external logging services
- **Affects:** Debugging workflow, error tracking, production monitoring

**Backup Strategy**
- **Decision:** Automated daily SQLite backups with 30-day retention (local VPS only)
- **Implementation:**
  ```bash
  # Daily cron job
  sqlite3 /data/finance.db ".backup '/backups/finance-$(date +%Y%m%d).db'"
  # Cleanup old backups (keep 30 days)
  find /backups -name "finance-*.db" -mtime +30 -delete
  ```
  - Backups stored in separate volume/directory
  - Local VPS storage only (privacy-first)
- **Rationale:**
  - Zero data loss tolerance (NFR23) requires reliable backups
  - Financial data is critical and irreplaceable
  - 30-day retention provides recovery window
  - Local-only aligns with privacy-first architecture
  - Future consideration: encrypted off-site backups if needed
- **Affects:** Data durability, disaster recovery, deployment architecture

### Decision Impact Analysis

**Implementation Sequence:**

1. **Project Initialization** (First Story)
   - Execute frontend/backend setup commands
   - Configure Tailwind, TypeScript, Drizzle
   - Set up Docker and Coolify configuration
   - Create `.env.example` files

2. **Core Infrastructure** (Foundation Stories)
   - Database schema with Drizzle + Zod validation
   - Fastify server with session authentication
   - Pinia stores and frontend architecture
   - Nginx reverse proxy configuration

3. **CI/CD Pipeline** (Early Priority)
   - GitHub Actions workflow configuration
   - Test framework setup (Vitest, Playwright)
   - Backup script and cron job setup

4. **API Development** (Feature Stories)
   - RESTful endpoints with Swagger docs
   - Error handling middleware
   - Telegram bot integration

5. **Frontend Development** (Feature Stories)
   - Vue components following hybrid architecture
   - Dashboard views with Chart.js
   - Authentication flows

**Cross-Component Dependencies:**

**Zod Schemas → Multiple Components**
- Affects: API validation, database schema, Telegram bot parsing, frontend forms
- Shared types ensure consistency across stack

**Session Authentication → Frontend + Backend**
- Frontend: Session cookie handling, auth guards
- Backend: Session middleware, protected routes
- Deployment: Secure cookie configuration in Nginx

**Environment Variables → All Components**
- Local development: .env files for frontend, backend, bot
- Production: Coolify injects into all containers
- CI: GitHub Actions secrets for test environment

**Backup Strategy → Deployment**
- Requires separate volume mount for backup storage
- Cron job needs access to SQLite database file
- Coolify deployment must configure volume mounts

**Testing Strategy → Development Workflow**
- All pull requests blocked until tests pass
- Developers run tests locally before pushing
- E2E tests validate integration between all components

## Implementation Patterns & Consistency Rules

### Overview

This section defines mandatory patterns that ALL AI agents must follow when implementing features. These patterns prevent conflicts and ensure code compatibility across the entire system.

**Critical Conflict Points Identified:** 9 major areas where AI agents could make incompatible choices without clear guidance.

### Naming Patterns

**Database Naming Conventions (Drizzle + SQLite)**

All database identifiers use **snake_case**:

```typescript
// ✅ CORRECT - snake_case for database
export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  category_id: integer('category_id').notNull(),
  amount: integer('amount').notNull(),
  description: text('description'),
  expense_date: integer('expense_date', { mode: 'timestamp' }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ❌ INCORRECT - camelCase in database
export const expenses = sqliteTable('expenses', {
  userId: integer('userId'),  // WRONG
  categoryId: integer('categoryId'),  // WRONG
});
```

**Rationale:** SQL convention, database portability, clear distinction from TypeScript code.

**API Naming Conventions**

- **Endpoints:** Plural resource names with `/api` prefix
- **Parameters:** camelCase in query strings, kebab-case in URLs
- **Headers:** Standard HTTP headers only

```typescript
// ✅ CORRECT
GET  /api/expenses
GET  /api/expenses/:id
POST /api/expenses
PUT  /api/expenses/:id
GET  /api/categories

// Query parameters (camelCase)
GET /api/expenses?startDate=2026-01-01&categoryId=5

// ❌ INCORRECT
GET /api/expense  // Singular - WRONG
GET /api/Expenses  // Capitalized - WRONG
GET /api/expense-list  // Kebab-case - WRONG
```

**Rationale:** RESTful standards, consistent with industry practices, plural indicates collection.

**TypeScript Naming Conventions**

- **Variables/functions:** camelCase
- **Classes/Interfaces/Types:** PascalCase
- **Component props interfaces:** PascalCase with `Props` suffix
- **Type aliases:** PascalCase with `Type` suffix
- **Boolean variables:** `is`/`has`/`should` prefix
- **No "I" prefix for interfaces** (modern TypeScript convention)

```typescript
// ✅ CORRECT
interface User {
  id: number;
  firstName: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onSelect: (id: number) => void;
}

type UserRole = 'admin' | 'user';
type StatusType = 'pending' | 'completed';

const isLoading = true;
const hasError = false;
const shouldRefetch = false;

function getUserExpenses(userId: number) { }
class ExpenseService { }

// ❌ INCORRECT
interface IUser { }  // "I" prefix - WRONG (outdated convention)
interface userProps { }  // camelCase - WRONG
type userRole = 'admin';  // camelCase - WRONG
const loading = true;  // Not clearly boolean - WRONG
function get_user_expenses() { }  // snake_case - WRONG
```

**File Naming Conventions**

- **Vue components:** PascalCase (matches component name)
- **Composables:** camelCase with `use` prefix
- **Utilities/services:** camelCase
- **Type definition files:** PascalCase
- **Test files:** Same as source file with `.test.ts` extension

```
✅ CORRECT
frontend/src/
├── components/
│   ├── ExpenseList.vue
│   ├── ExpenseList.test.ts
│   ├── CategoryChart.vue
│   └── CategoryChart.test.ts
├── composables/
│   ├── useExpenses.ts
│   └── useExpenses.test.ts
├── services/
│   ├── expenseService.ts
│   └── expenseService.test.ts
├── types/
│   ├── Expense.ts
│   └── Category.ts

❌ INCORRECT
├── expense-list.vue  // kebab-case - WRONG
├── UseExpenses.ts  // PascalCase composable - WRONG
├── ExpenseService.ts  // PascalCase service - WRONG
├── expense.ts  // camelCase type file - WRONG
```

**Rationale:** Matches Vue 3 style guide, clear file purpose from naming, consistent across ecosystem.

### Structure Patterns

**Test File Organization**

**MANDATORY: Co-located tests** - Test files must be placed next to their source files with `.test.ts` extension.

```
✅ CORRECT - Co-located
src/components/
├── ExpenseList.vue
├── ExpenseList.test.ts
├── CategoryChart.vue
└── CategoryChart.test.ts

src/services/
├── expenseService.ts
└── expenseService.test.ts

❌ INCORRECT - Separate test directory
src/components/
├── ExpenseList.vue
└── CategoryChart.vue

tests/components/  // WRONG - Don't use separate test directory
├── ExpenseList.test.ts
└── CategoryChart.test.ts
```

**Rationale:** Easier to find tests, encourages testing during development, modern best practice.

**Shared Code Organization**

**Frontend:**
```
frontend/src/
├── types/           # Shared TypeScript interfaces and types
│   ├── Expense.ts
│   ├── Category.ts
│   └── ApiResponse.ts
├── utils/           # Pure utility functions (no side effects)
│   ├── formatCurrency.ts
│   ├── dateHelpers.ts
│   └── validators.ts
├── api/             # API client and HTTP communication
│   ├── client.ts
│   └── endpoints.ts
├── constants/       # App-wide constants and enums
│   ├── routes.ts
│   └── config.ts
├── schemas/         # Zod validation schemas (shared with backend)
│   ├── expenseSchema.ts
│   └── categorySchema.ts
```

**Backend:**
```
backend/src/
├── types/           # Shared TypeScript types
│   └── index.ts
├── utils/           # Utility functions
│   └── dateHelpers.ts
├── schemas/         # Zod validation schemas
│   ├── expenseSchema.ts
│   └── categorySchema.ts
├── middleware/      # Fastify middleware functions
│   ├── auth.ts
│   └── errorHandler.ts
├── db/              # Database schema and migrations
│   ├── schema.ts
│   └── migrations/
```

**Rationale:** Clear separation of concerns, easy to locate shared code, prevents duplication.

### Format Patterns

**API Response Formats**

**Success Responses - Direct data (no wrapper):**

```typescript
// ✅ CORRECT - Direct data
GET /api/expenses
Response: [
  { id: 1, amount: 5000, category: "food", date: "2026-01-03T10:00:00Z" },
  { id: 2, amount: 3000, category: "transport", date: "2026-01-02T15:30:00Z" }
]

POST /api/expenses
Response: { id: 3, amount: 7500, category: "dining", date: "2026-01-03T12:00:00Z" }

// ❌ INCORRECT - Wrapped in data field
Response: {
  data: [...]  // WRONG - No wrapper for success
}
```

**Error Responses - Structured format:**

```typescript
// ✅ CORRECT - Structured error with matching HTTP status
HTTP Status: 400
Response: {
  error: {
    code: "INVALID_CATEGORY",
    message: "Category 'foo' does not exist"
  }
}

HTTP Status: 404
Response: {
  error: {
    code: "EXPENSE_NOT_FOUND",
    message: "Expense with id 123 not found"
  }
}

// ❌ INCORRECT
HTTP Status: 200  // WRONG - Never return 200 with error
Response: {
  error: { ... }
}

HTTP Status: 400
Response: "Invalid category"  // WRONG - Not structured
```

**Rationale:** Simple and standard for success, consistent structured errors, HTTP status matches response.

**Date/Time Format Standards**

**Three layers with automatic conversion:**

1. **Database (SQLite):** Unix timestamps as integers
2. **TypeScript code:** Date objects
3. **API JSON:** ISO 8601 strings

```typescript
// ✅ CORRECT - Database layer (Drizzle schema)
export const expenses = sqliteTable('expenses', {
  expense_date: integer('expense_date', { mode: 'timestamp' }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
});
// Drizzle automatically converts integers ↔ Date objects

// ✅ CORRECT - TypeScript code (work with Date objects)
const expense = {
  date: new Date('2026-01-03'),
  createdAt: new Date(),
};

// ✅ CORRECT - API JSON (serialize to ISO 8601)
GET /api/expenses
Response: {
  id: 1,
  date: "2026-01-03T10:00:00Z",  // ISO 8601 string
  createdAt: "2026-01-03T08:30:00Z"
}

// ❌ INCORRECT - Unix timestamps in API JSON
Response: {
  date: 1704276000  // WRONG - Use ISO strings in JSON
}

// ❌ INCORRECT - ISO strings in database
sqliteTable('expenses', {
  date: text('date')  // WRONG - Use integers with timestamp mode
});
```

**Rationale:** Database efficiency (integers), code clarity (Date objects), API standard (ISO strings).

**JSON Field Naming**

**MANDATORY: camelCase in all API JSON** (both requests and responses)

```typescript
// ✅ CORRECT - camelCase in API JSON
Request/Response: {
  userId: 1,
  firstName: "John",
  categoryId: 5,
  createdAt: "2026-01-03T10:00:00Z"
}

// ❌ INCORRECT - snake_case in API JSON
Request/Response: {
  user_id: 1,  // WRONG
  first_name: "John",  // WRONG
  category_id: 5,  // WRONG
}
```

**Mapping between layers:**

```typescript
// Database (snake_case) → TypeScript (camelCase) → API JSON (camelCase)

// Drizzle handles DB ↔ TypeScript automatically
// Fastify/Axios handles TypeScript ↔ JSON automatically

// No manual mapping needed - use correct naming at each layer
```

**Rationale:** JavaScript/TypeScript convention, consistent with frontend code, industry standard for REST APIs.

**TypeScript Type vs Interface**

- **Interfaces:** Use for object shapes (can be extended)
- **Types:** Use for unions, intersections, primitives, and complex types

```typescript
// ✅ CORRECT - Interface for object shapes
interface User {
  id: number;
  name: string;
}

interface Expense {
  id: number;
  amount: number;
  category: string;
  date: Date;
}

// ✅ CORRECT - Type for unions, intersections, primitives
type UserRole = 'admin' | 'user';
type StatusType = 'pending' | 'completed' | 'failed';
type ID = string | number;
type UserWithRole = User & { role: UserRole };

// ❌ INCORRECT - Type for simple object (use interface)
type User = {  // WRONG - Should be interface
  id: number;
  name: string;
};

// ❌ INCORRECT - Interface for union (use type)
interface StatusType extends 'pending' | 'completed' { }  // WRONG
```

**Rationale:** TypeScript best practices, interfaces are extensible, types are more flexible.

### Communication Patterns

**State Management (Pinia)**

**Store structure pattern:**

```typescript
// ✅ CORRECT - Pinia store structure
import { defineStore } from 'pinia';

export const useExpenseStore = defineStore('expenses', {
  state: () => ({
    expenses: [] as Expense[],
    isLoadingExpenses: false,
    isSavingExpense: false,
    error: null as string | null,
  }),

  actions: {
    async fetchExpenses() {
      this.isLoadingExpenses = true;
      this.error = null;
      try {
        const data = await expenseApi.getAll();
        this.expenses = data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoadingExpenses = false;
      }
    },

    async saveExpense(expense: Expense) {
      this.isSavingExpense = true;
      this.error = null;
      try {
        const saved = await expenseApi.create(expense);
        this.expenses.push(saved);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isSavingExpense = false;
      }
    },
  },
});

// ❌ INCORRECT - Missing error handling, unclear loading states
export const useExpenseStore = defineStore('expenses', {
  state: () => ({
    expenses: [],
    loading: false,  // WRONG - Not specific enough
    // Missing error state
  }),

  actions: {
    async fetchExpenses() {
      this.loading = true;
      const data = await expenseApi.getAll();  // WRONG - No error handling
      this.expenses = data;
      this.loading = false;
    },
  },
});
```

**Loading State Naming:**
- **Boolean prefix:** `isLoading`, `isSaving`, `isDeleting`
- **Granular when multiple operations:** `isLoadingExpenses` vs `isSavingExpense`
- **Always pair with error state:** `error: string | null`

**Rationale:** Clear boolean intent, granular control, consistent error handling.

### Process Patterns

**Validation Strategy - Multi-Layer**

**MANDATORY: Validate at all boundaries**

1. **Frontend validation:** Immediate user feedback
2. **API validation:** Fastify route handlers (don't trust frontend)
3. **Database constraints:** Schema-level validation

**Shared Zod schemas pattern:**

```typescript
// ✅ CORRECT - Shared schema (frontend and backend can import)
// packages/schemas/src/expenseSchema.ts
import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  date: z.date(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

// Frontend - Validate before submit
import { expenseSchema } from '@/schemas/expenseSchema';

const validateExpense = (data: unknown) => {
  const result = expenseSchema.safeParse(data);
  if (!result.success) {
    return result.error.format();
  }
  return null;
};

// Backend - Validate in route handler
import { expenseSchema } from '@/schemas/expenseSchema';

fastify.post('/api/expenses', async (request, reply) => {
  const result = expenseSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: result.error.errors[0].message,
      },
    });
  }
  // Proceed with valid data
});

// ❌ INCORRECT - Different validation rules on frontend and backend
// Frontend
if (amount <= 0) { /* ... */ }  // WRONG - Duplicates logic

// Backend
if (!amount || amount <= 0) { /* ... */ }  // WRONG - Duplicates logic
// Should share Zod schema instead
```

**Rationale:** Single source of truth, consistent validation, type-safe, eliminates duplication.

**Error Handling - Consistent Patterns**

**Backend error handling (Fastify):**

```typescript
// ✅ CORRECT - Fastify error handler
fastify.setErrorHandler((error, request, reply) => {
  // Log error with context
  fastify.log.error({
    err: error,
    request: {
      method: request.method,
      url: request.url,
    },
  });

  // Return structured error
  reply.status(error.statusCode || 500).send({
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
    },
  });
});

// ❌ INCORRECT - Inconsistent error responses
fastify.setErrorHandler((error, request, reply) => {
  reply.send({ message: error.message });  // WRONG - Not structured
});
```

**Frontend error handling (Vue):**

```typescript
// ✅ CORRECT - Handle API errors consistently
async function loadExpenses() {
  isLoading.value = true;
  error.value = null;

  try {
    expenses.value = await expenseApi.getAll();
  } catch (err) {
    if (err.response?.data?.error) {
      // Display structured error message
      error.value = err.response.data.error.message;
    } else {
      error.value = 'Failed to load expenses';
    }
  } finally {
    isLoading.value = false;
  }
}

// ❌ INCORRECT - Generic error handling
try {
  expenses.value = await expenseApi.getAll();
} catch (err) {
  console.error(err);  // WRONG - No user feedback
}
```

**Rationale:** User-friendly errors, consistent format, proper logging, graceful degradation.

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Follow database naming:** Always use snake_case for all database identifiers (tables, columns, indexes)
2. **Follow TypeScript naming:** Always use camelCase for variables/functions, PascalCase for types/interfaces/classes
3. **Follow API conventions:** Plural endpoints (`/api/expenses`), camelCase JSON fields, direct data responses
4. **Co-locate tests:** Always place `.test.ts` files next to source files, never in separate test directories
5. **Use shared Zod schemas:** Never duplicate validation logic between frontend and backend
6. **Handle errors consistently:** Always use structured error format with matching HTTP status codes
7. **Use boolean prefixes:** Always prefix boolean variables with `is`/`has`/`should`
8. **Validate at boundaries:** Always validate user input, API requests, and database writes
9. **Follow date formats:** Database = integers, TypeScript = Date objects, API = ISO 8601 strings
10. **Use Pinia stores correctly:** Always include granular loading states and error states

**Pattern Verification:**

- **Pre-commit hooks:** ESLint enforces naming conventions
- **TypeScript compiler:** Enforces type safety and interface usage
- **Code review:** Check for pattern compliance before merge
- **CI pipeline:** Automated tests verify API response formats

**Updating Patterns:**

- Patterns can be updated through architecture document revisions
- All agents must be notified of pattern changes
- Breaking pattern changes require migration plan

### Pattern Examples

**Complete Feature Example (Following All Patterns):**

**Database Schema (snake_case):**
```typescript
export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey(),
  amount: integer('amount').notNull(),
  category_id: integer('category_id').notNull(),
  expense_date: integer('expense_date', { mode: 'timestamp' }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

**Shared Zod Schema:**
```typescript
export const expenseSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.number(),
  date: z.date(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
```

**API Endpoint (Fastify):**
```typescript
fastify.post('/api/expenses', async (request, reply) => {
  const result = expenseSchema.safeParse(request.body);
  if (!result.success) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: result.error.errors[0].message,
      },
    });
  }

  const expense = await db.insert(expenses).values(result.data);
  return reply.send(expense);  // Direct data, no wrapper
});
```

**Frontend Component (Vue):**
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useExpenseStore } from '@/stores/expenses';
import type { ExpenseInput } from '@/schemas/expenseSchema';

const expenseStore = useExpenseStore();
const isLoading = ref(false);
const error = ref<string | null>(null);

async function handleSubmit(data: ExpenseInput) {
  isLoading.value = true;
  error.value = null;

  try {
    await expenseStore.saveExpense(data);
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Failed to save';
  } finally {
    isLoading.value = false;
  }
}
</script>
```

**Pinia Store:**
```typescript
export const useExpenseStore = defineStore('expenses', {
  state: () => ({
    expenses: [] as Expense[],
    isLoadingExpenses: false,
    isSavingExpense: false,
    error: null as string | null,
  }),

  actions: {
    async saveExpense(input: ExpenseInput) {
      this.isSavingExpense = true;
      this.error = null;

      try {
        const response = await axios.post('/api/expenses', input);
        this.expenses.push(response.data);
      } catch (err) {
        this.error = err.response?.data?.error?.message;
        throw err;
      } finally {
        this.isSavingExpense = false;
      }
    },
  },
});
```

**Test File (Co-located):**
```typescript
// ExpenseList.test.ts (next to ExpenseList.vue)
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ExpenseList from './ExpenseList.vue';

describe('ExpenseList', () => {
  it('renders expenses correctly', () => {
    // Test implementation
  });
});
```

### Anti-Patterns (What to Avoid)

**❌ Mixed naming conventions:**
```typescript
// WRONG - Mixing snake_case and camelCase
interface User {
  user_id: number;  // Should be userId
  firstName: string;
}
```

**❌ Inconsistent API responses:**
```typescript
// WRONG - Sometimes wrapped, sometimes not
GET /api/expenses → { data: [...] }
GET /api/categories → [...]  // Inconsistent
```

**❌ Duplicate validation:**
```typescript
// WRONG - Different rules in frontend and backend
// Frontend
if (amount > 0 && amount < 1000000) { }

// Backend
if (amount > 0) { }  // Missing upper limit check
```

**❌ Generic loading states:**
```typescript
// WRONG - Can't tell what's loading
const loading = ref(false);

// CORRECT - Specific loading states
const isLoadingExpenses = ref(false);
const isSavingExpense = ref(false);
```

**❌ Separate test directories:**
```
// WRONG
src/components/ExpenseList.vue
tests/components/ExpenseList.test.ts  // Separated

// CORRECT
src/components/ExpenseList.vue
src/components/ExpenseList.test.ts  // Co-located
```

**❌ Unclear boolean variables:**
```typescript
// WRONG
const loading = true;
const valid = false;

// CORRECT
const isLoading = true;
const isValid = false;
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
finance-doctor/
├── README.md
├── package.json                    # Root workspace configuration
├── .gitignore
├── .env.example
├── docker-compose.yml              # Local development & production deployment
├── Dockerfile.frontend
├── Dockerfile.backend
├── Dockerfile.nginx
├── nginx.conf                      # Reverse proxy configuration
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  # TypeScript check, lint, tests, build
│       └── deploy.yml              # Coolify deployment trigger
│
├── frontend/                       # Vue 3 + TypeScript + Tailwind SPA
│   ├── README.md
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── .env.example
│   ├── .eslintrc.cjs
│   ├── index.html
│   │
│   ├── public/
│   │   └── favicon.ico
│   │
│   └── src/
│       ├── main.ts                 # Vue app entry point
│       ├── App.vue                 # Root component
│       ├── router.ts               # Vue Router configuration
│       │
│       ├── assets/                 # Static assets (images, fonts)
│       │   ├── logo.svg
│       │   └── styles/
│       │       └── tailwind.css
│       │
│       ├── components/             # Reusable Vue components
│       │   ├── ExpenseList.vue
│       │   ├── ExpenseList.test.ts
│       │   ├── ExpenseForm.vue
│       │   ├── ExpenseForm.test.ts
│       │   ├── CategoryChart.vue
│       │   ├── CategoryChart.test.ts
│       │   ├── CategoryManager.vue
│       │   ├── CategoryManager.test.ts
│       │   ├── MonthSelector.vue
│       │   ├── MonthSelector.test.ts
│       │   ├── SpendingInsights.vue
│       │   ├── SpendingInsights.test.ts
│       │   └── LoadingSpinner.vue
│       │
│       ├── views/                  # Page-level components
│       │   ├── DashboardView.vue   # FR11-FR17: Current month dashboard
│       │   ├── DashboardView.test.ts
│       │   ├── CategoriesView.vue  # FR6-FR10: Category management
│       │   ├── CategoriesView.test.ts
│       │   ├── ReportsView.vue     # FR18-FR21: Monthly reports
│       │   ├── ReportsView.test.ts
│       │   ├── LoginView.vue       # FR28-FR31: Authentication
│       │   ├── LoginView.test.ts
│       │   └── OnboardingView.vue  # FR32-FR34: Setup wizard
│       │
│       ├── layouts/                # Layout wrappers
│       │   ├── DefaultLayout.vue
│       │   └── AuthLayout.vue
│       │
│       ├── stores/                 # Pinia state management
│       │   ├── expenses.ts         # Expense state (FR1-FR5, FR22-FR27)
│       │   ├── expenses.test.ts
│       │   ├── categories.ts       # Category state (FR6-FR10)
│       │   ├── categories.test.ts
│       │   ├── auth.ts             # Auth state (FR28-FR31)
│       │   └── auth.test.ts
│       │
│       ├── composables/            # Reusable composition functions
│       │   ├── useExpenses.ts
│       │   ├── useExpenses.test.ts
│       │   ├── useCategories.ts
│       │   ├── useCategories.test.ts
│       │   └── useAuth.ts
│       │
│       ├── api/                    # API client code
│       │   ├── client.ts           # Axios instance with interceptors
│       │   ├── client.test.ts
│       │   ├── expenses.ts         # Expense endpoints
│       │   ├── categories.ts       # Category endpoints
│       │   └── auth.ts             # Auth endpoints
│       │
│       ├── schemas/                # Zod validation schemas (shared)
│       │   ├── expenseSchema.ts
│       │   ├── categorySchema.ts
│       │   └── authSchema.ts
│       │
│       ├── types/                  # TypeScript type definitions
│       │   ├── Expense.ts
│       │   ├── Category.ts
│       │   ├── User.ts
│       │   └── ApiResponse.ts
│       │
│       ├── utils/                  # Pure utility functions
│       │   ├── formatCurrency.ts
│       │   ├── formatCurrency.test.ts
│       │   ├── dateHelpers.ts
│       │   ├── dateHelpers.test.ts
│       │   └── validators.ts
│       │
│       └── constants/              # App-wide constants
│           ├── routes.ts
│           └── config.ts
│
├── backend/                        # Fastify + TypeScript + Drizzle API
│   ├── README.md
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .eslintrc.cjs
│   ├── drizzle.config.ts          # Drizzle ORM configuration
│   │
│   └── src/
│       ├── server.ts               # Fastify server entry point
│       ├── app.ts                  # Fastify app configuration
│       │
│       ├── routes/                 # API route handlers
│       │   ├── expenses.ts         # FR1-FR5, FR22-FR27: Expense CRUD
│       │   ├── expenses.test.ts
│       │   ├── categories.ts       # FR6-FR10: Category CRUD
│       │   ├── categories.test.ts
│       │   ├── reports.ts          # FR18-FR21: Monthly reports
│       │   ├── reports.test.ts
│       │   ├── auth.ts             # FR28-FR31: Authentication
│       │   ├── auth.test.ts
│       │   └── health.ts           # Health check endpoint
│       │
│       ├── services/               # Business logic layer
│       │   ├── expenseService.ts   # Expense business logic
│       │   ├── expenseService.test.ts
│       │   ├── categoryService.ts  # Category business logic
│       │   ├── categoryService.test.ts
│       │   ├── reportService.ts    # Report generation & insights
│       │   ├── reportService.test.ts
│       │   ├── authService.ts      # Authentication logic
│       │   ├── authService.test.ts
│       │   └── telegramBotService.ts  # Telegram bot handler (FR1-FR4)
│       │       └── telegramBotService.test.ts
│       │
│       ├── db/                     # Database layer (Drizzle ORM)
│       │   ├── schema.ts           # Database schema definitions
│       │   ├── index.ts            # Database connection
│       │   ├── seed.ts             # Database seeding script
│       │   └── migrations/         # Drizzle migration files
│       │       └── .gitkeep
│       │
│       ├── middleware/             # Fastify middleware
│       │   ├── auth.ts             # Session authentication middleware
│       │   ├── auth.test.ts
│       │   ├── errorHandler.ts     # Global error handler
│       │   ├── errorHandler.test.ts
│       │   └── requestLogger.ts    # Pino request logging
│       │
│       ├── plugins/                # Fastify plugins
│       │   ├── session.ts          # @fastify/session configuration
│       │   ├── swagger.ts          # @fastify/swagger configuration
│       │   ├── cors.ts             # @fastify/cors (development only)
│       │   └── helmet.ts           # @fastify/helmet security headers
│       │
│       ├── schemas/                # Zod validation schemas (shared with frontend)
│       │   ├── expenseSchema.ts
│       │   ├── categorySchema.ts
│       │   └── authSchema.ts
│       │
│       ├── types/                  # TypeScript type definitions
│       │   ├── index.ts
│       │   └── fastify.d.ts        # Fastify type augmentations
│       │
│       └── utils/                  # Utility functions
│           ├── dateHelpers.ts
│           ├── dateHelpers.test.ts
│           ├── parseExpenseMessage.ts  # Telegram message parser
│           ├── parseExpenseMessage.test.ts
│           └── logger.ts           # Pino logger configuration
│
├── scripts/                        # Deployment & maintenance scripts
│   ├── backup.sh                   # SQLite backup cron script
│   ├── restore.sh                  # Database restore script
│   └── init-db.sh                  # Database initialization
│
└── docs/                           # Project documentation
    ├── architecture.md             # This document (symlinked)
    ├── api.md                      # API documentation
    └── deployment.md               # Deployment guide
```

### Architectural Boundaries

**API Boundaries**

**External API Boundary:**
- **Endpoint Prefix:** `/api/*`
- **Authentication:** Session-based auth (HttpOnly cookies)
- **Format:** JSON (camelCase fields)
- **Served via:** Nginx reverse proxy (same domain as frontend)

**API Routes:**
```typescript
// Expense Management (FR1-FR5, FR22-FR27)
GET    /api/expenses                # List expenses (with date filters)
GET    /api/expenses/:id            # Get single expense
POST   /api/expenses                # Create expense
PUT    /api/expenses/:id            # Update expense
DELETE /api/expenses/:id            # Delete expense

// Category Management (FR6-FR10)
GET    /api/categories              # List all categories
GET    /api/categories/:id          # Get single category
POST   /api/categories              # Create category
PUT    /api/categories/:id          # Update category
DELETE /api/categories/:id          # Delete category

// Reports & Insights (FR18-FR21)
GET    /api/reports/monthly/:year/:month  # Monthly summary
GET    /api/reports/insights               # Spending insights

// Authentication (FR28-FR31)
POST   /api/auth/login              # Login
POST   /api/auth/logout             # Logout
GET    /api/auth/session            # Check session

// Onboarding (FR32-FR34)
POST   /api/onboarding/categories   # Initial category setup
GET    /api/onboarding/status       # Onboarding completion status

// Health
GET    /api/health                  # Health check
```

**Component Boundaries**

**Frontend Component Communication:**
- **Views ↔ Stores:** Views consume Pinia stores, trigger actions
- **Components ↔ Stores:** Components read state, emit events to parent
- **Components ↔ Components:** Props down, events up (Vue standard)
- **Stores ↔ API:** Stores call API clients, handle loading/error states

**Component Hierarchy:**
```
App.vue
└── DefaultLayout.vue
    ├── DashboardView.vue              # FR11-FR17
    │   ├── MonthSelector.vue
    │   ├── ExpenseList.vue
    │   └── CategoryChart.vue
    ├── CategoriesView.vue             # FR6-FR10
    │   └── CategoryManager.vue
    ├── ReportsView.vue                # FR18-FR21
    │   └── SpendingInsights.vue
    └── OnboardingView.vue             # FR32-FR34
```

**Service Boundaries**

**Backend Service Layer:**
- **Routes → Services:** Route handlers delegate business logic to services
- **Services → Database:** Services use Drizzle ORM for data access
- **Services ↔ Services:** Service-to-service calls for cross-cutting features
- **Telegram Bot → Services:** Bot service calls expense/category services

**Service Dependencies:**
```
telegramBotService → expenseService → database
authService → database
expenseService → categoryService (validation)
reportService → expenseService + categoryService (aggregation)
```

**Data Boundaries**

**Database Access Pattern:**
- **Single SQLite database:** `finance.db`
- **ORM Layer:** Drizzle ORM (type-safe)
- **Schema Location:** `backend/src/db/schema.ts`
- **Migration Tool:** drizzle-kit
- **Access Control:** Services only (routes never access DB directly)

**Data Flow:**
```
Telegram Bot Input → telegramBotService → expenseService → Drizzle → SQLite
Frontend Form → API → Route → Service → Drizzle → SQLite
Dashboard Load → API → Service → Drizzle → SQLite → Service → API → Frontend
```

**Caching Boundary:**
- No caching layer (per architectural decision)
- Fresh data queries on every request

### Requirements to Structure Mapping

**Feature/FR Category Mapping:**

**1. Expense Tracking & Entry (FR1-FR5)**
- **Backend:**
  - `backend/src/services/telegramBotService.ts` - Telegram bot handler (FR1-FR4)
  - `backend/src/utils/parseExpenseMessage.ts` - Natural language parsing
  - `backend/src/routes/expenses.ts` - Expense API endpoints (FR5)
  - `backend/src/services/expenseService.ts` - Business logic
- **Frontend:**
  - `frontend/src/components/ExpenseForm.vue` - Manual expense entry (FR5)
  - `frontend/src/stores/expenses.ts` - Expense state management
- **Database:**
  - `backend/src/db/schema.ts` - `expenses` table

**2. Category Management (FR6-FR10)**
- **Backend:**
  - `backend/src/routes/categories.ts` - Category CRUD endpoints
  - `backend/src/services/categoryService.ts` - Category business logic
- **Frontend:**
  - `frontend/src/views/CategoriesView.vue` - Category management page
  - `frontend/src/components/CategoryManager.vue` - CRUD component
  - `frontend/src/stores/categories.ts` - Category state
- **Database:**
  - `backend/src/db/schema.ts` - `categories` table

**3. Dashboard & Spending Visualization (FR11-FR17)**
- **Frontend:**
  - `frontend/src/views/DashboardView.vue` - Main dashboard (FR11, FR12)
  - `frontend/src/components/ExpenseList.vue` - Expense list display (FR13)
  - `frontend/src/components/CategoryChart.vue` - Spending charts (FR14, FR15)
  - `frontend/src/components/MonthSelector.vue` - Month navigation (FR16, FR17)
- **Backend:**
  - Uses existing expense/category APIs
- **Responsive:** Tailwind CSS breakpoints for mobile/desktop

**4. Monthly Reporting & Insights (FR18-FR21)**
- **Backend:**
  - `backend/src/routes/reports.ts` - Report generation endpoints
  - `backend/src/services/reportService.ts` - Aggregation & insights logic
- **Frontend:**
  - `frontend/src/views/ReportsView.vue` - Reports page
  - `frontend/src/components/SpendingInsights.vue` - Insight display
- **Integration:** Backend aggregates data from expenses/categories

**5. Data Management & Retrieval (FR22-FR27)**
- **Backend:**
  - `backend/src/services/expenseService.ts` - Persistence & retrieval (FR22, FR23)
  - `backend/src/db/` - Drizzle ORM migrations (FR24)
  - API date-range filtering (FR25, FR26, FR27)
- **Database:**
  - Indexes on `expense_date`, `category_id` for performance
  - Lazy loading support in API

**6. User Access & Authentication (FR28-FR31)**
- **Backend:**
  - `backend/src/routes/auth.ts` - Login/logout endpoints
  - `backend/src/services/authService.ts` - Auth logic
  - `backend/src/middleware/auth.ts` - Session verification
  - `backend/src/plugins/session.ts` - @fastify/session setup
- **Frontend:**
  - `frontend/src/views/LoginView.vue` - Login page
  - `frontend/src/stores/auth.ts` - Auth state
  - `frontend/src/router.ts` - Navigation guards
- **Sessions:** Shared household login, server-side sessions

**7. Onboarding & Setup (FR32-FR34)**
- **Frontend:**
  - `frontend/src/views/OnboardingView.vue` - Setup wizard
- **Backend:**
  - `backend/src/routes/onboarding.ts` - Setup endpoints
- **Flow:** Initial category creation + Telegram connection guidance

### Cross-Cutting Concerns Mapping

**Authentication & Authorization:**
- **Backend:** `backend/src/middleware/auth.ts` - Protects all API routes except `/api/auth/login`
- **Frontend:** `frontend/src/router.ts` - Navigation guards redirect to login
- **Integration:** Session cookies passed automatically with every API request

**Error Handling:**
- **Backend:** `backend/src/middleware/errorHandler.ts` - Global Fastify error handler
- **Frontend:** API client interceptors + per-component error states
- **Format:** Structured error responses (per implementation patterns)

**Validation:**
- **Shared:** `frontend/src/schemas/` + `backend/src/schemas/` - Zod schemas
- **Frontend:** Form validation before submit
- **Backend:** Route-level validation with Zod
- **Database:** Schema constraints (NOT NULL, UNIQUE, foreign keys)

**Logging:**
- **Backend:** `backend/src/utils/logger.ts` - Pino logger configuration
- **Middleware:** `backend/src/middleware/requestLogger.ts` - Request/response logging
- **Format:** Structured JSON logs to stdout (captured by Coolify)

### Integration Points

**Internal Communication:**

**Frontend → Backend (REST API):**
```typescript
// Frontend API client (axios)
frontend/src/api/client.ts → HTTP requests → Nginx :80/api/* → Fastify :3000

// With session cookies
Axios instance includes withCredentials: true
Backend @fastify/session verifies session
```

**Telegram Bot → Backend:**
```typescript
// Telegram webhook or polling
Telegram API → backend/src/services/telegramBotService.ts
  → parseExpenseMessage() → expenseService.createExpense()
  → Response sent back to Telegram user
```

**Services → Database:**
```typescript
// Drizzle ORM type-safe queries
backend/src/services/*.ts → Drizzle ORM → SQLite (finance.db)

// Example:
await db.select().from(expenses).where(eq(expenses.id, id));
```

**External Integrations:**

**Telegram Bot API:**
- **Service:** `backend/src/services/telegramBotService.ts`
- **Library:** `node-telegram-bot-api`
- **Configuration:** `TELEGRAM_BOT_TOKEN` env variable
- **Communication:** Webhook (production) or polling (development)

**Data Flow:**

**Expense Entry via Telegram (FR1-FR4):**
```
User sends message to Telegram
  → Telegram Bot API
  → backend/src/services/telegramBotService.ts
  → parseExpenseMessage() (natural language parsing)
  → expenseService.createExpense()
  → Zod schema validation
  → Drizzle ORM insert into expenses table
  → SQLite database write
  → Confirmation message sent to Telegram user
```

**Dashboard Load (FR11-FR17):**
```
User opens dashboard
  → frontend/src/views/DashboardView.vue
  → useExpenseStore().fetchExpenses()
  → axios.get('/api/expenses?month=2026-01')
  → Nginx → Fastify route handler
  → expenseService.getExpensesByMonth()
  → Drizzle ORM select with date filter
  → SQLite database read
  → JSON response (ISO dates, camelCase)
  → Pinia store updates state
  → Vue components re-render with data
```

**Monthly Report Generation (FR18-FR21):**
```
User requests monthly report
  → frontend/src/views/ReportsView.vue
  → axios.get('/api/reports/monthly/2026/01')
  → Fastify route handler
  → reportService.generateMonthlyReport()
  → expenseService.getExpensesByMonth()
  → categoryService.getAllCategories()
  → Aggregation logic (totals, category breakdowns, insights)
  → Pattern detection for spending insights
  → JSON response with summary + insights
  → Frontend renders charts and insights
```

### File Organization Patterns

**Configuration Files:**

**Root Level:**
- `package.json` - Workspace configuration with frontend/backend as workspaces
- `.gitignore` - Excludes node_modules, .env, dist, build artifacts
- `.env.example` - Template for all required environment variables
- `docker-compose.yml` - Multi-container orchestration (frontend, backend, nginx)

**Frontend:**
- `vite.config.ts` - Vite build configuration, proxy for development
- `tailwind.config.js` - Tailwind CSS theme and plugin configuration
- `tsconfig.json` - TypeScript compiler options (strict mode)
- `.eslintrc.cjs` - ESLint rules for Vue 3 + TypeScript

**Backend:**
- `drizzle.config.ts` - Drizzle ORM connection and migration configuration
- `tsconfig.json` - TypeScript compiler options (strict mode, ES modules)
- `.eslintrc.cjs` - ESLint rules for Node.js + TypeScript

**Source Organization:**

**Frontend Component Organization:**
```
src/
├── components/      # Reusable UI components (leaf nodes)
├── views/           # Page-level components (route targets)
├── layouts/         # Wrapper components (DefaultLayout, AuthLayout)
├── stores/          # Pinia stores (domain-organized: expenses, categories, auth)
├── composables/     # Reusable composition functions (useExpenses, useCategories)
├── api/             # HTTP clients organized by resource
└── router.ts        # Route definitions with lazy loading
```

**Backend Service Organization:**
```
src/
├── routes/          # Fastify route handlers (thin, delegate to services)
├── services/        # Business logic (thick, domain logic lives here)
├── db/              # Database schema and connection
├── middleware/      # Cross-cutting request/response processing
├── plugins/         # Fastify plugin configurations
└── server.ts        # Entry point, server initialization
```

**Test Organization:**

**Co-located Tests (Following Implementation Pattern):**
```
src/components/
├── ExpenseList.vue
├── ExpenseList.test.ts    # Component tests next to source
├── CategoryChart.vue
└── CategoryChart.test.ts

src/services/
├── expenseService.ts
└── expenseService.test.ts  # Unit tests next to source
```

**E2E Tests (Playwright):**
```
frontend/tests/e2e/
├── expense-entry.spec.ts
├── category-management.spec.ts
└── dashboard.spec.ts
```

**Asset Organization:**

**Frontend Static Assets:**
```
frontend/public/
└── favicon.ico      # Served directly at /favicon.ico

frontend/src/assets/
├── logo.svg         # Imported in components, bundled by Vite
└── styles/
    └── tailwind.css # Tailwind directives
```

**Backend Assets:**
- No static assets (API only)
- SQLite database file: Stored outside source tree (Docker volume mount)

### Development Workflow Integration

**Development Server Structure:**

**Frontend Development:**
```bash
cd frontend
npm run dev  # Vite dev server on localhost:5173

# Vite config proxies /api/* to backend:3000
# Hot module replacement for instant updates
```

**Backend Development:**
```bash
cd backend
npm run dev  # tsx watch mode, auto-restart on changes

# Listens on localhost:3000
# Pino logs to stdout
```

**Concurrent Development:**
```bash
# From root
npm run dev  # Runs both frontend + backend concurrently
```

**Build Process Structure:**

**Frontend Build:**
```bash
npm run build
# Vite builds to frontend/dist/
# Static HTML, CSS, JS bundles
# Assets hashed for cache busting
```

**Backend Build:**
```bash
npm run build
# TypeScript compiles to backend/dist/
# ES modules output
# No bundling (Node.js can require directly)
```

**Deployment Structure:**

**Docker Multi-Stage Builds:**

**Frontend Dockerfile:**
```dockerfile
# Build stage: npm install + vite build
# Production stage: Nginx serves frontend/dist/
```

**Backend Dockerfile:**
```dockerfile
# Build stage: npm install + tsc build
# Production stage: Node.js runs backend/dist/server.js
```

**Nginx Configuration:**
```nginx
# Serves frontend static files at /
# Proxies /api/* to backend:3000
# Single domain, no CORS needed
```

**Coolify Deployment:**
- Git push to main → Coolify detects changes
- Builds Docker images
- Pulls environment variables from Coolify UI
- Starts containers with docker-compose
- Nginx routes traffic appropriately
- SQLite database persists on mounted volume

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

All architectural decisions work together seamlessly without conflicts:

- **Technology Stack Compatibility:** Vue 3 + Vite + Tailwind (frontend), Fastify + Drizzle ORM + SQLite (backend) are all designed for modern JavaScript/TypeScript development. All versions are compatible (TypeScript 5.x across the stack, Node.js 20+).
- **Monorepo Structure:** Custom monorepo with frontend/backend separation supports independent development while sharing validation schemas and type definitions.
- **Database + ORM:** Drizzle ORM with better-sqlite3 driver is optimized for local SQLite databases, matching our privacy-first architecture.
- **Docker Containerization:** All components (frontend Nginx, backend Node.js, SQLite volume) integrate smoothly in Docker Compose for both local development and Coolify deployment.
- **Authentication Flow:** Session-based auth with @fastify/session + HttpOnly cookies works perfectly with same-domain deployment via Nginx reverse proxy (no CORS complexity).
- **Testing Tools:** Vitest integrates natively with Vite (frontend) and can test backend TypeScript. Playwright E2E tests work across the full stack.
- **CI/CD Pipeline:** GitHub Actions (CI) + Coolify (CD) workflow allows quality gates before automated deployment.

**No Conflicting Decisions Found:** All technology choices, deployment strategies, and development practices align with each other and the privacy-first, local-first architecture.

**Pattern Consistency:**

All implementation patterns support architectural decisions:

- **Naming Conventions:** snake_case (DB) → camelCase (TypeScript) → camelCase (API JSON) with clear layer boundaries. Drizzle ORM handles DB-to-TypeScript mapping automatically.
- **Validation Strategy:** Multi-layer validation with shared Zod schemas prevents conflicts between frontend and backend validation rules. Single source of truth for all validation.
- **Error Handling:** Structured error format with matching HTTP status codes ensures consistent error communication from backend → frontend → user display.
- **State Management:** Pinia store pattern with granular loading states (`isLoadingExpenses`, `isSavingExpense`) and error states matches the error handling strategy.
- **Date/Time Handling:** Three-layer approach (DB integers → Date objects → ISO strings) with automatic conversion at each boundary prevents date format conflicts.
- **Test Organization:** Co-located tests support the development workflow and integrate with CI pipeline.
- **API Response Format:** Direct data responses (no wrapper) aligns with REST best practices and simplifies frontend consumption.

**All Patterns Support Each Other:** No conflicting conventions or approaches found across the architecture.

**Structure Alignment:**

Project structure fully supports all architectural decisions:

- **Monorepo Organization:** Root workspace with frontend/backend enables shared schemas while maintaining proper separation.
- **Frontend Structure:** Hybrid organization (components, views, layouts, stores, composables) supports Vue 3 Composition API patterns and Pinia state management.
- **Backend Structure:** Route → Service → Database layering supports business logic separation and testability.
- **Shared Code:** `schemas/` directories in both frontend and backend enable Zod schema sharing for consistent validation.
- **Test Structure:** Co-located tests (`.test.ts` next to source) align with modern best practices and make tests easy to find.
- **Docker Structure:** Multi-stage Dockerfiles + docker-compose.yml support both local development and production deployment.
- **Configuration Files:** Environment-based configuration (.env local, Coolify production) aligns with deployment strategy.

**Structure Enables All Decisions:** The directory tree directly supports technology choices, patterns, and deployment architecture.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

All 34 functional requirements across 7 categories are fully supported by architectural decisions:

**1. Expense Tracking & Entry (FR1-FR5): FULLY COVERED**
- FR1-FR4 (Telegram bot entry): `backend/src/services/telegramBotService.ts` + `node-telegram-bot-api` + natural language parser
- FR5 (Manual web entry): `frontend/src/components/ExpenseForm.vue` + `/api/expenses` POST endpoint
- Architecture: Shared `expenseService` handles both input channels, Zod validation ensures data consistency

**2. Category Management (FR6-FR10): FULLY COVERED**
- Category CRUD: `/api/categories` endpoints + `categoryService` + `categories` table
- Frontend: `CategoriesView.vue` + `CategoryManager.vue` + Pinia store
- Architecture: Foreign key constraints enforce category-expense relationships

**3. Dashboard & Spending Visualization (FR11-FR17): FULLY COVERED**
- FR11-FR12 (Current month view): `DashboardView.vue` + `/api/expenses` with date filters
- FR13 (Expense list): `ExpenseList.vue` component
- FR14-FR15 (Category charts): `CategoryChart.vue` + Chart.js integration
- FR16-FR17 (Historical data): `MonthSelector.vue` + lazy loading API support
- Architecture: Tailwind CSS provides responsive design, SQLite indexes optimize queries

**4. Monthly Reporting & Insights (FR18-FR21): FULLY COVERED**
- Report generation: `/api/reports/monthly/:year/:month` endpoint + `reportService`
- Insights: Pattern detection logic in `reportService` + `/api/reports/insights`
- Frontend: `ReportsView.vue` + `SpendingInsights.vue`
- Architecture: Service layer aggregates data from expenses/categories for analysis

**5. Data Management & Retrieval (FR22-FR27): FULLY COVERED**
- FR22-FR23 (Persistence): SQLite database + Drizzle ORM + automated backups (30-day retention)
- FR24 (12-month history): Database design supports unlimited historical data with date indexing
- FR25-FR27 (Date filtering): API query parameters + efficient date-range queries
- Architecture: Lazy loading minimizes initial load, indexes optimize historical queries

**6. User Access & Authentication (FR28-FR31): FULLY COVERED**
- FR28 (Web access): Vue SPA with responsive Tailwind design
- FR29 (Authentication): Session-based auth + @fastify/session + HttpOnly cookies
- FR30 (Multi-device): Server-side sessions support concurrent access
- FR31 (Shared access): Single household login credential
- Architecture: Nginx same-domain deployment eliminates CORS, sessions secured with cookies

**7. Onboarding & Setup (FR32-FR34): FULLY COVERED**
- Initial setup: `OnboardingView.vue` + `/api/onboarding` endpoints
- Category creation: Uses existing category management system
- Telegram connection: Guided instructions for bot token setup
- Architecture: Onboarding flow integrated into main application

**Non-Functional Requirements Coverage:**

All 37 non-functional requirements are architecturally supported:

**Performance Requirements (NFR1-NFR9): FULLY ADDRESSED**
- NFR1-NFR2 (Bot latency <10s): Node.js async processing + efficient SQLite writes
- NFR3-NFR4 (Dashboard load <2s): Vite optimized bundles + lazy loading + database indexes
- NFR5 (Historical load <3s): Indexed queries + pagination support
- NFR6 (Chart render <500ms): Chart.js optimized rendering + efficient data fetching
- NFR7-NFR9 (1,500 entries): SQLite with indexes handles scale efficiently, no caching needed
- Architecture: Database indexing on `expense_date` and `category_id` ensures fast queries

**Security & Privacy Requirements (NFR10-NFR19): FULLY ADDRESSED**
- NFR10-NFR12 (Local-first, no cloud): Self-hosted VPS + SQLite local database + no external services
- NFR13-NFR14 (Authentication): Session-based auth + HttpOnly cookies + @fastify/helmet security headers
- NFR15-NFR16 (Telegram security): Bot token in environment variables + no token in frontend
- NFR17-NFR19 (Privacy): No analytics, no tracking, minimal browser storage (session cookies only)
- Architecture: Privacy-first decisions throughout (local deployment, no third-party dependencies)

**Reliability Requirements (NFR20-NFR28): FULLY ADDRESSED**
- NFR20 (Bot uptime 99%): Robust error handling + Telegram API reliability
- NFR21-NFR23 (Zero data loss): SQLite ACID properties + automated daily backups (30-day retention)
- NFR24-NFR25 (Error recovery): Structured error responses + user-friendly messages
- NFR26-NFR28 (Graceful errors): Global error handler + frontend error states
- Architecture: Comprehensive testing from MVP (Vitest + Playwright) + CI quality gates

**Integration Requirements (NFR29-NFR37): FULLY ADDRESSED**
- NFR29-NFR32 (Telegram integration): `node-telegram-bot-api` + natural language parsing
- NFR33-NFR34 (Shared backend): Fastify serves both Telegram bot and Vue app
- NFR35 (Single database): SQLite accessed by all services via Drizzle ORM
- NFR36-NFR37 (Modern browsers): Vue 3 + Vite + ES modules target evergreen browsers
- Architecture: Unified backend eliminates data synchronization complexity

**Coverage Summary:** All 71 requirements (34 FRs + 37 NFRs) have explicit architectural support with no gaps.

### Implementation Readiness Validation ✅

**Decision Completeness:**

All critical architectural decisions are documented with specific versions and implementation details:

- **Technology Stack:** Exact versions specified (TypeScript 5.x, Node.js 20+, Vue 3.x, Vite 6.x, Fastify 5.x, Drizzle ORM, Tailwind 3.x)
- **Starter Commands:** Complete initialization commands provided for frontend and backend setup
- **Database Design:** Drizzle ORM with better-sqlite3, schema patterns documented with code examples
- **Authentication:** Session-based approach with @fastify/session, HttpOnly cookies, Nginx same-domain deployment
- **Validation:** Zod schemas shared between frontend/backend, multi-layer validation at all boundaries
- **Error Handling:** Structured format with HTTP status code matching, user-friendly messages
- **State Management:** Pinia stores with granular loading states and error handling patterns
- **Testing:** Vitest (unit/component), Playwright (E2E), co-located test organization
- **CI/CD:** GitHub Actions for quality gates + Coolify for automated deployment
- **Backup:** Daily automated SQLite backups with 30-day retention, local VPS storage
- **Logging:** Pino structured JSON logs to container stdout, Coolify log viewer
- **Environment:** .env local development + Coolify environment variables production

**No Missing Decisions:** Every architectural decision point has been addressed with clear direction.

**Structure Completeness:**

Project structure is comprehensive and implementation-ready:

- **Complete Directory Tree:** 200+ line directory structure with all files and directories defined
- **All API Endpoints Mapped:** 20+ REST endpoints documented with HTTP methods
- **Component Hierarchy Defined:** Vue component relationships clearly specified
- **Service Dependencies Documented:** Backend service-to-service communication mapped
- **Requirements-to-File Mapping:** All 34 FRs mapped to specific files and directories
- **Cross-Cutting Concerns Mapped:** Auth, validation, error handling, logging locations specified
- **Test Organization Complete:** Co-located test files specified for all components and services
- **Docker Configuration:** Multi-stage Dockerfiles + docker-compose.yml + Nginx config defined
- **Configuration Files:** All required config files listed with purposes

**Structure is Specific, Not Generic:** No placeholder directories—every location has a clear purpose.

**Pattern Completeness:**

Implementation patterns provide comprehensive guidance for AI agents:

- **9 Major Conflict Points Addressed:** Database naming, API conventions, TypeScript naming, file naming, test organization, shared code, date formats, type vs interface, loading states
- **Code Examples Provided:** Every pattern includes ✅ CORRECT and ❌ INCORRECT examples
- **Complete Feature Example:** End-to-end example showing all patterns working together (database → API → frontend)
- **Anti-Patterns Documented:** Clear examples of what NOT to do
- **Enforcement Guidelines:** 10 mandatory rules that all AI agents MUST follow
- **Layer Boundaries Defined:** Clear separation between database, TypeScript, and API naming conventions
- **Validation Pattern:** Shared Zod schemas with frontend/backend usage examples
- **Error Handling Pattern:** Backend error handler + frontend error state examples
- **Store Pattern:** Complete Pinia store structure with loading/error states

**All Potential Conflicts Prevented:** Patterns ensure AI agents make consistent choices across the codebase.

### Gap Analysis Results

**Critical Gaps: ZERO**

No critical gaps found that would block implementation or cause system failures.

**Important Gaps: ZERO**

No important gaps found that would significantly impact architecture quality.

**Minor Suggestions for Future Enhancement:**

1. **Off-Site Backups (Deferred):** Current architecture supports local VPS backups only. Future enhancement could add encrypted off-site backup storage for additional disaster recovery. This is intentionally deferred to maintain MVP simplicity and privacy-first focus.

2. **Advanced Monitoring (Deferred):** Current logging relies on Pino + Coolify log viewer, which is sufficient for household-scale use. Future enhancement could add structured monitoring/alerting if needed. Intentionally kept simple for MVP.

3. **Caching Layer (Not Needed):** Explicitly decided against caching for MVP due to small data scale (1,500 entries). SQLite with indexes is fast enough. Can revisit if performance issues arise (unlikely).

4. **Rate Limiting (Not Needed):** Explicitly excluded for household-scale known users. Can add if access patterns change.

5. **Real-Time Updates (Explicitly Excluded):** PRD specifies refresh-based updates to avoid complexity. No gap, just confirming intentional architectural simplification.

**Gap Analysis Summary:** Zero critical or important gaps. All minor items are intentional deferrals or explicitly excluded features. Architecture is complete for implementation.

### Validation Issues Addressed

**Pre-Validation Issue Review:**

During architectural decision-making, several potential issues were identified and resolved:

**Issue 1: Potential Naming Convention Conflicts**
- **Problem:** AI agents could use inconsistent naming (camelCase vs snake_case) across database and TypeScript layers
- **Resolution:** Established clear layer-specific naming rules: snake_case (database), camelCase (TypeScript variables), PascalCase (types/components), camelCase (API JSON)
- **Status:** ✅ RESOLVED - Comprehensive naming patterns documented with examples

**Issue 2: Validation Duplication Risk**
- **Problem:** Frontend and backend could implement different validation rules, causing inconsistency
- **Resolution:** Shared Zod schemas between frontend and backend, validated at all boundaries
- **Status:** ✅ RESOLVED - Single source of truth for validation rules

**Issue 3: Error Response Inconsistency**
- **Problem:** Different endpoints could return errors in different formats
- **Resolution:** Standardized error response structure with HTTP status code matching enforced via global error handler
- **Status:** ✅ RESOLVED - Structured error format with code examples

**Issue 4: Date Format Confusion**
- **Problem:** Mixing Unix timestamps, Date objects, and ISO strings could cause conversion errors
- **Resolution:** Three-layer standard (DB: integers, TypeScript: Date, API: ISO 8601) with automatic conversion at boundaries
- **Status:** ✅ RESOLVED - Clear date handling pattern at each layer

**Issue 5: Loading State Ambiguity**
- **Problem:** Generic `loading` boolean can't distinguish between multiple concurrent operations
- **Resolution:** Granular loading states with boolean prefixes (`isLoadingExpenses`, `isSavingExpense`)
- **Status:** ✅ RESOLVED - Pattern documented in Pinia store examples

**Issue 6: Test Organization Inconsistency**
- **Problem:** AI agents could place tests in separate directories vs co-located
- **Resolution:** Mandatory co-located test pattern with `.test.ts` extension
- **Status:** ✅ RESOLVED - Clear structure pattern with examples

**Issue 7: API Response Format Variation**
- **Problem:** Endpoints could wrap data differently (direct vs `{ data: ... }`)
- **Resolution:** Standardized on direct data responses for success, structured `{ error: {...} }` for failures
- **Status:** ✅ RESOLVED - Clear API response pattern with examples

**All Issues Resolved:** No outstanding validation concerns. Architecture is coherent and ready for implementation.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (71 requirements documented)
- [x] Scale and complexity assessed (household-scale, 2 users, 1,500 entries)
- [x] Technical constraints identified (privacy-first, local-first, no cloud)
- [x] Cross-cutting concerns mapped (auth, validation, error handling, logging, backups)

**✅ Starter Template Evaluation**
- [x] Primary technology domain identified (full-stack JavaScript/TypeScript web app)
- [x] Technical preferences discovered and documented (Vue 3, Fastify, SQLite, Tailwind)
- [x] Starter options researched with current versions (Vite, Drizzle ORM)
- [x] Custom monorepo approach selected with clear rationale
- [x] Initialization commands provided for frontend and backend

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions (Zod, session auth, structured errors, backups)
- [x] Technology stack fully specified (TypeScript 5.x, Node.js 20+, Vue 3.x, Fastify 5.x)
- [x] Integration patterns defined (REST API, Telegram bot, SQLite database)
- [x] Performance considerations addressed (indexes, lazy loading, no caching needed)
- [x] Security architecture complete (sessions, HttpOnly cookies, Nginx same-domain)
- [x] Testing strategy established (Vitest, Playwright, from MVP phase)
- [x] CI/CD pipeline defined (GitHub Actions + Coolify)

**✅ Implementation Patterns**
- [x] Naming conventions established (database snake_case, TypeScript camelCase, PascalCase types)
- [x] Structure patterns defined (co-located tests, hybrid component organization)
- [x] Format patterns specified (API responses, date/time, JSON fields)
- [x] Communication patterns documented (Pinia stores with granular states)
- [x] Process patterns complete (validation, error handling)
- [x] Code examples provided (✅ CORRECT and ❌ INCORRECT for all patterns)
- [x] Anti-patterns documented (what to avoid)
- [x] Enforcement guidelines specified (10 mandatory rules)

**✅ Project Structure**
- [x] Complete directory structure defined (200+ lines, all files specified)
- [x] Component boundaries established (frontend components, backend services)
- [x] Integration points mapped (API endpoints, Telegram bot, database)
- [x] Requirements to structure mapping complete (all 34 FRs → specific files)
- [x] Cross-cutting concerns mapped to locations (auth middleware, error handlers)
- [x] Development workflow integrated (Vite dev server, tsx watch, Docker Compose)

**✅ Architecture Validation**
- [x] Coherence validated (all decisions compatible, patterns consistent, structure aligned)
- [x] Requirements coverage verified (71/71 requirements architecturally supported)
- [x] Implementation readiness confirmed (complete decisions, structure, patterns)
- [x] Gap analysis performed (zero critical or important gaps)
- [x] All validation issues addressed and resolved

### Architecture Readiness Assessment

**Overall Status:** ✅ **READY FOR IMPLEMENTATION**

**Confidence Level:** **HIGH**

This architecture has been designed collaboratively through step-by-step discovery, ensuring all decisions align with project requirements and constraints. Every component, pattern, and structure has been carefully considered to prevent AI agent conflicts during implementation.

**Key Strengths:**

1. **Privacy-First by Design:** Local-first architecture with SQLite, self-hosted VPS, no third-party dependencies, no cloud storage. Every decision reinforces privacy.

2. **Type-Safe Throughout:** TypeScript 5.x across frontend and backend, Drizzle ORM for database type safety, Zod for runtime validation. Type errors caught at compile time.

3. **Comprehensive Patterns:** 9 major conflict points identified and resolved with clear patterns. ✅/❌ examples for every decision point ensure AI agents make consistent choices.

4. **Testing from MVP:** Vitest (unit/component) + Playwright (E2E) + CI pipeline with quality gates ensures code quality from day one. Zero data loss tolerance requires robust testing.

5. **Simple Yet Complete:** Appropriate complexity for household-scale use. No over-engineering (no caching, no rate limiting), but comprehensive where needed (validation, backups, error handling).

6. **Modern Stack:** Vue 3 Composition API, Vite 6.x, Fastify 5.x, Drizzle ORM—all cutting-edge, well-maintained tools designed for TypeScript and modern development.

7. **Clear Structure:** Monorepo with frontend/backend separation, co-located tests, hybrid component organization. Every file has a clear location and purpose.

8. **Deployment Ready:** Docker multi-stage builds + docker-compose + Nginx + Coolify automation. Production deployment path is clear from the start.

9. **Developer Experience:** Hot reload (Vite HMR + tsx watch), TypeScript strict mode, ESLint, Swagger API docs, Pinia DevTools. Great development workflow.

10. **Resilient:** Automated backups (30-day retention), structured error handling, session-based auth, ACID database transactions. Zero data loss tolerance architecturally supported.

**Areas for Future Enhancement:**

These are intentional deferrals to maintain MVP simplicity, not architectural gaps:

1. **Off-Site Backups:** Local VPS backups sufficient for MVP. Future enhancement: encrypted off-site storage for additional disaster recovery.

2. **Advanced Monitoring:** Pino logs + Coolify log viewer sufficient for household scale. Future enhancement: structured monitoring/alerting if usage patterns change.

3. **Performance Optimization:** SQLite with indexes handles 1,500 entries efficiently. Future enhancement: in-memory category caching if queries become slow (unlikely).

4. **Real-Time Updates:** Refresh-based UI per PRD requirements. Future enhancement: WebSocket real-time sync if user needs change.

5. **Multi-User Permissions:** Shared household login per requirements. Future enhancement: individual user accounts with permissions if household needs evolve.

**Architectural Risks: ZERO**

No critical risks identified. All decisions have clear rationale and fallback plans.

### Implementation Handoff

**AI Agent Guidelines:**

When implementing features from this architecture:

1. **Follow All Patterns Exactly:** Refer to "Implementation Patterns & Consistency Rules" section for every code decision. Use ✅ CORRECT examples, avoid ❌ INCORRECT anti-patterns.

2. **Use Project Structure as Guide:** Every feature has a clear location in the directory tree. Refer to "Requirements to Structure Mapping" to find where code belongs.

3. **Validate at All Boundaries:** Use shared Zod schemas for frontend validation, API validation, and database constraints. Never skip validation.

4. **Handle Errors Consistently:** Always use structured error format with matching HTTP status codes. User-friendly messages required.

5. **Co-Locate Tests:** Place `.test.ts` files next to source files. Write tests for all new code (MVP includes testing).

6. **Follow Naming Conventions:** snake_case (database), camelCase (TypeScript variables/JSON), PascalCase (types/components). Never mix.

7. **Use Pinia Stores Correctly:** Include granular loading states (`isLoadingX`, `isSavingY`) and error states for every async operation.

8. **Respect Type Safety:** TypeScript strict mode is enabled. Fix type errors immediately, never use `any`.

9. **Document API Changes:** Update @fastify/swagger schemas when modifying endpoints. API docs must stay current.

10. **Refer to This Document:** This architecture document is the single source of truth for all implementation decisions. When in doubt, check here first.

**First Implementation Priority:**

**Story 1: Project Initialization**

Execute the starter template commands to establish the technical foundation:

**Frontend Setup:**
```bash
# Create Vite project with Vue 3 + TypeScript
npm create vite@latest frontend -- --template vue-ts
cd frontend

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install dependencies
npm install vue-router@4 pinia axios chart.js vue-chartjs zod
npm install -D vitest @vue/test-utils @playwright/test eslint
```

**Backend Setup:**
```bash
# Create backend directory
mkdir backend && cd backend
npm init -y

# Install Fastify and plugins
npm install fastify @fastify/cors @fastify/helmet @fastify/env @fastify/session @fastify/swagger
npm install node-telegram-bot-api

# Install Drizzle ORM and SQLite
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3

# Install TypeScript and tools
npm install -D typescript @types/node tsx eslint vitest pino
npx tsc --init
```

**Root Monorepo Setup:**
```bash
# Initialize workspace
cd ..
npm init -y
# Edit package.json: Add "workspaces": ["frontend", "backend"]

# Create configuration files
touch .gitignore .env.example docker-compose.yml
touch Dockerfile.frontend Dockerfile.backend nginx.conf
```

**Verification Steps:**
1. Configure Tailwind CSS in frontend (`tailwind.config.js`, `postcss.config.js`)
2. Set up TypeScript strict mode in both frontend and backend (`tsconfig.json`)
3. Create initial Drizzle schema file (`backend/src/db/schema.ts`)
4. Configure Vite proxy for API during development (`vite.config.ts`)
5. Set up Docker multi-stage builds and docker-compose
6. Create `.env.example` files with all required environment variables
7. Test development servers (frontend on 5173, backend on 3000)
8. Commit initial project structure to git

**After Project Initialization:**

Proceed to implement core infrastructure stories:
- Database schema with Drizzle + Zod validation (shared schemas)
- Fastify server with session authentication (@fastify/session + HttpOnly cookies)
- Pinia stores and Vue frontend architecture (hybrid organization)
- Nginx reverse proxy configuration (same-domain deployment)
- GitHub Actions CI pipeline (TypeScript check, lint, tests, build)
- Automated backup script (daily SQLite backups with 30-day retention)

Then implement features in priority order from epics/stories, following all patterns and referring to requirements-to-structure mapping for file locations.

**Success Criteria for Implementation:**

- ✅ All TypeScript code compiles with zero errors (strict mode)
- ✅ All tests pass (Vitest unit/component + Playwright E2E)
- ✅ ESLint produces zero warnings or errors
- ✅ All API endpoints documented in Swagger UI
- ✅ All error responses use structured format with matching status codes
- ✅ All async operations have loading and error states
- ✅ All dates use correct formats at each layer (DB integers, TS Date, API ISO)
- ✅ All validation uses shared Zod schemas
- ✅ All tests co-located with source files
- ✅ CI pipeline passes before merge
- ✅ Coolify deployment succeeds automatically

**Questions During Implementation:**

If any ambiguity arises during implementation, refer to:
1. This architecture document (single source of truth)
2. PRD for requirements clarification
3. Product brief for product vision context

**The architecture is complete. Implementation can begin immediately.**

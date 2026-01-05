---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '/Users/andres/Projects/finance-doctor/_bmad-output/planning-artifacts/prd.md'
  - '/Users/andres/Projects/finance-doctor/_bmad-output/planning-artifacts/architecture.md'
workflowStatus: 'complete'
completionDate: '2026-01-03'
---

# finance-doctor - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for finance-doctor, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Expense Tracking & Entry (FR1-FR5)**
- FR1: Users can log expenses via Telegram bot using natural language text format
- FR2: Users can specify expense amount, category, and optional description in a single message
- FR3: Users can receive immediate confirmation when an expense is logged successfully
- FR4: Users can backdate expense entries to a specific date for recovery scenarios
- FR5: Users can log expenses at any time without requiring web dashboard access

**Category Management (FR6-FR10)**
- FR6: Users can define custom spending categories during initial setup
- FR7: Users can add new spending categories at any time
- FR8: Users can edit existing category names
- FR9: Users can view all defined categories
- FR10: System requires a valid category for every expense entry

**Dashboard & Spending Visualization (FR11-FR17)**
- FR11: Users can view all expenses for the current month
- FR12: Users can see total spending amount for the current month
- FR13: Users can view spending breakdown by category with visual representation
- FR14: Users can see individual expense details including date, amount, category, and description
- FR15: Users can access the dashboard from desktop browsers
- FR16: Users can access the dashboard from mobile browsers
- FR17: Users can refresh the dashboard to see recently logged expenses

**Monthly Reporting & Insights (FR18-FR21)**
- FR18: Users can view month-end summary report for completed months
- FR19: Users can see spending breakdown by category as percentage of total
- FR20: Users can identify spending patterns (e.g., above/below typical spending)
- FR21: Users can view basic insights about their monthly spending behavior

**Data Management & Retrieval (FR22-FR27)**
- FR22: System stores all expense data persistently
- FR23: System associates each expense with the logging user's household
- FR24: System filters expenses by date range (monthly views)
- FR25: System categorizes expenses according to user-defined categories
- FR26: System maintains expense history across multiple months
- FR27: System handles up to 12 months of historical expense data

**User Access & Authentication (FR28-FR31)**
- FR28: Users can authenticate to access the web dashboard
- FR29: Household members can access shared expense data
- FR30: Users can log in from multiple devices
- FR31: System maintains user session across dashboard interactions

**Onboarding & Setup (FR32-FR34)**
- FR32: New users can complete initial setup including category definition
- FR33: Users can connect their Telegram account to the expense tracking system
- FR34: Users receive setup guidance for first-time configuration

### NonFunctional Requirements

**Performance (NFR1-NFR9)**
- NFR1: Telegram bot expense entry must complete within 10 seconds from message send to confirmation
- NFR2: Web dashboard initial load must complete within 2 seconds for current month data
- NFR3: Web dashboard historical data view (12 months) must load within 3 seconds
- NFR4: Category charts must render within 500ms after data load
- NFR5: Dashboard page refresh must complete using standard HTTP refresh cycle without real-time complexity
- NFR6: System must handle 1,200-1,500 expense entries (12 months × 100-125 avg/month) without performance degradation
- NFR7: Expense lists exceeding 100 entries must use pagination or virtualization to maintain performance
- NFR8: Database queries must use proper indexing on date and category fields for efficient retrieval
- NFR9: Historical month data must use lazy loading (load on-demand) rather than upfront loading

**Security (NFR10-NFR19)**
- NFR10: All financial data must be stored locally with no third-party dependencies for core functionality
- NFR11: No external data sharing or cloud storage of sensitive financial information
- NFR12: Users must maintain complete control over their financial data
- NFR13: No sensitive data stored in browser storage beyond session information
- NFR14: Authentication required between Vue app and Node.js backend
- NFR15: Telegram bot token must be secured in backend environment variables
- NFR16: User sessions must be properly managed across dashboard interactions
- NFR17: Household members must only access their own household's expense data
- NFR18: No third-party analytics or tracking scripts allowed in the application
- NFR19: Backend must handle all data persistence to maintain privacy guarantees

**Reliability (NFR20-NFR28)**
- NFR20: Telegram bot must maintain 99%+ uptime for expense logging availability
- NFR21: Web dashboard must be accessible anytime for mid-month check-ins and month-end reviews
- NFR22: System must recover gracefully from failures without data corruption
- NFR23: Zero data loss tolerance - all expense entries must be persistently stored
- NFR24: System must support backdated entries without data integrity issues
- NFR25: Expense-category relationships must remain consistent across all operations
- NFR26: System must provide clear error messages for failed expense entries
- NFR27: Telegram bot must confirm successful expense logging before considering entry complete
- NFR28: Dashboard must handle missing or incomplete data gracefully

**Integration (NFR29-NFR37)**
- NFR29: System must integrate with Telegram Bot API for message processing
- NFR30: Bot must parse natural language expense format: "Description $amount category"
- NFR31: Bot must support backdating format for recovery scenarios
- NFR32: Bot integration must remain functional across Telegram API updates
- NFR33: Vue dashboard and Telegram bot must communicate with the same Node.js backend
- NFR34: Both components must read/write to the same database without conflicts
- NFR35: No direct communication required between bot and frontend components
- NFR36: Web dashboard must function correctly in modern evergreen browsers (Chrome, Firefox, Safari - latest 2 versions)
- NFR37: No support required for Internet Explorer or legacy browsers

### Additional Requirements

**Starter Template & Project Initialization (from Architecture)**
- Custom monorepo setup with official Vite template for Vue 3 + TypeScript frontend
- Fastify backend setup with TypeScript, Drizzle ORM, and SQLite
- Tailwind CSS integration for utility-first styling
- Docker containerization for consistent deployment
- GitHub Actions CI/CD pipeline with TypeScript checking, linting, testing, and build verification
- Coolify for automated deployment to self-hosted VPS
- Comprehensive test suite from MVP (Vitest for unit tests, Playwright for E2E)

**Database & Data Layer (from Architecture)**
- SQLite database with Drizzle ORM and better-sqlite3 driver
- Zod integration for runtime validation at all boundaries
- Database schema with snake_case naming convention
- drizzle-kit for schema management and migrations
- Automated daily SQLite backups with 30-day retention (local VPS only)

**Authentication & Security (from Architecture)**
- Session-based authentication with @fastify/session
- Shared household login (single username/password)
- HttpOnly, Secure, SameSite cookies
- Same-domain deployment via Nginx reverse proxy (no CORS needed)
- @fastify/helmet for security headers
- .env files for local development, Coolify environment variables for production

**API & Communication (from Architecture)**
- RESTful API with JSON responses (camelCase fields)
- @fastify/swagger with OpenAPI specification for API documentation
- Structured error responses with matching HTTP status codes
- Direct data responses (no wrappers for success)
- Refresh-based frontend fetching (no WebSockets)

**Frontend Architecture (from Architecture)**
- Pinia for centralized state management with granular loading states
- Hybrid component organization (components/, views/, composables/, stores/)
- Vue Router 4 with client-side routing
- Chart.js for spending visualizations
- Responsive design with breakpoints: Desktop (1024px+), Tablet (768px-1023px), Mobile (<768px)

**Infrastructure & Deployment (from Architecture)**
- Nginx serves frontend static files and reverse proxies API requests
- Pino logger with structured JSON logging to container stdout
- Coolify log viewer for debugging and monitoring
- Local VPS deployment with SQLite data persistence
- Backup script with cron job for automated daily backups

**Coding Standards & Patterns (from Architecture)**
- Database naming: snake_case for all identifiers
- TypeScript naming: camelCase for variables/functions, PascalCase for types/interfaces/classes
- API conventions: Plural endpoints (/api/expenses), camelCase JSON fields
- Co-located tests: .test.ts files next to source files
- Shared Zod schemas between frontend and backend
- Multi-layer validation: Frontend, API, and database constraints
- Boolean variable prefixes: is/has/should
- Date formats: Database (Unix timestamps as integers), TypeScript (Date objects), API (ISO 8601 strings)
- Pinia stores with specific loading states (isLoadingExpenses, isSavingExpense) and error states

### FR Coverage Map

FR1: Epic 3 - Telegram bot expense logging
FR2: Epic 3 - Expense amount, category, description parsing
FR3: Epic 3 - Immediate confirmation messages
FR4: Epic 3 - Backdated entry support
FR5: Epic 3 - Log expenses anytime without dashboard
FR6: Epic 2 - Define categories during initial setup
FR7: Epic 5 - Add new categories anytime
FR8: Epic 5 - Edit existing category names
FR9: Epic 5 - View all categories
FR10: Epic 3 - Validate category for all entries
FR11: Epic 4 - View current month expenses
FR12: Epic 4 - See total monthly spending
FR13: Epic 4 - Category breakdown visualization
FR14: Epic 4 - Individual expense details
FR15: Epic 4 - Desktop browser access
FR16: Epic 4 - Mobile browser access
FR17: Epic 4 - Refresh to see recent expenses
FR18: Epic 6 - Month-end summary report
FR19: Epic 6 - Spending percentage by category
FR20: Epic 6 - Identify spending patterns
FR21: Epic 6 - View spending insights
FR22: Epic 3 - Persistent expense storage
FR23: Epic 3 - Associate expenses with household
FR24: Epic 3 - Filter by date range
FR25: Epic 3 - Categorize expenses
FR26: Epic 3 - Maintain expense history
FR27: Epic 3 - Handle 12 months of data
FR28: Epic 2 - Dashboard authentication
FR29: Epic 2 - Shared household access
FR30: Epic 2 - Multi-device login
FR31: Epic 2 - Session management
FR32: Epic 2 - Initial setup completion
FR33: Epic 2 - Telegram account connection
FR34: Epic 2 - Setup guidance

## Epic List

### Epic 1: Project Foundation & Infrastructure
Development environment is ready; technical foundation enables all future features. This epic establishes the complete technical stack including Vue 3 + TypeScript frontend, Fastify + SQLite backend, Docker containerization, GitHub Actions CI/CD pipeline, and Coolify deployment infrastructure.

**FRs covered:** Architecture requirements (starter template, database setup, CI/CD, deployment infrastructure)

### Epic 2: User Onboarding & Category Setup
New users can complete initial setup, define spending categories, and connect Telegram bot. Users can authenticate to access the web dashboard and household members can access shared expense data from multiple devices.

**FRs covered:** FR6, FR28, FR29, FR30, FR31, FR32, FR33, FR34

### Epic 3: Expense Tracking via Telegram
Users can log expenses via Telegram bot with natural language, receive confirmations, and backdate entries. All expense data is stored persistently with proper categorization and supports up to 12 months of historical data.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR10, FR22, FR23, FR24, FR25, FR26, FR27

### Epic 4: Dashboard & Current Month Visualization
Users can view current month expenses, spending breakdowns by category, and totals on responsive web dashboard accessible from both desktop and mobile browsers.

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16, FR17

### Epic 5: Category Management
Users can add, edit, and view spending categories at any time beyond initial setup, providing flexibility to adjust categories as spending patterns evolve.

**FRs covered:** FR7, FR8, FR9

### Epic 6: Monthly Reporting & Insights
Users can view month-end summaries, spending patterns, and actionable insights that identify spending behaviors and deliver the "aha moment" of clear financial visibility.

**FRs covered:** FR18, FR19, FR20, FR21

## Epic 1: Project Foundation & Infrastructure

Development environment is ready; technical foundation enables all future features. This epic establishes the complete technical stack including Vue 3 + TypeScript frontend, Fastify + SQLite backend, Docker containerization, GitHub Actions CI/CD pipeline, and Coolify deployment infrastructure.

### Story 1.1: Initialize Monorepo Project Structure

As a **developer**,
I want **a properly configured monorepo structure with separate frontend and backend workspaces**,
So that **I can develop both applications with shared dependencies and unified tooling**.

**Acceptance Criteria:**

**Given** a new project repository
**When** the monorepo is initialized
**Then** the project has the following structure:
- Root `package.json` with workspaces configured for "frontend" and "backend"
- `.gitignore` file excluding node_modules, .env files, and build artifacts
- `.env.example` file documenting required environment variables
- `README.md` with project overview and setup instructions

**And** running `npm install` at root successfully installs all workspace dependencies

**And** the monorepo supports running scripts across workspaces

### Story 1.2: Configure Frontend Development Environment

As a **developer**,
I want **a Vue 3 + TypeScript + Tailwind CSS frontend configured with Vite**,
So that **I can build responsive UI components with modern tooling and hot module replacement**.

**Acceptance Criteria:**

**Given** the monorepo structure exists
**When** the frontend workspace is configured
**Then** the frontend directory contains:
- Vue 3 project initialized with Vite using the `vue-ts` template
- Tailwind CSS installed and configured with `tailwind.config.js` and `postcss.config.js`
- TypeScript configured with strict mode enabled
- ESLint configured for Vue 3 and TypeScript

**And** running `npm run dev` in the frontend directory starts the Vite dev server

**And** the default Vue app renders with Tailwind CSS styles applied

**And** `.env.example` file documents frontend environment variables (VITE_API_URL)

### Story 1.3: Configure Backend Development Environment

As a **developer**,
I want **a Fastify + TypeScript backend configured with development tooling**,
So that **I can build RESTful API endpoints with type safety and hot reload**.

**Acceptance Criteria:**

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

### Story 1.4: Set Up Database Layer with Drizzle ORM

As a **developer**,
I want **SQLite database configured with Drizzle ORM and migration tooling**,
So that **I can define type-safe schemas and manage database evolution**.

**Acceptance Criteria:**

**Given** the backend is configured
**When** the database layer is set up
**Then** the following are installed and configured:
- `drizzle-orm` and `better-sqlite3` as dependencies
- `drizzle-kit` as dev dependency
- `drizzle.config.ts` configured for SQLite with migrations directory

**And** the `backend/src/db/` directory contains:
- `schema.ts` with initial schema structure (empty tables ready for future stories)
- `index.ts` with database connection export using better-sqlite3
- `migrations/` directory initialized

**And** running `npm run db:generate` generates migration files

**And** running `npm run db:migrate` applies migrations to SQLite database

**And** database file is created at configured path with proper permissions

### Story 1.5: Configure Docker Containerization

As a **developer**,
I want **Docker configuration for frontend, backend, and nginx reverse proxy**,
So that **the application can be deployed consistently across environments**.

**Acceptance Criteria:**

**Given** frontend and backend are configured
**When** Docker configuration is complete
**Then** the project contains:
- `Dockerfile.frontend` with multi-stage build (build stage + nginx serving)
- `Dockerfile.backend` with multi-stage build (build stage + production runtime)
- `Dockerfile.nginx` for reverse proxy configuration
- `docker-compose.yml` orchestrating all services with proper networking

**And** `nginx.conf` configured to:
- Serve frontend static files
- Proxy `/api/*` requests to backend
- Set proper security headers

**And** running `docker-compose up` successfully builds and starts all containers

**And** accessing `http://localhost` shows the Vue app

**And** accessing `http://localhost/api/health` returns the backend health check

### Story 1.6: Set Up CI/CD Pipeline with GitHub Actions

As a **developer**,
I want **automated CI pipeline running tests and checks on every pull request**,
So that **code quality is enforced before merging and deployment**.

**Acceptance Criteria:**

**Given** the project is in a Git repository
**When** the CI/CD pipeline is configured
**Then** `.github/workflows/ci.yml` exists with jobs for:
- TypeScript type checking (frontend and backend)
- ESLint linting (frontend and backend)
- Build verification (frontend and backend compile successfully)
- Test execution (Vitest unit tests - framework ready even if no tests yet)

**And** the pipeline runs on pull requests and pushes to main branch

**And** failed checks prevent merge (branch protection configured)

**And** all jobs pass successfully with the current codebase

**And** build artifacts are cached for faster subsequent runs

### Story 1.7: Configure Coolify Deployment

As a **developer**,
I want **Coolify configured to auto-deploy the application on push to main**,
So that **changes are automatically deployed to the VPS without manual intervention**.

**Acceptance Criteria:**

**Given** Coolify is installed on the target VPS
**When** the deployment configuration is complete
**Then** the project is connected to Coolify with:
- Git repository linked for auto-deployment
- Environment variables configured (DATABASE_PATH, SESSION_SECRET, TELEGRAM_BOT_TOKEN, etc.)
- Docker Compose deployment method selected
- Volume mounts configured for SQLite database persistence and backups

**And** pushing to main branch triggers automatic deployment

**And** deployment logs are visible in Coolify dashboard

**And** the application is accessible at the configured domain

**And** SQLite database persists across deployments via volume mount

**And** backup script configured with cron job for daily automated backups (30-day retention)

## Epic 2: User Onboarding & Category Setup

New users can complete initial setup, define spending categories, and connect Telegram bot. Users can authenticate to access the web dashboard and household members can access shared expense data from multiple devices.

### Story 2.1: Create User and Category Database Schema

As a **developer**,
I want **database tables for users, sessions, and categories with proper relationships**,
So that **the system can store authentication data and user-defined spending categories**.

**Acceptance Criteria:**

**Given** the database layer is configured (from Epic 1)
**When** the schema is created
**Then** the following tables exist in `backend/src/db/schema.ts`:
- `users` table with fields: id, username, password_hash, created_at
- `sessions` table with fields: id, user_id, session_token, expires_at, created_at
- `categories` table with fields: id, name, created_at

**And** Zod schemas are defined in `backend/src/schemas/` for:
- User creation and login validation
- Category creation and updates

**And** running `npm run db:generate` creates migration files

**And** running `npm run db:migrate` successfully applies the migration

**And** database indexes are created on: sessions.session_token, sessions.user_id, categories.name

### Story 2.2: Implement Session-Based Authentication System

As a **developer**,
I want **backend authentication middleware and API endpoints for login/logout**,
So that **users can securely authenticate and maintain sessions across requests**.

**Acceptance Criteria:**

**Given** the user and session database tables exist
**When** the authentication system is implemented
**Then** `backend/src/middleware/auth.ts` contains session authentication middleware

**And** `backend/src/routes/auth.ts` provides endpoints:
- `POST /api/auth/login` - validates credentials, creates session, returns HttpOnly cookie
- `POST /api/auth/logout` - destroys session, clears cookie
- `GET /api/auth/session` - returns current user if authenticated

**And** `backend/src/services/authService.ts` handles:
- Password hashing with bcrypt
- Session creation and validation
- Session cleanup for expired sessions

**And** session cookies are configured with: HttpOnly, Secure (production), SameSite=Strict

**And** login with valid credentials returns 200 with user data

**And** login with invalid credentials returns 401 with structured error

**And** protected endpoints return 401 when not authenticated

### Story 2.3: Build Login UI and Authentication Flow

As a **household member**,
I want **a login page where I can enter credentials to access the dashboard**,
So that **only authorized users can view our financial data**.

**Acceptance Criteria:**

**Given** the backend authentication system is implemented
**When** the login UI is built
**Then** `frontend/src/views/LoginView.vue` contains:
- Form with username and password inputs
- Submit button with loading state
- Error message display for failed login
- Tailwind CSS styling for responsive design

**And** `frontend/src/stores/auth.ts` Pinia store manages:
- Authentication state (isAuthenticated, currentUser)
- Login action calling `/api/auth/login`
- Logout action calling `/api/auth/logout`
- Session check action calling `/api/auth/session`

**And** `frontend/src/router.ts` includes:
- Navigation guard redirecting unauthenticated users to login
- Route for `/login` rendering LoginView

**And** successful login redirects to dashboard

**And** failed login displays error message from API

**And** logout clears auth state and redirects to login

### Story 2.4: Create Onboarding Flow with Category Setup

As a **new user**,
I want **a guided onboarding flow to define my initial spending categories**,
So that **I can start tracking expenses in categories that match my spending patterns**.

**Acceptance Criteria:**

**Given** the user is authenticated and has no categories
**When** the onboarding flow is accessed
**Then** `frontend/src/views/OnboardingView.vue` displays:
- Welcome message explaining category setup
- Form to add multiple categories (name input + add button)
- List of added categories with remove option
- Suggested default categories (Food, Dining, Transportation, Shopping, Bills)
- Complete setup button (enabled when at least 3 categories exist)

**And** `backend/src/routes/categories.ts` provides:
- `POST /api/categories` - creates a new category (validates unique name)
- `GET /api/categories` - returns all categories for the household
- `DELETE /api/categories/:id` - removes a category

**And** `backend/src/services/categoryService.ts` handles:
- Category validation (non-empty name, uniqueness)
- Category creation with proper user association

**And** completing setup marks onboarding as done and redirects to dashboard

**And** attempting to add duplicate category name shows validation error

**And** router redirects to onboarding if authenticated user has no categories

### Story 2.5: Implement Telegram Bot Connection Setup

As a **household member**,
I want **instructions and verification for connecting the Telegram bot**,
So that **I can start logging expenses via Telegram messages**.

**Acceptance Criteria:**

**Given** the user has completed category setup
**When** the Telegram bot connection page is displayed
**Then** `frontend/src/views/OnboardingView.vue` includes a Telegram setup step with:
- Instructions to find the bot on Telegram (bot username displayed)
- `/start` command to send to the bot
- Verification status showing connection state

**And** `backend/src/services/telegramBotService.ts` is initialized with:
- Telegram Bot API connection using `node-telegram-bot-api`
- `/start` command handler that:
  - Associates Telegram user ID with household account
  - Sends welcome message with usage instructions
  - Confirms successful connection

**And** `backend/src/db/schema.ts` includes telegram_user_id field in users table

**And** sending `/start` to the bot shows success message

**And** frontend polling/refresh shows verification complete when bot connection succeeds

**And** onboarding completion redirects to dashboard after Telegram connection verified

## Epic 3: Expense Tracking via Telegram

Users can log expenses via Telegram bot with natural language, receive confirmations, and backdate entries. All expense data is stored persistently with proper categorization and supports up to 12 months of historical data.

### Story 3.1: Create Expense Database Schema

As a **developer**,
I want **a database table for expenses with proper relationships and indexing**,
So that **the system can persistently store expense data with efficient date and category queries**.

**Acceptance Criteria:**

**Given** the categories table exists (from Epic 2)
**When** the expense schema is created
**Then** `backend/src/db/schema.ts` includes an `expenses` table with fields:
- id (primary key)
- amount (integer, stores cents for precision)
- category_id (foreign key to categories table)
- description (text, optional)
- expense_date (timestamp, the date of the expense)
- telegram_message_id (text, optional)
- created_at (timestamp)

**And** Zod schema defined in `backend/src/schemas/expenseSchema.ts` for:
- Expense creation (amount, categoryId, date, description)
- Expense validation (positive amount, valid category)

**And** database indexes created on: expense_date, category_id, created_at

**And** running `npm run db:generate` creates migration files

**And** running `npm run db:migrate` successfully applies the migration

**And** foreign key constraint ensures category_id references valid categories

### Story 3.2: Build Natural Language Expense Parser

As a **developer**,
I want **a parser that extracts amount, category, and description from natural language text**,
So that **users can log expenses using simple Telegram messages like "Coffee $5 dining"**.

**Acceptance Criteria:**

**Given** users send Telegram messages in format: "[Description] $[amount] [category]"
**When** the parser processes the message
**Then** `backend/src/utils/parseExpenseMessage.ts` exports a function that:
- Extracts description (text before the dollar sign)
- Extracts amount (numeric value after $, supports decimals like $5.50)
- Extracts category (text after the amount)
- Returns structured object: { description, amount, category, date }

**And** the parser handles variations:
- "$5 coffee dining" (no description, amount first)
- "Lunch $12.50 food" (with description and decimals)
- "Gas $45 transportation" (single word description)

**And** co-located test file `parseExpenseMessage.test.ts` validates:
- Correct parsing of various formats
- Handling of edge cases (missing description, invalid amount)
- Category name trimming and normalization

**And** parser returns error object for invalid formats (missing amount or category)

**And** date defaults to current timestamp unless specified

### Story 3.3: Implement Telegram Bot Expense Logging

As a **household member**,
I want **to send expense messages to the Telegram bot and receive immediate confirmation**,
So that **I can quickly log expenses from my phone in under 10 seconds**.

**Acceptance Criteria:**

**Given** the Telegram bot is connected (from Epic 2)
**When** expense logging is implemented
**Then** `backend/src/services/telegramBotService.ts` handles text messages by:
- Parsing the message using the natural language parser
- Validating the category exists in the database
- Validating the amount is positive (using Zod schema)
- Creating expense record in database
- Sending confirmation message with expense details

**And** `backend/src/services/expenseService.ts` provides:
- createExpense(data) - validates and stores expense
- Category validation against database
- Amount conversion (dollars to cents for storage)

**And** successful expense logging returns confirmation:
- "✅ Logged: $5.00 for Coffee in Dining on [date]"

**And** failed validation returns structured error:
- "❌ Category 'xyz' not found. Use /categories to see valid categories"
- "❌ Invalid amount. Please use format: Description $amount category"

**And** bot responds within 10 seconds (NFR1)

**And** `/categories` command returns list of valid categories

### Story 3.4: Add Backdating Support for Expenses

As a **household member**,
I want **to specify a date when logging an expense**,
So that **I can log missed expenses from previous days**.

**Acceptance Criteria:**

**Given** the basic expense logging works
**When** backdating is implemented
**Then** the natural language parser supports date format:
- "Coffee $5 dining 1/2" (month/day)
- "Lunch $12 food 2024-01-02" (ISO format)
- "Gas $45 transportation yesterday"

**And** `backend/src/utils/parseExpenseMessage.ts` updated to:
- Extract optional date from message
- Parse common date formats
- Handle relative dates (yesterday, today)
- Default to current date if not specified

**And** expense confirmation message includes the parsed date:
- "✅ Logged: $5.00 for Coffee in Dining on Jan 2, 2024"

**And** backdated expenses are stored with the specified expense_date

**And** invalid date formats return error:
- "❌ Invalid date format. Use MM/DD, YYYY-MM-DD, or 'yesterday'"

**And** dates in the future return error:
- "❌ Cannot log expenses for future dates"

### Story 3.5: Create Expense Retrieval API Endpoints

As a **developer**,
I want **API endpoints to retrieve expenses with filtering by date range and category**,
So that **the frontend dashboard can display current month expenses and historical data**.

**Acceptance Criteria:**

**Given** expenses are being logged via Telegram
**When** the expense API is implemented
**Then** `backend/src/routes/expenses.ts` provides endpoints:
- `GET /api/expenses` - returns all expenses with query parameters:
  - `startDate` (ISO string, optional)
  - `endDate` (ISO string, optional)
  - `categoryId` (number, optional)
  - Default: current month if no dates specified
- `GET /api/expenses/:id` - returns single expense by ID

**And** `backend/src/services/expenseService.ts` provides:
- getExpenses(filters) - queries with date/category filters
- getExpenseById(id) - retrieves single expense
- Efficient queries using database indexes

**And** response format returns direct array (no wrapper):
```json
[
  {
    "id": 1,
    "amount": 500,
    "categoryId": 2,
    "categoryName": "Dining",
    "description": "Coffee",
    "date": "2024-01-02T10:30:00Z",
    "createdAt": "2024-01-02T10:31:00Z"
  }
]
```

**And** amounts are returned in cents (as stored)

**And** dates are returned as ISO 8601 strings

**And** categoryName is joined from categories table

**And** requests require authentication (session middleware)

**And** pagination is implemented for lists exceeding 100 entries (NFR7)

## Epic 4: Dashboard & Current Month Visualization

Users can view current month expenses, spending breakdowns by category, and totals on responsive web dashboard accessible from both desktop and mobile browsers.

### Story 4.1: Create Expenses Pinia Store

As a **developer**,
I want **a Pinia store managing expense state and API interactions**,
So that **Vue components can access expense data reactively with proper loading and error states**.

**Acceptance Criteria:**

**Given** the expense API exists (from Epic 3)
**When** the expenses store is created
**Then** `frontend/src/stores/expenses.ts` exports `useExpenseStore` with state:
- `expenses` (Expense[] array)
- `isLoadingExpenses` (boolean)
- `error` (string | null)
- `currentMonthTotal` (computed property summing expense amounts)
- `expensesByCategory` (computed property grouping by category)

**And** actions are defined for:
- `fetchExpenses(startDate?, endDate?, categoryId?)` - calls GET /api/expenses
- `fetchCurrentMonth()` - fetches current month expenses
- `clearError()` - resets error state

**And** `frontend/src/api/expenses.ts` provides API client functions:
- `getExpenses(params)` - axios GET request with query params
- Proper error handling with structured error extraction

**And** co-located test file `expenses.test.ts` validates:
- State initialization
- Successful fetch updates state
- Error handling sets error message
- Loading states toggle correctly

**And** amount formatting utility `frontend/src/utils/formatCurrency.ts`:
- Converts cents to dollars
- Formats with currency symbol ($5.00)

### Story 4.2: Build Dashboard View with Current Month Layout

As a **household member**,
I want **a dashboard showing my current month's financial overview**,
So that **I can see at a glance how much I've spent this month**.

**Acceptance Criteria:**

**Given** expenses exist for the current month
**When** the dashboard view loads
**Then** `frontend/src/views/DashboardView.vue` displays:
- Page title "Dashboard - [Month Year]"
- Total spending for current month (large, prominent)
- Month selector component for navigation (current month selected)
- Expense list component
- Category spending chart component
- Loading spinner while data fetches
- Error message if fetch fails

**And** `frontend/src/components/MonthSelector.vue` provides:
- Previous/Next month navigation buttons
- Current month display
- Emits monthChanged event with selected date

**And** the dashboard uses the expenses Pinia store:
- Calls `fetchCurrentMonth()` on component mount
- Displays `currentMonthTotal` in header
- Shows loading state with spinner
- Displays error message if present

**And** `frontend/src/router.ts` includes route:
- Path: `/dashboard` (default authenticated route)
- Component: DashboardView
- Protected by auth guard

**And** dashboard loads in under 2 seconds for current month (NFR2)

**And** Tailwind CSS provides clean, modern styling

### Story 4.3: Implement Expense List Component

As a **household member**,
I want **a detailed list of all my expenses with dates, descriptions, and amounts**,
So that **I can review individual expense entries**.

**Acceptance Criteria:**

**Given** current month expenses are loaded
**When** the expense list is rendered
**Then** `frontend/src/components/ExpenseList.vue` displays:
- Table or list of expenses with columns:
  - Date (formatted: "Jan 2")
  - Description
  - Category name
  - Amount (formatted: "$5.00")
- Sorted by date (most recent first)
- Empty state message when no expenses exist
- Pagination controls if more than 100 expenses

**And** the component:
- Accepts `expenses` prop (Expense[] array)
- Uses formatCurrency utility for amounts
- Uses date formatting utility for dates
- Applies Tailwind CSS for responsive table/list

**And** `frontend/src/utils/dateHelpers.ts` provides:
- `formatDate(date)` - returns formatted date string
- `getMonthYear(date)` - returns "January 2024" format

**And** co-located test `ExpenseList.test.ts` validates:
- Renders expense data correctly
- Shows empty state when no expenses
- Formats amounts and dates properly

**And** mobile view uses list layout instead of table for better UX

### Story 4.4: Create Category Spending Chart Component

As a **household member**,
I want **a visual chart showing my spending breakdown by category**,
So that **I can quickly see which categories consume the most budget**.

**Acceptance Criteria:**

**Given** current month expenses exist across multiple categories
**When** the chart component renders
**Then** `frontend/src/components/CategoryChart.vue` displays:
- Pie or bar chart using Chart.js
- One segment/bar per category
- Category name labels
- Spending amount or percentage per category
- Color-coded categories
- Total at the top or center

**And** Chart.js and vue-chartjs are installed:
- `npm install chart.js vue-chartjs`
- Configured in component

**And** the component:
- Accepts `expensesByCategory` prop (grouped expense data)
- Computes percentage of total for each category
- Renders chart with responsive sizing
- Chart renders in under 500ms (NFR4)

**And** co-located test `CategoryChart.test.ts` validates:
- Chart data computed correctly
- Percentages sum to 100%
- Handles single category gracefully

**And** chart is responsive and scales on mobile devices

### Story 4.5: Implement Responsive Design for Mobile Access

As a **household member**,
I want **the dashboard to work well on my mobile browser**,
So that **I can check spending during mid-month on my phone**.

**Acceptance Criteria:**

**Given** the dashboard components are built
**When** responsive design is implemented
**Then** Tailwind CSS responsive classes are applied for breakpoints:
- Desktop (1024px+): Multi-column layout, full table
- Tablet (768px-1023px): Two-column layout, compact table
- Mobile (<768px): Single-column layout, list view

**And** `DashboardView.vue` uses responsive grid:
- Desktop: Chart and total side-by-side
- Mobile: Stacked vertically

**And** `ExpenseList.vue` adapts:
- Desktop: Full table with all columns
- Mobile: Card-based list with key info

**And** `CategoryChart.vue` scales properly on all screen sizes

**And** touch-friendly interface elements on mobile:
- Larger tap targets (buttons, links)
- Adequate spacing between interactive elements

**And** tested on modern browsers (Chrome, Firefox, Safari latest 2 versions - NFR36)

**And** no horizontal scrolling required on any breakpoint

**And** fonts and text remain readable on small screens

## Epic 5: Category Management

Users can add, edit, and view spending categories at any time beyond initial setup, providing flexibility to adjust categories as spending patterns evolve.

### Story 5.1: Create Categories Pinia Store

As a **developer**,
I want **a Pinia store managing category state and API interactions**,
So that **Vue components can access and modify categories reactively**.

**Acceptance Criteria:**

**Given** the category API exists (from Epic 2)
**When** the categories store is created
**Then** `frontend/src/stores/categories.ts` exports `useCategoryStore` with state:
- `categories` (Category[] array)
- `isLoadingCategories` (boolean)
- `isSavingCategory` (boolean)
- `isDeletingCategory` (boolean)
- `error` (string | null)

**And** actions are defined for:
- `fetchCategories()` - calls GET /api/categories
- `addCategory(name)` - calls POST /api/categories
- `updateCategory(id, name)` - calls PUT /api/categories/:id
- `deleteCategory(id)` - calls DELETE /api/categories/:id
- `clearError()` - resets error state

**And** `frontend/src/api/categories.ts` provides API client functions:
- `getCategories()` - axios GET request
- `createCategory(data)` - axios POST request
- `updateCategory(id, data)` - axios PUT request
- `deleteCategory(id)` - axios DELETE request

**And** co-located test file `categories.test.ts` validates:
- State initialization
- CRUD operations update state correctly
- Error handling sets error message
- Loading states toggle correctly

### Story 5.2: Build Category Management View

As a **household member**,
I want **a dedicated page to view and manage all my spending categories**,
So that **I can see my complete category list and add new categories as needed**.

**Acceptance Criteria:**

**Given** the user is authenticated
**When** the category management view loads
**Then** `frontend/src/views/CategoriesView.vue` displays:
- Page title "Manage Categories"
- List of all existing categories with their names
- "Add Category" button
- Modal/form to add new category
- Loading spinner while fetching categories
- Error message if fetch fails

**And** `frontend/src/components/CategoryManager.vue` provides:
- Display list of categories
- Add new category form (name input + submit)
- Edit button for each category
- Delete button for each category
- Validation error display

**And** the view uses the categories Pinia store:
- Calls `fetchCategories()` on component mount
- Displays all categories from store
- Shows appropriate loading states

**And** `frontend/src/router.ts` includes route:
- Path: `/categories`
- Component: CategoriesView
- Protected by auth guard
- Accessible from main navigation

**And** adding a new category:
- Opens form/modal with name input
- Validates non-empty name
- Calls store's `addCategory()` action
- Closes form and refreshes list on success
- Shows error if duplicate name

**And** Tailwind CSS provides clean, modern styling

### Story 5.3: Implement Edit Category Functionality

As a **household member**,
I want **to edit the name of an existing category**,
So that **I can correct typos or rename categories as my needs change**.

**Acceptance Criteria:**

**Given** categories exist in the system
**When** edit functionality is implemented
**Then** `backend/src/routes/categories.ts` includes:
- `PUT /api/categories/:id` endpoint
- Accepts new category name in request body
- Validates name is non-empty and unique
- Updates category in database
- Returns updated category

**And** `backend/src/services/categoryService.ts` provides:
- `updateCategory(id, name)` - validates and updates category
- Checks category exists before updating
- Validates new name uniqueness
- Returns structured error if validation fails

**And** the frontend `CategoryManager.vue` component:
- Shows edit button/icon for each category
- Opens inline edit or modal with pre-filled name
- Validates non-empty input
- Calls store's `updateCategory()` action
- Updates UI immediately on success
- Shows error if duplicate name or other validation fails

**And** edit form has:
- Cancel button to abandon changes
- Save button to commit changes
- Proper loading state during save

**And** successful edit shows success feedback (toast/message)

**And** editing preserves existing category ID and relationships

### Story 5.4: Add Delete Category with Usage Validation

As a **household member**,
I want **to delete categories I no longer use**,
So that **my category list stays clean and relevant**.

**Acceptance Criteria:**

**Given** categories exist in the system
**When** delete functionality is implemented
**Then** `backend/src/services/categoryService.ts` validates before deletion:
- Checks if category has associated expenses
- Returns error if category is in use:
  - Error code: "CATEGORY_IN_USE"
  - Message: "Cannot delete category with existing expenses"
- Allows deletion if no expenses exist

**And** `backend/src/routes/categories.ts` DELETE endpoint:
- Returns 409 Conflict if category has expenses
- Returns 200 and deletes if category is unused
- Returns 404 if category doesn't exist

**And** the frontend `CategoryManager.vue` component:
- Shows delete button/icon for each category
- Displays confirmation dialog before deletion:
  - "Are you sure you want to delete [category name]?"
  - Cancel and Confirm buttons
- Calls store's `deleteCategory()` action
- Removes category from UI immediately on success
- Shows error message if category is in use

**And** error handling for in-use categories:
- Clear message: "Cannot delete 'Dining' - it has existing expenses"
- Suggests editing the name instead
- Does not remove from UI

**And** successful deletion shows success feedback

**And** deleting a category does not cascade delete expenses (prevented at database level)

## Epic 6: Monthly Reporting & Insights

Users can view month-end summaries, spending patterns, and actionable insights that identify spending behaviors and deliver the "aha moment" of clear financial visibility.

### Story 6.1: Create Monthly Summary API Endpoint

As a **developer**,
I want **an API endpoint that returns monthly summary data with aggregations**,
So that **the frontend can display comprehensive month-end reports efficiently**.

**Acceptance Criteria:**

**Given** expense data exists for multiple months
**When** the monthly summary endpoint is implemented
**Then** `backend/src/routes/reports.ts` provides:
- `GET /api/reports/monthly/:year/:month` - returns summary for specified month

**And** `backend/src/services/reportService.ts` provides:
- `getMonthlyReport(year, month)` - aggregates expense data for the month
- Calculates total spending
- Groups expenses by category with totals
- Computes percentage of total for each category
- Sorts categories by spending amount (highest first)

**And** response format:
```json
{
  "month": "2024-01",
  "totalSpent": 324750,
  "expenseCount": 87,
  "categories": [
    {
      "categoryId": 2,
      "categoryName": "Dining",
      "total": 125000,
      "percentage": 38.5,
      "expenseCount": 23
    },
    {
      "categoryId": 1,
      "categoryName": "Food",
      "total": 98000,
      "percentage": 30.2,
      "expenseCount": 35
    }
  ]
}
```

**And** amounts returned in cents

**And** percentages rounded to 1 decimal place

**And** endpoint requires authentication

**And** returns 404 if no data for specified month

**And** query uses efficient database aggregations

### Story 6.2: Implement Spending Insights Service

As a **developer**,
I want **a service that generates spending insights and pattern identification**,
So that **users receive actionable feedback about their spending behavior**.

**Acceptance Criteria:**

**Given** multiple months of expense data exist
**When** the insights service is implemented
**Then** `backend/src/services/reportService.ts` includes:
- `getInsights(year, month)` - generates insights for specified month

**And** insights generation logic identifies:
- **Highest spending category:** Category with most spending this month
- **Pattern vs average:** Compare current month to previous months average (if data exists)
  - "15% above your typical spending in Dining"
  - "10% below average in Transportation"
- **New spending:** Categories used this month but not last month
- **Spending trend:** Increasing, decreasing, or stable compared to previous month

**And** `GET /api/reports/insights` endpoint returns:
```json
{
  "month": "2024-01",
  "insights": [
    {
      "type": "highest_category",
      "message": "Dining is your highest expense at $1,250.00 (38.5%)"
    },
    {
      "type": "pattern",
      "message": "Dining spending is 15% above your typical pattern"
    },
    {
      "type": "trend",
      "message": "Overall spending decreased 8% from last month"
    }
  ]
}
```

**And** insights are only generated when sufficient data exists (handles first month gracefully)

**And** messages are user-friendly and actionable

**And** endpoint requires authentication

### Story 6.3: Build Reports View Component

As a **household member**,
I want **a dedicated reports page showing my monthly summary and spending breakdown**,
So that **I can review my complete spending picture at month-end**.

**Acceptance Criteria:**

**Given** the monthly summary API exists
**When** the reports view is built
**Then** `frontend/src/views/ReportsView.vue` displays:
- Page title "Monthly Report - [Month Year]"
- Month selector for choosing which month to view
- Total spending for selected month (large, prominent)
- Category breakdown table with:
  - Category name
  - Amount spent
  - Percentage of total
  - Number of expenses
- Spending insights component
- Loading spinner while fetching data
- Error message if fetch fails

**And** the view uses both expenses and categories stores:
- Fetches monthly summary on mount
- Fetches insights for selected month
- Updates when month selector changes

**And** `frontend/src/router.ts` includes route:
- Path: `/reports`
- Component: ReportsView
- Protected by auth guard
- Accessible from main navigation

**And** month selector allows navigation:
- Previous/Next month buttons
- Defaults to current or most recent complete month
- Disables navigation for future months

**And** historical data loads in under 3 seconds (NFR3)

**And** Tailwind CSS provides clean, modern styling

### Story 6.4: Create Spending Insights Display Component

As a **household member**,
I want **to see actionable insights about my spending patterns**,
So that **I understand where I can improve and make better financial decisions**.

**Acceptance Criteria:**

**Given** insights data is available for the selected month
**When** the insights component renders
**Then** `frontend/src/components/SpendingInsights.vue` displays:
- Section title "Spending Insights"
- List of insight messages with icons/badges by type:
  - 📊 Highest category
  - 📈 Pattern compared to average
  - 📉 Trends
  - ✨ New spending areas
- Each insight styled distinctly (info, warning, success based on type)
- Empty state if no insights available (first month)

**And** the component:
- Accepts `insights` prop (Insight[] array)
- Groups insights by type
- Uses color coding for visual hierarchy:
  - Green for positive trends (spending decrease)
  - Yellow/orange for warnings (above average)
  - Blue for informational insights
- Responsive layout for mobile

**And** insights are prioritized:
- Warnings shown first (above average spending)
- Trends second
- Informational last

**And** co-located test `SpendingInsights.test.ts` validates:
- Renders insights correctly
- Handles empty state gracefully
- Applies correct styling by type

**And** insights provide clear, actionable information that delivers the "aha moment"

# Story 1.2: Configure Frontend Development Environment

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **a Vue 3 + TypeScript + Tailwind CSS frontend configured with Vite**,
So that **I can build responsive UI components with modern tooling and hot module replacement**.

## Acceptance Criteria

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

## Tasks / Subtasks

- [x] Install and configure Vue 3 frontend dependencies (AC: All frontend dependencies installed)
  - [x] Install vue-router@4 for client-side routing
  - [x] Install pinia@2 for state management
  - [x] Install axios for API communication
  - [x] Install chart.js and vue-chartjs for data visualization
  - [x] Install zod for validation schemas (shared with backend)
  - [x] Verify all dependency versions match project specifications

- [x] Configure Tailwind CSS (AC: Tailwind CSS configured and working)
  - [x] Install tailwindcss, postcss, autoprefixer as dev dependencies
  - [x] Create tailwind.config.js with content paths configured
  - [x] Create postcss.config.js for Tailwind processing
  - [x] Add @tailwind directives to src/style.css
  - [x] Test Tailwind utility classes render correctly

- [x] Verify TypeScript and ESLint configuration (AC: TypeScript strict mode and ESLint working)
  - [x] Confirm tsconfig.json has strict: true enabled
  - [x] Verify TypeScript version matches backend (~5.7.0)
  - [x] Test TypeScript compilation with npm run build
  - [x] Verify ESLint configuration for Vue 3 and TypeScript
  - [x] Run ESLint to ensure no configuration errors

- [x] Configure frontend environment variables (AC: .env.example created)
  - [x] Create frontend/.env.example with VITE_API_URL documented
  - [x] Document default value: http://localhost:3000
  - [x] Add instructions for environment variable usage
  - [x] Verify .env files are git-ignored

- [x] Test development server and build process (AC: Dev server and build working)
  - [x] Run npm run dev and verify server starts on port 5173
  - [x] Verify hot module replacement works with code changes
  - [x] Run npm run build and verify production build succeeds
  - [x] Test that Tailwind CSS classes are properly applied to components

## Dev Notes

### Critical Architecture Patterns

**Frontend Stack Decisions (from Architecture.md):**
- Vue 3.5.x with Composition API ONLY (no Options API)
- Vite 6.x as build tool (requires Node.js 22.12+)
- TypeScript 5.7.x with strict mode enabled (MUST match backend version)
- Tailwind CSS 3.4.x (NOT v4 - broader browser compatibility per Story 1.1)
- Source: [Architecture.md - Frontend Architecture](/_bmad-output/planning-artifacts/architecture.md#frontend-architecture)

**Tailwind CSS Version Selection (CRITICAL from Story 1.1):**
- **Decision:** Use Tailwind CSS v3.x for this project (NOT v4)
- **Rationale:**
  - v4.0 was recently released but requires Safari 16.4+, Chrome 111+, Firefox 128+
  - v3.4 provides broader browser compatibility (requirement: latest 2 versions of modern browsers)
  - v4 has breaking configuration changes (@import instead of @tailwind directives)
  - For stability and compatibility, stick with v3.4.x
- Source: [Story 1.1 - Dev Notes - Tailwind CSS Version](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#critical-version-requirements-as-of-january-2026)

**TypeScript Version Consistency (CRITICAL):**
- TypeScript 5.7.x MUST be consistent across both frontend and backend workspaces
- Story 1.1 established ~5.7.0 as the standard version
- Code review in Story 1.1 fixed version inconsistencies
- NEVER upgrade frontend TypeScript without upgrading backend in sync
- Source: [Story 1.1 - Code Review Fixes](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#code-review-fixes-applied)

**Monorepo Dependency Management:**
- Root package.json has workspaces configured: ["frontend", "backend"]
- Install workspace-specific dependencies: `npm install <package> --workspace=frontend`
- Common dependencies automatically hoisted to root node_modules
- Running scripts: `npm run dev --workspace=frontend` from root
- Source: [Story 1.1 - npm Workspaces Best Practices](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#npm-workspaces-best-practices)

### Project Structure Notes

**Frontend Directory Structure (Hybrid Component Organization):**
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── views/           # Page-level components (route targets)
│   ├── layouts/         # Layout wrappers
│   ├── composables/     # Reusable composition functions (use* naming)
│   ├── stores/          # Pinia state management
│   ├── schemas/         # Zod validation (shared with backend)
│   ├── router/          # Vue Router configuration
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Frontend dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── .env.example         # Environment variable documentation
```
- Source: [Architecture.md - Project Structure](/_bmad-output/planning-artifacts/architecture.md#project-structure)

**Alignment with Unified Project Structure:**
- Directory structure created in Story 1.1 includes all required directories
- This story focuses on installing dependencies and verifying configuration
- No directory creation needed - directories already exist from Story 1.1
- Source: [Story 1.1 - Complete Directory Structure](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#complete-directory-structure-to-create)

**Critical .env.example Configuration:**
```bash
# Frontend Environment Variables

# Backend API URL - change for production deployment
VITE_API_URL=http://localhost:3000

# Note: All Vite environment variables must be prefixed with VITE_
# to be exposed to the client-side code
```
- Vite requires VITE_ prefix for environment variables exposed to client
- Default API URL points to local backend on port 3000
- Production deployment will use same-domain setup (no CORS needed)
- Source: [Architecture.md - Authentication & Security](/_bmad-output/planning-artifacts/architecture.md#authentication--security)

### Technical Requirements

**Package Dependencies to Install (from Story 1.1 specifications):**

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
    "vue-tsc": "^2.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^9.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "vitest": "^2.0.0"
  }
}
```

**Installation Commands:**
```bash
# Navigate to frontend directory
cd frontend

# Install production dependencies
npm install vue@^3.5.0 vue-router@^4.0.0 pinia@^2.0.0 axios@^1.0.0
npm install chart.js@^4.0.0 vue-chartjs@^5.0.0 zod@^3.0.0

# Install Tailwind CSS and PostCSS
npm install -D tailwindcss@^3.4.0 postcss@^8.0.0 autoprefixer@^10.0.0

# Initialize Tailwind config
npx tailwindcss init -p

# Verify TypeScript version matches backend
npm list typescript
# Should show typescript@~5.7.0

# Install test framework (defer configuration to Story 1.6)
npm install -D vitest@^2.0.0
```

- Source: [Story 1.1 - Frontend Package Dependencies](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#package-dependencies-to-install)

**Vite Configuration (vite.config.ts):**

Key settings from Story 1.1 code review:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,  // Explicit port configuration (from code review)
  },
})
```

- Port 5173: Vite default, explicitly configured for team consistency
- HMR enabled by default for development
- Build target: ES modules for modern browsers only
- No legacy browser support needed
- Source: [Story 1.1 - Vite Config Enhanced](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#code-review-fixes-applied)

**TypeScript Configuration (tsconfig.json):**

Critical settings from project-context.md:
```json
{
  "compilerOptions": {
    "strict": true,              // MANDATORY - strict mode enabled
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

- strict: true is MANDATORY across all TypeScript code
- ESNext for target and module (modern browsers only)
- moduleResolution: "bundler" for Vite compatibility
- Source: [Project-context.md - TypeScript Configuration](/_bmad-output/project-context.md#language-specific-rules-typescriptjavascript)

**Tailwind CSS Configuration (tailwind.config.js):**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- Content paths MUST include all Vue components and TypeScript files
- Default theme is sufficient for MVP
- Custom theme extensions can be added later
- Source: [Story 1.1 - Tailwind CSS Installed and Configured](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#code-review-fixes-applied)

**PostCSS Configuration (postcss.config.js):**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- Enables Tailwind CSS processing
- Autoprefixer adds vendor prefixes automatically
- Source: [Story 1.1 - Tailwind CSS Installed and Configured](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#code-review-fixes-applied)

**Add Tailwind Directives to src/style.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- These directives MUST be present for Tailwind to work
- Place at the top of src/style.css
- Vite will process these during build
- Source: [Story 1.1 - Tailwind CSS Installed and Configured](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#code-review-fixes-applied)

### Architecture Compliance

**Vue 3 Composition API Requirements:**

From project-context.md, Vue components MUST follow these patterns:

```vue
<!-- CORRECT: Use <script setup> syntax -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  userId: number
  isActive: boolean
}>()

const emit = defineEmits<{
  submit: [data: FormData]
  cancel: []
}>()

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<template>
  <!-- Tailwind utility classes will be verified working -->
  <div class="p-4 bg-blue-500 text-white">
    Count: {{ count }}
  </div>
</template>
```

- MUST use `<script setup>` syntax (not Options API)
- TypeScript type annotations for props and emits
- Composition API with ref() and computed()
- Source: [Project-context.md - Vue Composition API](/_bmad-output/project-context.md#vue-composition-api)

**State Management with Pinia:**

Pinia stores MUST follow granular loading state pattern:

```typescript
// stores/expenses.ts (example for future stories)
import { defineStore } from 'pinia'

export const useExpenseStore = defineStore('expenses', {
  state: () => ({
    items: [],
    isLoadingExpenses: false,   // Granular loading states
    isSavingExpense: false,      // NOT just single "loading" flag
    error: null
  }),

  actions: {
    async fetchExpenses() {
      this.isLoadingExpenses = true
      try {
        // API call
      } catch (err) {
        this.error = err
      } finally {
        this.isLoadingExpenses = false
      }
    }
  }
})
```

- Separate loading flags for each operation (isLoading, isCreating, isUpdating, isDeleting)
- Never use single "loading" boolean
- Actions handle async with try/catch/finally
- Source: [Project-context.md - Pinia Store Patterns](/_bmad-output/project-context.md#pinia-store-patterns-critical---granular-loading-states)

**Routing Configuration (Vue Router 4):**

Router setup will be configured in later stories, but package is installed now:

```typescript
// router/index.ts (deferred to authentication story)
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    }
  ]
})
```

- Client-side routing with Vue Router 4
- Navigation guards for authentication (Story 2.3)
- Routes point to views/ directory components
- Source: [Architecture.md - Frontend Architecture](/_bmad-output/planning-artifacts/architecture.md#frontend-architecture)

**API Communication Pattern:**

Axios configuration for backend communication (implementation in later stories):

```typescript
// api/client.ts (deferred to later stories)
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // Include cookies for session auth
})
```

- BaseURL from environment variable
- withCredentials: true for session cookies
- Content-Type: application/json for all requests
- Source: [Architecture.md - API & Communication Patterns](/_bmad-output/planning-artifacts/architecture.md#api--communication-patterns)

### Library/Framework Requirements

**Vue 3 Ecosystem Versions (as of January 2026):**

**Core Framework:**
- Vue 3.5.x (latest stable)
- Composition API as default pattern
- Reactivity Transform NOT used (experimental, may be removed)
- Source: [Architecture.md - Frontend Architecture](/_bmad-output/planning-artifacts/architecture.md#frontend-architecture)

**State Management:**
- Pinia 2.x (official Vue 3 state management)
- Replaces Vuex (deprecated for Vue 3)
- Composition API style stores
- Source: [Architecture.md - Frontend Architecture](/_bmad-output/planning-artifacts/architecture.md#frontend-architecture)

**Routing:**
- Vue Router 4.x (official Vue 3 router)
- Composition API with useRouter() and useRoute()
- Client-side routing only (no SSR)
- Source: [Architecture.md - Frontend Architecture](/_bmad-output/planning-artifacts/architecture.md#frontend-architecture)

**Data Visualization:**
- Chart.js 4.x (mature, well-documented charting library)
- vue-chartjs 5.x (Vue 3 wrapper for Chart.js)
- Used for category spending charts
- Source: [Epics.md - Story 4.4: Create Category Spending Chart Component](/_bmad-output/planning-artifacts/epics.md#story-44-create-category-spending-chart-component)

**HTTP Client:**
- Axios 1.x (promise-based HTTP client)
- Auto-converts JSON request/response
- Interceptors for auth token handling
- Source: [Architecture.md - API & Communication Patterns](/_bmad-output/planning-artifacts/architecture.md#api--communication-patterns)

**Validation:**
- Zod 3.x (shared with backend)
- Type-safe schema validation
- Schemas in frontend/src/schemas/ mirrored from backend
- Source: [Architecture.md - Data Architecture](/_bmad-output/planning-artifacts/architecture.md#data-architecture)

**Build Tool Constraints:**
- Vite 6.x requires Node.js 20.19+ or 22.12+ minimum
- Using Node.js 22.12+ (current LTS from Story 1.1)
- Fast HMR for development
- Optimized production builds with esbuild
- Source: [Story 1.1 - Critical Version Requirements](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#critical-version-requirements-as-of-january-2026)

**Styling Framework Constraints:**
- Tailwind CSS 3.4.x specifically (NOT v4.0)
- v3.4 browser compatibility: works with latest 2 versions of modern browsers
- v4.0 requires Safari 16.4+, Chrome 111+, Firefox 128+ (too restrictive)
- Utility-first CSS approach
- Source: [Story 1.1 - Tailwind CSS Version](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#critical-version-requirements-as-of-january-2026)

**Development Tools:**
- ESLint 9.x with @typescript-eslint for Vue 3 + TypeScript
- vue-tsc 2.x for Vue template type checking
- Vitest 2.x for unit/component testing (install now, configure in Story 1.6)
- Source: [Story 1.1 - Package Dependencies](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#package-dependencies-to-install)

### File Structure Requirements

**Files to Verify/Modify in This Story:**

**package.json (frontend/package.json):**
- Verify all dependencies from Story 1.1 are present
- Add any missing dependencies: vue-router, pinia, axios, chart.js, vue-chartjs, zod
- Confirm TypeScript version is ~5.7.0 (matches backend)
- Verify Vite version is ^6.0.0
- Verify Tailwind CSS version is ^3.4.0

**tailwind.config.js (frontend/tailwind.config.js):**
- Must exist after running `npx tailwindcss init -p`
- Content paths MUST include: "./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"
- Default theme configuration is sufficient

**postcss.config.js (frontend/postcss.config.js):**
- Created automatically by `npx tailwindcss init -p`
- Must include tailwindcss and autoprefixer plugins

**src/style.css (frontend/src/style.css):**
- Add @tailwind base, components, utilities directives at top
- Original Vite styles can remain below

**.env.example (frontend/.env.example):**
- Must document VITE_API_URL with default value
- Include comment about VITE_ prefix requirement

**Existing Files from Story 1.1 (verify, don't modify):**
- vite.config.ts (has explicit port: 5173)
- tsconfig.json (has strict: true)
- tsconfig.app.json
- tsconfig.node.json
- index.html
- src/main.ts
- src/App.vue

**Naming Conventions (enforced):**
- Directories: lowercase (components/, views/, stores/)
- Vue components: PascalCase (ExpenseList.vue, DashboardView.vue)
- TypeScript files: camelCase (expenseService.ts, useExpenses.ts)
- Composables: use* prefix (useExpenses.ts, useAuth.ts)
- Store files: singular noun (expenses.ts, categories.ts)
- Source: [Architecture.md - Naming Patterns](/_bmad-output/planning-artifacts/architecture.md#naming-patterns)

### Testing Requirements

**For This Story:**

Manual verification only:
1. Run `npm install` in frontend directory - verify all packages install
2. Run `npm run dev` - verify Vite dev server starts on port 5173
3. Open browser to http://localhost:5173 - verify Vue app renders
4. Modify a component - verify HMR updates instantly
5. Add Tailwind utility class to template - verify styles apply
6. Run `npm run build` - verify production build succeeds
7. Check for TypeScript errors - verify strict mode is working

**Test Framework Setup (Install Only):**
- Vitest 2.x installed as dev dependency
- Configuration deferred to Story 1.6 (CI/CD Pipeline)
- No test files created in this story
- Source: [Story 1.1 - Testing Requirements](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#testing-requirements)

**Future Testing Patterns (Reference):**
- Co-located tests: ExpenseList.test.ts next to ExpenseList.vue
- NO separate __tests__/ directory
- Vitest for Vue component testing with @vue/test-utils
- Source: [Project-context.md - Testing Rules](/_bmad-output/project-context.md#testing-rules)

### Previous Story Intelligence

**Story 1.1 Completion Summary:**

Story 1.1 successfully established the monorepo foundation. Key learnings:

**What Was Created:**
- Root package.json with npm workspaces for "frontend" and "backend"
- Frontend workspace initialized with Vite vue-ts template
- Directory structure created: components/, views/, layouts/, composables/, stores/, schemas/, router/
- Comprehensive .gitignore excluding node_modules, .env files, database files
- .env.example documenting all environment variables
- README.md with setup instructions

**Dependencies Already Installed in Story 1.1:**
- Vue 3.5.x
- Vite 6.x
- TypeScript 5.7.x
- @vitejs/plugin-vue 5.x
- vue-tsc 2.x

**Code Review Corrections Applied:**
- TypeScript version standardized to ~5.7.0 across frontend and backend
- Vite version corrected to ^6.0.0 (was initially 7.2.4)
- Tailwind CSS 3.4.0 installed and configured
- Explicit port configuration added to vite.config.ts
- All dependencies verified with successful builds

**What This Story (1.2) Must Do:**
- Install remaining frontend dependencies (vue-router, pinia, axios, chart.js, vue-chartjs, zod)
- Verify Tailwind CSS configuration is working (already installed in Story 1.1 code review)
- Verify TypeScript configuration matches specifications
- Confirm ESLint is configured for Vue 3 + TypeScript
- Create .env.example for frontend environment variables
- Test dev server and build process

**Critical Pattern from Story 1.1:**
- ALL dependency installations triggered a code review that fixed version mismatches
- This story should verify versions match specifications BEFORE completing
- TypeScript MUST be ~5.7.0 (consistent with backend)
- Vite MUST be ^6.0.0 (not 7.x)
- Tailwind MUST be ^3.4.0 (not v4)

Source: [Story 1.1 - Completion Notes](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#completion-notes-list)

### Git Intelligence Summary

**Recent Commits Analysis:**

```
83049cb fix: add missing implementation for project structure
ccf5c03 feat: Initialize monorepo project structure
4743250 feat: Initial commit
```

**Patterns Observed:**
1. **Commit Message Style:** Conventional commits with type prefixes (feat:, fix:, chore:)
2. **Story Implementation Pattern:** Main implementation commit followed by fix commit
3. **Files Modified in Story 1.1:**
   - Root package.json with workspaces configuration
   - frontend/package.json with all dependencies
   - backend/package.json with all dependencies
   - .gitignore (comprehensive)
   - .env.example (both root and workspaces)
   - README.md (project overview)
   - Tailwind configuration files (tailwind.config.js, postcss.config.js)
   - vite.config.ts (explicit port)

**Code Patterns Established:**
- npm workspaces for monorepo management
- TypeScript strict mode enforced
- ES modules throughout (no CommonJS)
- Environment variables in .env.example (never committed)
- Explicit configuration over defaults (port: 5173 in vite.config.ts)

**This Story Should Follow:**
- Same commit message convention (feat: Configure frontend development environment)
- Verify configurations don't introduce version conflicts
- Run builds to confirm no regressions
- Update sprint-status.yaml after completion

### Latest Technical Information

**Vite 6 Configuration (as of January 2026):**

Vite 6 is the current major version with these key features:
- Node.js 20.19+ or 22.12+ minimum requirement
- Environment API for fine-grained control
- Improved HMR performance
- Better TypeScript support with moduleResolution: "bundler"
- Source: [Vite 6 Documentation](https://vite.dev/guide/)

**Vue 3.5 Features (latest stable):**

Vue 3.5 includes:
- Improved Composition API performance
- Better TypeScript inference
- Reactivity improvements
- Enhanced developer experience with better error messages
- Note: Reactivity Transform is experimental and not recommended for production
- Source: [Vue 3.5 Release Notes](https://vuejs.org/)

**Tailwind CSS 3.4 vs 4.0 Decision:**

This story uses Tailwind CSS 3.4.x intentionally:
- v4.0 released December 2024 with modern CSS features
- v4.0 browser requirements: Safari 16.4+, Chrome 111+, Firefox 128+
- v3.4.x provides broader compatibility for "latest 2 versions" requirement
- v4.0 configuration syntax changed (@import vs @tailwind directives)
- Stability and proven patterns favor v3.4.x for this project
- Source: [Tailwind CSS v4.0 Documentation](https://tailwindcss.com/docs)

**Pinia 2.x (Official Vue 3 State Management):**

Pinia is the official Vue 3 state management solution:
- Composition API-friendly design
- Better TypeScript inference than Vuex
- DevTools integration for debugging
- No mutations (actions only)
- Modular stores with defineStore()
- Source: [Pinia Documentation](https://pinia.vuejs.org/)

**Chart.js 4.x Integration:**

Chart.js 4.x with vue-chartjs 5.x wrapper:
- Tree-shakeable for smaller bundles
- Modern API with better TypeScript support
- Responsive by default
- Extensive chart types (pie, bar, line)
- Composable architecture for custom charts
- Source: [Chart.js Documentation](https://www.chartjs.org/)

**Security Best Practices (Frontend):**

Environment variables with Vite:
- MUST prefix with VITE_ to expose to client code
- Only expose non-sensitive variables (API URL is safe)
- Never expose secrets or API keys in frontend env vars
- Production env vars managed via Coolify deployment
- Source: [Vite Environment Variables](https://vite.dev/guide/env-and-mode.html)

### Project Context Reference

**Critical Implementation Rules (from project-context.md):**

**Vue Component Naming:**
- Components: PascalCase (ExpenseForm.vue, CategoryList.vue)
- Composables: camelCase with use* prefix (useExpenses.ts, useAuth.ts)
- Store files: Singular noun (expenses.ts, not expensesStore.ts)
- Boolean variables: MUST use is/has/should prefixes (isLoading, hasError, shouldValidate)

**TypeScript Configuration:**
- strict: true is MANDATORY
- ESNext for modern browser target
- ES modules only (not CommonJS)
- moduleResolution: "bundler" for Vite

**Code Organization:**
- components/ - Reusable UI components
- views/ - Page-level route components
- layouts/ - Layout wrappers
- composables/ - Composition functions
- stores/ - Pinia stores
- schemas/ - Zod validation (shared with backend)

**Anti-Patterns to AVOID:**
- ❌ NEVER use Options API (only Composition API with `<script setup>`)
- ❌ NEVER use single "loading" boolean in stores (use granular: isLoadingExpenses, isSavingExpense)
- ❌ NEVER skip multi-layer validation (frontend, API, database all validate)
- ❌ NEVER store sensitive data in browser storage (session cookies only)

Source: [Project-context.md](/_bmad-output/project-context.md)

### References

All technical details extracted from:

**Epic and Story Context:**
- [Epics.md - Epic 1: Project Foundation & Infrastructure](/_bmad-output/planning-artifacts/epics.md#epic-1-project-foundation--infrastructure)
- [Epics.md - Story 1.2: Configure Frontend Development Environment](/_bmad-output/planning-artifacts/epics.md#story-12-configure-frontend-development-environment)

**Architecture Decisions:**
- [Architecture.md - Starter Template Evaluation](/_bmad-output/planning-artifacts/architecture.md#starter-template-evaluation)
- [Architecture.md - Frontend Architecture](/_bmad-output/planning-artifacts/architecture.md#frontend-architecture)
- [Architecture.md - Selected Approach: Custom Monorepo with Official Tools](/_bmad-output/planning-artifacts/architecture.md#selected-approach-custom-monorepo-with-official-tools)
- [Architecture.md - Architectural Decisions Provided by Starter](/_bmad-output/planning-artifacts/architecture.md#architectural-decisions-provided-by-starter)

**Product Requirements:**
- [PRD.md - Technical Architecture Considerations](/_bmad-output/planning-artifacts/prd.md#technical-architecture-considerations)
- [PRD.md - Web Application Specific Requirements](/_bmad-output/planning-artifacts/prd.md#web-application-specific-requirements)

**Project Coding Standards:**
- [Project-context.md - Technology Stack & Versions](/_bmad-output/project-context.md#technology-stack--versions)
- [Project-context.md - Vue Composition API](/_bmad-output/project-context.md#vue-composition-api)
- [Project-context.md - Pinia Store Patterns](/_bmad-output/project-context.md#pinia-store-patterns-critical---granular-loading-states)
- [Project-context.md - Critical Don't-Miss Rules](/_bmad-output/project-context.md#critical-dont-miss-rules)

**Previous Story Learnings:**
- [Story 1.1 - Initialize Monorepo Project Structure](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md)
- [Story 1.1 - Critical Version Requirements](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#critical-version-requirements-as-of-january-2026)
- [Story 1.1 - npm Workspaces Best Practices](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#npm-workspaces-best-practices)
- [Story 1.1 - Code Review Fixes Applied](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#code-review-fixes-applied)
- [Story 1.1 - Completion Notes List](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md#completion-notes-list)

**Web Research (Latest Versions & Best Practices):**
- Vite 6: [Vite Getting Started](https://vite.dev/guide/)
- Vue 3.5: [Vue 3 Documentation](https://vuejs.org/)
- Tailwind CSS 3.4 vs 4.0: [Tailwind CSS Releases](https://github.com/tailwindlabs/tailwindcss/releases)
- Pinia 2: [Pinia Documentation](https://pinia.vuejs.org/)
- Chart.js 4: [Chart.js Documentation](https://www.chartjs.org/)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None

### Completion Notes List

**Story 1.2: Configure Frontend Development Environment - COMPLETED**

**Implementation Summary:**
Successfully configured the Vue 3 frontend development environment with all required dependencies, TypeScript strict mode, ESLint, and Tailwind CSS integration.

**Key Accomplishments:**
1. ✅ All frontend dependencies installed and verified:
   - Vue 3.5.26, Vue Router 4.6.4, Pinia 2.3.1
   - Axios 1.13.2, Chart.js 4.5.1, vue-chartjs 5.3.3, Zod 3.25.76
   - TypeScript 5.7.3 (matches backend version), Vite 6.4.1, Tailwind CSS 3.4.19

2. ✅ TypeScript configuration fixed:
   - Fixed TypeScript version inconsistency (5.9.3 → 5.7.3) to match backend
   - Removed incompatible compiler options (erasableSyntaxOnly, noUncheckedSideEffectImports)
   - Replaced @vue/tsconfig extension with explicit configuration for TypeScript 5.7.3 compatibility
   - Confirmed strict mode enabled across all tsconfig files
   - Build succeeds with `npm run build`

3. ✅ ESLint configured for Vue 3 + TypeScript:
   - Installed eslint@9.39.2, @typescript-eslint plugins, eslint-plugin-vue, typescript-eslint
   - Created eslint.config.js using ESLint 9 flat config format
   - Configured vue-eslint-parser for Vue SFC parsing with TypeScript support
   - ESLint runs without errors on all source files

4. ✅ Tailwind CSS verified (from Story 1.1):
   - tailwind.config.js with proper content paths
   - postcss.config.js with tailwindcss and autoprefixer
   - @tailwind directives in src/style.css
   - CSS builds successfully with Tailwind utilities

5. ✅ Environment variables configured:
   - Created frontend/.env.example documenting VITE_API_URL
   - Documented default value: http://localhost:3000
   - Included notes about VITE_ prefix requirement

6. ✅ Development server and build process verified:
   - Dev server starts on port 5173
   - Production build succeeds (dist/ created with optimized assets)
   - Vite HMR working
   - All Tailwind CSS styles applied correctly

**Critical Fixes Applied:**
- **TypeScript Version Mismatch:** Fixed frontend TypeScript 5.9.3 → 5.7.3 to match backend. Required clean reinstall of all npm workspaces from root.
- **tsconfig.app.json Incompatibility:** Removed @vue/tsconfig extension and used explicit configuration compatible with TypeScript 5.7.3
- **Removed Invalid Compiler Options:** erasableSyntaxOnly and noUncheckedSideEffectImports are not valid in TypeScript 5.7.x
- **ESLint Flat Config:** Used ESLint 9 flat config format with vue-eslint-parser for proper Vue SFC parsing

**Files Modified:**
- frontend/package.json (TypeScript version corrected to ~5.7.0)
- frontend/tsconfig.app.json (removed @vue/tsconfig extension, explicit config)
- frontend/tsconfig.node.json (removed invalid compiler options)
- frontend/eslint.config.js (created - ESLint 9 flat config)
- frontend/.env.example (created)

**Testing Results:**
- `npm install`: ✅ All dependencies installed successfully
- `npm run build`: ✅ Production build succeeds
- `npm run dev`: ✅ Dev server starts on port 5173
- `npx eslint src/`: ✅ No errors
- TypeScript compilation: ✅ All files compile with strict mode
- Tailwind CSS: ✅ Styles processed and applied

**Acceptance Criteria Verification:**
- ✅ Vue 3 project with Vite using vue-ts template
- ✅ Tailwind CSS installed with tailwind.config.js and postcss.config.js
- ✅ TypeScript configured with strict mode enabled
- ✅ ESLint configured for Vue 3 and TypeScript
- ✅ `npm run dev` starts Vite dev server on port 5173
- ✅ Default Vue app renders with Tailwind CSS styles
- ✅ .env.example documents VITE_API_URL

**Code Review Fixes Applied:**
- **Git Hygiene:** Added *.tsbuildinfo to .gitignore to prevent build artifacts from being tracked
- **Documentation:** Updated File List to include sprint-status.yaml and .gitignore modifications
- **HMR Note:** Vite HMR (Hot Module Replacement) works by default - no manual configuration needed

### File List

**Modified:**
- frontend/package.json
- frontend/tsconfig.app.json
- frontend/tsconfig.node.json
- _bmad-output/implementation-artifacts/sprint-status.yaml (status updated to 'review')
- .gitignore (added *.tsbuildinfo)

**Created:**
- frontend/eslint.config.js
- frontend/.env.example

**Verified (from Story 1.1):**
- frontend/tailwind.config.js
- frontend/postcss.config.js
- frontend/src/style.css
- frontend/vite.config.ts
- frontend/tsconfig.json

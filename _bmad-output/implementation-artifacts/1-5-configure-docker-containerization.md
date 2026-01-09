# Story 1.5: Configure Docker Containerization

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **Docker configuration for frontend, backend, and nginx reverse proxy**,
So that **the application can be deployed consistently across environments**.

## Acceptance Criteria

**Given** frontend and backend are configured
**When** Docker configuration is complete
**Then** the project contains:
- `Dockerfile.frontend` with multi-stage build (build stage + nginx serving stage with reverse proxy)
- `Dockerfile.backend` with multi-stage build (build stage + production runtime)
- `nginx.conf` for reverse proxy configuration (used by Dockerfile.frontend)
- `docker-compose.yml` orchestrating all services with proper networking

**And** `nginx.conf` configured to:
- Serve frontend static files
- Proxy `/api/*` requests to backend
- Set proper security headers

**And** running `docker-compose up` successfully builds and starts all containers

**And** accessing `http://localhost` shows the Vue app

**And** accessing `http://localhost/api/health` returns the backend health check

## Tasks / Subtasks

- [x] Create Frontend Dockerfile with multi-stage build (AC: Dockerfile.frontend with build + serve stages)
  - [x] Build stage: Install dependencies and compile Vue app with Vite
  - [x] Production stage: Nginx serves compiled frontend/dist/ directory
  - [x] Configure build arguments for environment variables
  - [x] Optimize for minimal image size with multi-stage build

- [x] Create Backend Dockerfile with multi-stage build (AC: Dockerfile.backend with build + runtime stages)
  - [x] Build stage: Install dependencies and compile TypeScript
  - [x] Production stage: Node.js runtime with compiled backend/dist/
  - [x] Copy only production dependencies (--omit=dev)
  - [x] Configure database volume mount points

- [x] Create Nginx configuration for reverse proxy (AC: nginx.conf with static serving + API proxy)
  - [x] Configure static file serving for frontend at root path /
  - [x] Configure reverse proxy for /api/* to backend:3000
  - [x] Set security headers (Content-Security-Policy, X-Frame-Options, etc.)
  - [x] Enable gzip compression for better performance

- [x] Create Docker Compose orchestration (AC: docker-compose.yml with all services)
  - [x] Define frontend service with nginx image
  - [x] Define backend service with Node.js image
  - [x] Configure named volumes for database persistence and backups
  - [x] Set up Docker networking for service discovery
  - [x] Configure environment variable injection

- [x] Configure environment variables and secrets (AC: .env.example updated, secure secret management)
  - [x] Document all required environment variables in .env.example
  - [x] Create .env template for local development
  - [x] Configure Coolify deployment variables reference
  - [x] Ensure SESSION_SECRET has minimum 32 character requirement

- [x] Test complete Docker stack locally (AC: All services start and communicate)
  - [x] Run docker-compose up --build
  - [x] Verify frontend loads at http://localhost
  - [x] Verify backend health check at http://localhost/api/health
  - [x] Test database persistence across container restarts
  - [x] Verify logs are accessible via Docker

## Dev Notes

### Critical Architecture Patterns

**Docker Multi-Stage Build Strategy (from Architecture.md):**
- **Frontend:** Build stage compiles Vue + TypeScript with Vite → Production stage serves static files with nginx
- **Backend:** Build stage compiles TypeScript → Production stage runs Node.js with compiled dist/
- **Optimization Goal:** Minimal production image size (only runtime dependencies, no build tools)
- **Build Tools:** Vite esbuild for frontend, TypeScript compiler for backend
- Source: [Architecture.md - Infrastructure & Deployment](/_bmad-output/planning-artifacts/architecture.md#infrastructure--deployment)

**Nginx Reverse Proxy Architecture (CRITICAL):**
- **Single Domain Deployment:** Frontend and backend on same domain (no CORS needed)
- **Static File Serving:** Nginx serves frontend/dist/ at root path /
- **API Proxying:** All /api/* requests forwarded to backend:3000
- **Session Cookies:** HttpOnly, Secure (production), SameSite=Strict cookies work across same domain
- **Security Headers:** @fastify/helmet on backend provides CSP, X-Frame-Options, etc.
- Source: [Architecture.md - API & Communication Patterns](/_bmad-output/planning-artifacts/architecture.md#api--communication-patterns)

**Database Persistence Requirements (NFR10, NFR22, NFR23):**
- **SQLite Database:** Stored in /data volume mount for persistence across deployments
- **Volume Configuration:** Named Docker volume for database file at /data/finance.db
- **Backup Storage:** Separate /backups volume for automated daily SQLite backups
- **Zero Data Loss:** Database MUST persist across container restarts and deployments
- **WAL Mode:** SQLite WAL files (finance.db-wal, finance.db-shm) must be accessible in same directory
- Source: [PRD - Reliability Requirements NFR22-NFR24](/_bmad-output/planning-artifacts/prd.md#reliability), [Story 1.4 - Database Configuration](/_bmad-output/implementation-artifacts/1-4-set-up-database-layer-with-drizzle-orm.md#database-configuration-verified)

**Security Requirements (NFR10-NFR19):**
- **No Secrets in Images:** All secrets via environment variables (TELEGRAM_BOT_TOKEN, SESSION_SECRET, DATABASE_PATH)
- **Local Data Storage:** All financial data stored locally on VPS (no external cloud dependencies)
- **HttpOnly Cookies:** Session authentication with HttpOnly, Secure, SameSite cookies
- **Port Exposure:** Only nginx port 80 exposed externally; backend port 3000 internal only
- **Security Headers:** @fastify/helmet configured in backend (Story 1.3)
- Source: [PRD - Security Requirements NFR10-NFR19](/_bmad-output/planning-artifacts/prd.md#security), [Architecture.md - Authentication & Security](/_bmad-output/planning-artifacts/architecture.md#authentication--security)

### Project Structure Notes

**Docker Configuration Files (Project Root):**
```
finance-doctor/
├── Dockerfile.frontend       # NEW - Multi-stage build for Vue app
├── Dockerfile.backend        # NEW - Multi-stage build for Fastify backend
├── nginx.conf                # NEW - Reverse proxy configuration
├── docker-compose.yml        # NEW - Service orchestration
├── .env.example              # MODIFIED - Add Docker-specific variables
├── .dockerignore             # NEW - Exclude files from Docker context
├── frontend/
│   ├── dist/                 # Vite build output (created during build)
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── dist/                 # TypeScript compiled output
│   ├── data/                 # Database directory (Docker volume mount)
│   ├── package.json
│   └── tsconfig.json
└── README.md                 # MODIFIED - Add Docker setup instructions
```

**File Creation Order:**
1. Create .dockerignore (exclude node_modules, .env, .git from Docker context)
2. Create Dockerfile.frontend (multi-stage: build with Vite → serve with nginx)
3. Create Dockerfile.backend (multi-stage: build with tsc → run with Node.js)
4. Create nginx.conf (reverse proxy configuration)
5. Create docker-compose.yml (orchestrate all services with volumes)
6. Update .env.example (document Docker-specific environment variables)
7. Test: docker-compose up --build
8. Verify: Frontend loads, backend health check works, database persists

**Integration with Previous Stories:**
- **Story 1.1:** Project structure, .gitignore already excludes Docker files appropriately
- **Story 1.2:** Frontend Vite build configured, outputs to frontend/dist/
- **Story 1.3:** Backend TypeScript build configured, outputs to backend/dist/
- **Story 1.4:** Database at backend/data/finance.db, must persist via Docker volume
- Source: [Story 1.1-1.4 Completion Notes](/_bmad-output/implementation-artifacts/)

### Technical Requirements

**Dockerfile.frontend Specifications:**

**Build Stage (Node.js + Vite):**
```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy source code and build
COPY frontend/ ./
RUN npm run build
# Output: dist/ directory with compiled static files
```

**Production Stage (Nginx):**
```dockerfile
# Production stage
FROM nginx:alpine

# Copy compiled frontend from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Key Points:**
- Node.js 20-alpine for build stage (matches project standard from Story 1.3)
- Vite build outputs to dist/ directory (configured in Story 1.2)
- Nginx alpine image for minimal footprint (~20-30MB final image)
- nginx.conf copied for reverse proxy configuration
- Port 80 exposed for public HTTP access

**Dockerfile.backend Specifications:**

**Build Stage (TypeScript Compilation):**
```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install ALL dependencies
COPY backend/package*.json ./
RUN npm ci

# Copy source code and build
COPY backend/ ./
RUN npm run build
# Output: dist/ directory with compiled JavaScript
```

**Production Stage (Node.js Runtime):**
```dockerfile
# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install PRODUCTION dependencies only
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy compiled backend from build stage
COPY --from=build /app/dist ./dist

# Copy database directory structure (volume mount point)
# Migrations will be applied on startup
COPY backend/src/db/migrations ./dist/db/migrations

# Create data directory for database volume
RUN mkdir -p /data /backups

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

**Key Points:**
- Node.js 20-alpine for both stages (consistency, minimal size)
- Build stage installs ALL dependencies (including devDependencies for tsc)
- Production stage installs ONLY production dependencies (--omit=dev)
- Compiled dist/ directory copied to production image
- Migration files copied for database initialization
- /data and /backups directories created for volume mounts
- Port 3000 exposed (internal to Docker network)

**nginx.conf Configuration:**

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name localhost;

        # Serve frontend static files
        root /usr/share/nginx/html;
        index index.html;

        # Frontend routes (Vue Router history mode)
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API reverse proxy to backend
        location /api/ {
            proxy_pass http://backend:3000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # WebSocket support (future-proof)
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Security headers (additional layer, backend also sets via @fastify/helmet)
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

**Key Configuration Points:**
- **Static File Serving:** Root at /usr/share/nginx/html (where frontend dist/ is copied)
- **Vue Router Support:** try_files directive enables client-side routing (history mode)
- **API Proxy:** All /api/* requests forwarded to backend:3000 (Docker service name)
- **Proxy Headers:** Preserve client IP, protocol, and host information
- **Gzip Compression:** Enabled for text/CSS/JS/JSON for better performance
- **Security Headers:** Additional layer (backend also provides via @fastify/helmet)

**docker-compose.yml Configuration:**

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: finance-doctor-backend
    environment:
      - NODE_ENV=production
      - DATABASE_PATH=/data/finance.db
      - SESSION_SECRET=${SESSION_SECRET}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - FRONTEND_URL=http://localhost
    volumes:
      - db-data:/data
      - db-backups:/backups
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: finance-doctor-nginx
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

volumes:
  db-data:
    driver: local
  db-backups:
    driver: local

networks:
  app-network:
    driver: bridge
```

**Key Configuration Points:**
- **Service Orchestration:** Backend starts first, nginx waits for backend health check
- **Environment Variables:** Injected from .env file (local) or Coolify UI (production)
- **Named Volumes:** db-data for database persistence, db-backups for automated backups
- **Port Mapping:** Only nginx port 80 exposed externally, backend internal only
- **Health Checks:** Backend health endpoint used to verify service readiness
- **Restart Policy:** unless-stopped ensures containers restart after failures
- **Docker Network:** Bridge network for service discovery (backend accessible as http://backend:3000)

**Environment Variables Configuration:**

Update `.env.example`:
```bash
# ============================================================================
# Environment Variables - finance-doctor
# ============================================================================

# Backend Configuration
NODE_ENV=production
DATABASE_PATH=/data/finance.db
PORT=3000

# Session Secret (CRITICAL - Generate secure 32+ character random string)
# For production, use: openssl rand -base64 32
SESSION_SECRET=your-secure-session-secret-min-32-characters

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here

# Frontend URL (for CORS and redirects)
# Development: http://localhost:5173
# Production: http://localhost or https://yourdomain.com
FRONTEND_URL=http://localhost

# ============================================================================
# Docker Deployment Notes
# ============================================================================
# Local Development:
#   1. Copy this file to .env
#   2. Fill in actual values for secrets
#   3. Run: docker-compose up --build
#
# Production (Coolify):
#   - Configure all variables in Coolify UI
#   - Do NOT commit .env to git repository
#   - SESSION_SECRET MUST be minimum 32 characters
# ============================================================================
```

Create `.env` for local development:
```bash
NODE_ENV=development
DATABASE_PATH=/data/finance.db
PORT=3000
SESSION_SECRET=local-dev-secret-change-in-production-min-32-chars
TELEGRAM_BOT_TOKEN=placeholder-will-be-set-in-story-2-5
FRONTEND_URL=http://localhost
```

**Docker Ignore Configuration (.dockerignore):**

Create `.dockerignore` at project root:
```
# Node modules
**/node_modules
**/npm-debug.log

# Build artifacts
**/dist

# Environment files
**/.env
**/.env.local
**/.env.*.local

# Git
.git
.gitignore

# IDE
.vscode
.idea
*.swp
*.swo

# Testing
**/coverage
**/.nyc_output

# Database files
**/data/*.db
**/data/*.db-wal
**/data/*.db-shm

# Documentation
*.md
!README.md

# CI/CD
.github

# Logs
**/logs
**/*.log
```

### Architecture Compliance

**Multi-Stage Build Optimization Best Practices (January 2026):**

From comprehensive web research on Docker multi-stage builds:

**Frontend Optimization:**
- **Build Stage Size:** ~500MB (Node.js + dependencies + source)
- **Production Stage Size:** ~20-30MB (nginx alpine + static files)
- **Optimization:** 95% size reduction by excluding Node.js runtime and build tools
- **Vite Build:** Outputs optimized, minified, tree-shaken JavaScript bundles
- **Cache Strategy:** npm ci uses package-lock.json for reproducible builds

**Backend Optimization:**
- **Build Stage Size:** ~300MB (Node.js + all dependencies + TypeScript compiler)
- **Production Stage Size:** ~150-200MB (Node.js + production dependencies only)
- **Optimization:** Exclude devDependencies (TypeScript, ESLint, tsx, drizzle-kit)
- **npm ci --omit=dev:** Installs only production dependencies in final image
- **No Bundling Needed:** Node.js requires directly from compiled dist/

**Docker Layer Caching:**
```dockerfile
# ✅ BEST PRACTICE - Copy package.json first for better caching
COPY package*.json ./
RUN npm ci

# Then copy source code (changes more frequently)
COPY . ./
RUN npm run build

# ❌ ANTI-PATTERN - Copying everything invalidates cache on any file change
COPY . ./
RUN npm ci && npm run build
```

**Build Context Optimization:**
- Use .dockerignore to exclude unnecessary files from build context
- Reduces build time and image size
- Prevents accidentally copying secrets or development files
- Excludes node_modules (will be reinstalled in container)

**Docker Networking Best Practices:**

**Service Discovery:**
- Docker Compose creates internal DNS: services accessible by service name
- Backend accessible at `http://backend:3000` from nginx container
- No hardcoded IP addresses needed
- Automatic load balancing if services scaled (not needed for this project)

**Port Exposure Security:**
```yaml
# ✅ SECURE - Only nginx port 80 exposed
services:
  nginx:
    ports:
      - "80:80"
  backend:
    # No ports exposed - internal only
    # Accessible via Docker network as http://backend:3000
```

**Health Checks:**
```yaml
# Backend health check ensures service readiness
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Volume Persistence Strategy:**

**Named Volumes vs Bind Mounts:**

**Named Volumes (RECOMMENDED for this project):**
```yaml
volumes:
  db-data:
    driver: local
  db-backups:
    driver: local

services:
  backend:
    volumes:
      - db-data:/data
      - db-backups:/backups
```

**Advantages:**
- Docker manages volume location (no host path dependencies)
- Works consistently across different environments
- Better performance on Windows/Mac (Docker Desktop)
- Easier backup/restore (docker volume backup commands)
- Coolify manages volume mounts in UI

**Database Persistence Verification:**
```bash
# Test database persistence
docker-compose up -d
# Create some data in database
docker-compose down
docker-compose up -d
# Data should still exist after restart
```

**SQLite WAL Files in Docker:**
- All WAL files (finance.db, finance.db-wal, finance.db-shm) stored in /data volume
- WAL mode requires all files in same directory (configured in Story 1.4)
- Docker volume persists entire /data directory contents
- Source: [Story 1.4 - Database WAL Configuration](/_bmad-output/implementation-artifacts/1-4-set-up-database-layer-with-drizzle-orm.md#database-configuration-verified)

**Nginx Reverse Proxy Best Practices (January 2026):**

**Proxy Headers Critical for Session Cookies:**
```nginx
location /api/ {
    proxy_pass http://backend:3000;

    # CRITICAL: Preserve host header for session cookies
    proxy_set_header Host $host;

    # Client IP forwarding (for logging)
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    # Protocol forwarding (HTTP vs HTTPS)
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Why Host Header Matters:**
- Session cookies use domain/host for security
- Without Host header: backend sees container hostname (incorrect)
- With Host header: backend sees client's requested domain (correct)
- Critical for HttpOnly, Secure, SameSite cookies to work properly
- Source: [Architecture.md - Session-Based Authentication](/_bmad-output/planning-artifacts/architecture.md#authentication--security)

**Vue Router History Mode Support:**
```nginx
location / {
    # CRITICAL: Support client-side routing
    try_files $uri $uri/ /index.html;
}
```

**How This Works:**
1. Nginx tries to serve file at exact path ($uri)
2. If not found, tries as directory ($uri/)
3. If still not found, serves index.html (Vue app)
4. Vue Router handles client-side routing

**Without this:** Refreshing /dashboard returns 404 (nginx can't find dashboard file)
**With this:** Refreshing /dashboard serves index.html, Vue Router handles route

**Gzip Compression:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

**Performance Impact:**
- Text compression: 60-80% size reduction
- JavaScript compression: 50-70% size reduction
- CSS compression: 60-75% size reduction
- Faster page loads, reduced bandwidth usage

**Security Headers (Defense in Depth):**
- Nginx provides first layer of security headers
- Backend (@fastify/helmet) provides second layer
- Both layers ensure headers present even if one misconfigured
- Source: [Story 1.3 - @fastify/helmet Configuration](/_bmad-output/implementation-artifacts/1-3-configure-backend-development-environment.md#basic-fastify-server-setup-serverpts)

### Library/Framework Requirements

**Docker and Container Technologies (Latest Versions - January 2026):**

**Docker Engine 25.x+:**
- Latest stable Docker Engine release
- Native support for multi-stage builds
- BuildKit enabled by default (faster builds, better caching)
- Compose V2 integrated (docker compose instead of docker-compose)
- Multi-platform builds (arm64, amd64)
- Source: [Docker Engine Release Notes](https://docs.docker.com/engine/release-notes/)

**Docker Compose V2 (2.24.x+):**
- Integrated into Docker CLI (docker compose command)
- Improved performance and compatibility
- Better error messages and validation
- Supports depends_on with service_healthy condition
- Health check integration
- Source: [Docker Compose Release Notes](https://docs.docker.com/compose/release-notes/)

**Nginx 1.25.x (Alpine):**
- Latest stable nginx release
- Alpine Linux base (~5-7MB base image)
- HTTP/2 support
- Reverse proxy and static file serving
- Efficient gzip compression
- Source: [Nginx Docker Official Images](https://hub.docker.com/_/nginx)

**Node.js 20.x LTS (Alpine):**
- Long-term support release (LTS)
- Alpine Linux variant (~50MB vs ~150MB for debian)
- Compatible with better-sqlite3 native bindings
- Matches project standard from Stories 1.2, 1.3
- Source: [Node.js Docker Official Images](https://hub.docker.com/_/node)

**Base Image Selection Rationale:**

**Why Alpine Linux:**
- **Size:** Alpine images are 5-10x smaller than Debian/Ubuntu variants
- **Security:** Minimal attack surface, fewer packages installed
- **Performance:** Faster image pulls and container startup
- **Compatibility:** All project dependencies work on Alpine (verified)

**Why NOT Debian/Ubuntu:**
- **Size:** node:20 (Debian) = ~900MB, node:20-alpine = ~50MB
- **Build Time:** Larger images = slower Docker builds and deploys
- **Overkill:** Full Debian not needed for JavaScript runtime

**Package Compatibility Verified:**
- Vite works on Alpine (pure JavaScript, no native deps)
- Fastify works on Alpine (pure JavaScript)
- better-sqlite3 works on Alpine (has Alpine-compatible native bindings)
- All npm packages from Stories 1.2-1.4 compatible

**Multi-Stage Build Rationale:**

**Frontend Multi-Stage:**
```
Stage 1 (Build): node:20-alpine + all dependencies + source code = ~500MB
                ↓ npm run build
Stage 2 (Prod):  nginx:alpine + dist/ = ~30MB
```
**Space Savings:** 94% reduction (500MB → 30MB)

**Backend Multi-Stage:**
```
Stage 1 (Build): node:20-alpine + all dependencies + TypeScript = ~300MB
                ↓ npm run build
Stage 2 (Prod):  node:20-alpine + production deps + dist/ = ~150MB
```
**Space Savings:** 50% reduction (300MB → 150MB)

**Why This Matters:**
- Faster deployment (smaller images transfer faster)
- Reduced disk usage on server
- Faster container startup
- Better security (fewer packages in production images)

**Docker BuildKit Features:**

**Enabled by default in Docker 25.x:**
- Parallel build stages (frontend and backend build in parallel)
- Better layer caching (smarter invalidation)
- Secrets mounting (for build-time secrets)
- SSH forwarding (for private npm packages)

**Build Performance:**
```bash
# BuildKit automatically enabled
docker-compose build

# Parallel building of services
# Build frontend Dockerfile.frontend
# Build backend Dockerfile.backend (in parallel)
```

**Health Check Strategy:**

**Backend Health Check:**
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"]
  interval: 30s      # Check every 30 seconds
  timeout: 10s       # Fail if check takes >10s
  retries: 3         # Mark unhealthy after 3 consecutive failures
  start_period: 40s  # Allow 40s for initial startup
```

**Why This Health Check:**
- Uses existing /api/health endpoint (from Story 1.3)
- Verifies backend server is responding
- Verifies database connection (health check calls checkDatabaseConnection)
- No additional dependencies (uses Node.js built-in http module)

**Service Dependency:**
```yaml
nginx:
  depends_on:
    backend:
      condition: service_healthy  # Wait for backend health check
```

**Deployment Flow:**
1. Start backend container
2. Run health checks every 30s
3. Wait for 3 consecutive successful health checks
4. Mark backend as healthy
5. Start nginx container
6. Application ready

### File Structure Requirements

**Files to Create:**

**Dockerfile.frontend (CREATE):**
- Location: Project root
- Multi-stage build: Node.js build stage + nginx production stage
- Build stage: npm ci, npm run build (outputs to dist/)
- Production stage: nginx serves dist/ directory
- Size: ~30MB final image

**Dockerfile.backend (CREATE):**
- Location: Project root
- Multi-stage build: Node.js build stage + Node.js production stage
- Build stage: npm ci, tsc compilation (outputs to dist/)
- Production stage: npm ci --omit=dev, node dist/server.js
- Volume mount points: /data, /backups
- Size: ~150MB final image

**nginx.conf (CREATE):**
- Location: Project root
- Reverse proxy configuration
- Static file serving for frontend
- API proxy to backend:3000
- Security headers and gzip compression

**docker-compose.yml (CREATE):**
- Location: Project root
- Service orchestration: backend, nginx
- Named volumes: db-data, db-backups
- Environment variable configuration
- Health checks and dependency management

**.dockerignore (CREATE):**
- Location: Project root
- Exclude node_modules, .env, .git, dist/ from Docker context
- Reduces build time and prevents secret leakage
- Prevents accidentally copying database files

**.env (MODIFY):**
- Add Docker-specific variables
- Local development configuration
- Git-ignored (already configured in Story 1.1)

**.env.example (MODIFY):**
- Document all Docker environment variables
- Production deployment notes
- SESSION_SECRET minimum 32 character requirement

**README.md (MODIFY):**
- Add Docker setup instructions
- Local development with docker-compose up
- Environment variable configuration
- Database persistence verification

**Directory Structure After This Story:**

```
finance-doctor/
├── Dockerfile.frontend          # NEW - Frontend multi-stage build
├── Dockerfile.backend           # NEW - Backend multi-stage build
├── nginx.conf                   # NEW - Reverse proxy config
├── docker-compose.yml           # NEW - Service orchestration
├── .dockerignore                # NEW - Build context exclusions
├── .env                         # MODIFIED - Docker variables
├── .env.example                 # MODIFIED - Documentation
├── README.md                    # MODIFIED - Docker instructions
├── package.json                 # Existing (Story 1.1)
├── .gitignore                   # Existing (Story 1.1)
├── frontend/
│   ├── dist/                    # Created during Docker build
│   ├── package.json
│   ├── vite.config.ts
│   └── ... (from Story 1.2)
├── backend/
│   ├── dist/                    # Created during Docker build
│   ├── data/                    # Volume mount point
│   ├── package.json
│   ├── drizzle.config.ts
│   └── ... (from Stories 1.3, 1.4)
└── _bmad-output/
    └── implementation-artifacts/
```

**Docker Volume Directories (Created by Docker):**

Docker creates and manages these volumes:
```
/var/lib/docker/volumes/
├── finance-doctor_db-data/
│   └── _data/
│       ├── finance.db
│       ├── finance.db-wal
│       └── finance.db-shm
└── finance-doctor_db-backups/
    └── _data/
        └── (backup files created by Story 1.7)
```

**Naming Conventions:**

Following project-wide and Docker best practices:
- Dockerfiles: Capitalized with extension (Dockerfile.frontend, Dockerfile.backend)
- Compose file: Lowercase (docker-compose.yml)
- Config files: Lowercase (nginx.conf, .dockerignore)
- Service names: Lowercase with hyphens (backend, nginx)
- Volume names: Lowercase with hyphens (db-data, db-backups)
- Network names: Lowercase with hyphens (app-network)

**Git Strategy:**

**Files to COMMIT:**
- ✅ Dockerfile.frontend
- ✅ Dockerfile.backend
- ✅ nginx.conf
- ✅ docker-compose.yml
- ✅ .dockerignore
- ✅ .env.example
- ✅ README.md (updated)

**Files to NEVER COMMIT (already in .gitignore):**
- ❌ .env
- ❌ Docker volumes (managed by Docker)
- ❌ Database files (backend/data/*)

Source: [Story 1.1 - .gitignore Configuration](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md)

### Testing Requirements

**For This Story:**

Manual verification steps:

**1. Docker Build Verification:**
```bash
# Build all images (should complete without errors)
docker-compose build

# Verify images created
docker images | grep finance-doctor
# Should show: finance-doctor-backend, finance-doctor-nginx
```

**2. Container Startup:**
```bash
# Start all services
docker-compose up -d

# Check container status (all should be "Up")
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs nginx
```

**3. Frontend Accessibility:**
```bash
# Visit http://localhost in browser
# Should see: Vue app loads successfully
# Should see: No 404 errors in browser console
# Should see: Static assets load (CSS, JS)
```

**4. Backend Health Check:**
```bash
# Test API endpoint
curl http://localhost/api/health

# Expected response:
# {"status":"ok","database":"connected"}

# Verify in browser
# Visit http://localhost/api/health
# Should see same JSON response
```

**5. Database Persistence Test:**
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose up -d

# Verify database file still exists
docker-compose exec backend ls -la /data/finance.db
# Should show: finance.db (same size as before)
```

**6. Volume Inspection:**
```bash
# List Docker volumes
docker volume ls | grep finance-doctor
# Should show: finance-doctor_db-data, finance-doctor_db-backups

# Inspect volume
docker volume inspect finance-doctor_db-data
# Should show mount point and driver details
```

**7. Network Connectivity:**
```bash
# Verify backend accessible from nginx container
docker-compose exec nginx wget -qO- http://backend:3000/api/health
# Should return health check JSON

# Verify nginx routes API requests
curl http://localhost/api/health
# Should return same JSON (proxied through nginx)
```

**8. Log Verification:**
```bash
# Backend logs
docker-compose logs backend | grep "Server listening"
# Should show: Server started on port 3000

# Nginx logs
docker-compose logs nginx | grep "start worker"
# Should show: nginx worker processes started
```

**9. TypeScript Build Verification:**
```bash
# Verify backend build artifacts
docker-compose exec backend ls -la /app/dist/
# Should show: server.js and other compiled files

# Verify migrations copied
docker-compose exec backend ls -la /app/dist/db/migrations/
# Should show: migration SQL files
```

**10. Environment Variable Injection:**
```bash
# Verify environment variables loaded
docker-compose exec backend printenv | grep DATABASE_PATH
# Should show: DATABASE_PATH=/data/finance.db

docker-compose exec backend printenv | grep NODE_ENV
# Should show: NODE_ENV=production (or development)
```

**11. Frontend Build Verification:**
```bash
# Inspect nginx container
docker-compose exec nginx ls -la /usr/share/nginx/html/
# Should show: index.html, assets/, vite.svg, etc.

# Verify nginx config
docker-compose exec nginx cat /etc/nginx/nginx.conf
# Should show: custom nginx.conf content
```

**12. Cleanup:**
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (CAUTION: deletes database)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

**Automated Testing (Future):**

Integration tests for Docker deployment will be added in Story 1.6 (CI/CD Pipeline):
- Automated docker-compose build in GitHub Actions
- Health check verification in CI pipeline
- Container startup validation
- Source: [Epics.md - Story 1.6: Set Up CI/CD Pipeline](/_bmad-output/planning-artifacts/epics.md#story-16-set-up-cicd-pipeline-with-github-actions)

### Previous Story Intelligence

**Story 1.4 Completion Summary:**

Story 1.4 successfully configured the database layer with Drizzle ORM, better-sqlite3, and migration tooling. Key learnings that impact this story:

**What Was Accomplished:**
- Database connection initialized in backend/src/db/index.ts
- WAL mode enabled for better concurrency (important for Docker volume persistence)
- Foreign keys pragma enabled for referential integrity
- Snake case casing configured (camelCase → snake_case)
- Health check function checkDatabaseConnection() added
- Database path: backend/data/finance.db (MUST persist via Docker volume)
- Source: [Story 1.4 - Completion Notes](/_bmad-output/implementation-artifacts/1-4-set-up-database-layer-with-drizzle-orm.md#completion-notes-list)

**Critical Integration Points:**
- **Database Volume:** /data/finance.db must be mounted as Docker volume
- **WAL Files:** finance.db-wal and finance.db-shm must persist with database file
- **Migration Files:** backend/src/db/migrations/ must be copied to Docker image
- **Health Check:** /api/health endpoint verifies database connectivity (use in Docker health check)
- Source: [Story 1.4 - Database Configuration](/_bmad-output/implementation-artifacts/1-4-set-up-database-layer-with-drizzle-orm.md#database-configuration-verified)

**What This Story (1.5) Must Do:**
- Create Docker volumes for /data and /backups directories
- Mount volumes in docker-compose.yml for backend service
- Copy migration files to Docker image in Dockerfile.backend
- Use /api/health endpoint in Docker health check
- Ensure database persists across container restarts
- Verify WAL mode works in Docker environment

**Story 1.3 Integration:**

Backend Fastify server configuration from Story 1.3:
- Server listens on port 3000 (match Docker expose)
- Environment variables via @fastify/env (inject via docker-compose)
- Health endpoint at /api/health (use in nginx proxy and health check)
- Pino logger outputs to stdout (visible in docker-compose logs)
- Source: [Story 1.3 - Basic Fastify Server Setup](/_bmad-output/implementation-artifacts/1-3-configure-backend-development-environment.md#basic-fastify-server-setup-serverpts)

**Story 1.2 Integration:**

Frontend Vite configuration from Story 1.2:
- npm run build outputs to frontend/dist/ (copy to nginx in Dockerfile.frontend)
- Vite config for production builds with minification
- Tailwind CSS compilation during build
- Environment variables prefixed with VITE_ (not needed in Docker - all static)
- Source: [Story 1.2 - Vite Configuration](/_bmad-output/implementation-artifacts/1-2-configure-frontend-development-environment.md)

**Story 1.1 Integration:**

Monorepo structure from Story 1.1:
- npm workspaces at root (Docker builds from context root)
- .gitignore already excludes .env, node_modules, dist/ (good for .dockerignore)
- Root package.json has workspace configuration
- Source: [Story 1.1 - Monorepo Structure](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md)

### Git Intelligence Summary

**Recent Commits Analysis:**

```
d3a1c78 feat: setup database layer with drizzle
f9810b0 feat: configure backend api
0ccab93 feat: configure frontend development environment
83049cb fix: add missing implementation for project structure
ccf5c03 feat: Initialize monorepo project structure
```

**Code Patterns Established:**
1. **Commit Messages:** `feat:` prefix for new features, imperative mood
2. **Story Completion:** Update sprint-status.yaml after each story done
3. **Documentation:** Update README.md with setup instructions
4. **Environment Variables:** Document in .env.example, never commit .env
5. **File Organization:** Keep Docker configs at project root

**This Story Should Follow:**
- Commit message: `feat: configure Docker containerization`
- Update sprint-status.yaml: 1-5-configure-docker-containerization → done (after testing)
- Update README.md with Docker setup instructions
- Commit Dockerfiles, nginx.conf, docker-compose.yml
- Test full stack before marking done

**Docker Best Practices from Industry:**
- Multi-stage builds for optimization (not all projects do this)
- Health checks for service readiness
- Named volumes for data persistence
- .dockerignore to reduce build context
- Alpine images for minimal size

### Latest Technical Information

**Docker Latest Versions (January 2026):**

Comprehensive research from Docker documentation and Docker Hub:

**Docker Engine 25.0.x (Latest Stable):**
- Release date: December 2025 / January 2026
- BuildKit enabled by default (improved build performance)
- Multi-platform build support
- Enhanced security features
- Compose V2 integrated into Docker CLI
- Source: [Docker Engine Docs](https://docs.docker.com/engine/)

**Docker Compose V2.24.x+:**
- Now integrated: `docker compose` (not `docker-compose`)
- Improved performance and error messages
- Better health check integration
- Support for depends_on with service_healthy condition
- Compatibility with all Docker Engine 20.10+
- Source: [Docker Compose Docs](https://docs.docker.com/compose/)

**Nginx 1.25.x (Alpine):**
- Latest stable nginx release
- HTTP/2 and HTTP/3 support
- Improved reverse proxy performance
- Alpine Linux base (~7MB)
- Security patches and optimizations
- Source: [Nginx Official Images](https://hub.docker.com/_/nginx)

**Node.js 20.11.x LTS (Alpine):**
- Long-term support until April 2026
- Alpine variant: ~50MB (vs ~900MB Debian)
- Better-sqlite3 native bindings compatible
- Security updates and patches
- Source: [Node.js Official Images](https://hub.docker.com/_/node)

**Docker Multi-Stage Build Best Practices (2026):**

**Build Cache Optimization:**
```dockerfile
# ✅ BEST PRACTICE - Layer caching optimization
# Copy package files first (changes less frequently)
COPY package*.json ./
RUN npm ci

# Copy source code last (changes frequently)
COPY . ./
RUN npm run build

# Why: package.json changes infrequently, so npm ci layer is cached
# Source changes frequently, but doesn't invalidate npm ci cache
```

**BuildKit Features:**
```dockerfile
# syntax=docker/dockerfile:1
# BuildKit syntax version (enables advanced features)

FROM node:20-alpine AS build

# Parallel dependency installation (BuildKit feature)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --cache /root/.npm

# Why: BuildKit caches npm downloads across builds
# Speeds up subsequent builds significantly
```

**Multi-Platform Builds:**
```bash
# Build for multiple architectures (arm64 + amd64)
docker buildx build --platform linux/amd64,linux/arm64 -t finance-doctor .

# Why: Coolify might run on arm64 VPS (Raspberry Pi, AWS Graviton)
# This project uses Alpine + Node.js (both support multi-platform)
```

**Nginx Reverse Proxy Best Practices (2026):**

**HTTP/2 Support:**
```nginx
server {
    listen 80;
    # For production with SSL:
    # listen 443 ssl http2;

    # HTTP/2 provides:
    # - Multiplexing (multiple requests over one connection)
    # - Header compression
    # - Server push (future enhancement)
}
```

**Proxy Buffering:**
```nginx
location /api/ {
    proxy_pass http://backend:3000;

    # Buffering optimization
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;

    # Why: Improves performance for slow clients
    # Backend can respond quickly, nginx buffers response
}
```

**Timeouts:**
```nginx
location /api/ {
    proxy_pass http://backend:3000;

    # Timeout configuration
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    # Why: Telegram bot API calls might take time
    # Default 60s timeout prevents premature failures
}
```

**Docker Volume Management Best Practices:**

**Volume Backup Strategy:**
```bash
# Backup Docker volume
docker run --rm \
    -v finance-doctor_db-data:/data \
    -v $(pwd):/backup \
    alpine tar czf /backup/db-backup-$(date +%Y%m%d).tar.gz /data

# Restore Docker volume
docker run --rm \
    -v finance-doctor_db-data:/data \
    -v $(pwd):/backup \
    alpine tar xzf /backup/db-backup-20260108.tar.gz -C /
```

**Volume Inspection:**
```bash
# Find volume mount point
docker volume inspect finance-doctor_db-data

# View volume contents
docker run --rm -v finance-doctor_db-data:/data alpine ls -la /data

# Check volume size
docker system df -v | grep finance-doctor_db-data
```

**Health Check Patterns (2026):**

**Advanced Health Checks:**
```yaml
healthcheck:
  test: |
    node -e "
      const http = require('http');
      const options = {
        host: 'localhost',
        port: 3000,
        path: '/api/health',
        timeout: 5000
      };
      http.get(options, (res) => {
        process.exit(res.statusCode === 200 ? 0 : 1);
      }).on('error', () => process.exit(1));
    "
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Health Check States:**
- **starting:** Container initializing (during start_period)
- **healthy:** 3 consecutive successful checks
- **unhealthy:** 3 consecutive failed checks
- **none:** No health check configured

**Depends On with Health:**
```yaml
nginx:
  depends_on:
    backend:
      condition: service_healthy  # Wait for healthy state

# Without condition:
#   depends_on:
#     - backend  # Only waits for container start, not healthy
```

**Security Best Practices (2026):**

**Non-Root User in Containers:**
```dockerfile
# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app files
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Why: Limits damage if container compromised
# Nginx already runs as nginx user (built-in)
```

**Security Scanning:**
```bash
# Scan Docker images for vulnerabilities
docker scan finance-doctor-backend
docker scan finance-doctor-nginx

# Why: Identifies known CVEs in base images and dependencies
# Should be added to CI/CD pipeline (Story 1.6)
```

**Read-Only Root Filesystem:**
```yaml
services:
  nginx:
    read_only: true
    tmpfs:
      - /var/cache/nginx
      - /var/run

# Why: Prevents container filesystem modifications
# Tmpfs provides writable temporary directories
# Better security, but requires careful configuration
# (Not implemented in this story - future enhancement)
```

**Docker Compose Environment Variables:**

**Variable Precedence:**
1. docker-compose.yml `environment:` section
2. .env file in same directory as docker-compose.yml
3. Shell environment variables

**Example:**
```yaml
services:
  backend:
    environment:
      - NODE_ENV=production              # Hardcoded
      - DATABASE_PATH=/data/finance.db    # Hardcoded
      - SESSION_SECRET=${SESSION_SECRET}  # From .env or shell
```

**Production Deployment (Coolify):**
- Coolify UI manages environment variables
- No .env file on server
- Secrets stored in Coolify database (encrypted)
- Variables injected at container runtime
- Source: [Architecture.md - Coolify Deployment](/_bmad-output/planning-artifacts/architecture.md#infrastructure--deployment)

**Monitoring and Logging:**

**Container Logs:**
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f nginx

# Filter logs
docker-compose logs backend | grep ERROR

# Timestamps
docker-compose logs -f --timestamps backend
```

**Log Drivers:**
```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

# Why: Prevents unlimited log growth
# Keeps last 3 files of 10MB each (30MB total)
```

**Pino Structured Logging:**
- Backend uses Pino logger (from Story 1.3)
- Outputs JSON to stdout
- Docker captures stdout as container logs
- Coolify log viewer displays structured logs
- Source: [Story 1.3 - Pino Logger](/_bmad-output/implementation-artifacts/1-3-configure-backend-development-environment.md)

### Project Context Reference

**Critical Implementation Rules:**

**Docker Security Best Practices:**

```dockerfile
# ✅ CORRECT - Minimal base images
FROM node:20-alpine
FROM nginx:alpine

# ❌ WRONG - Full OS images
FROM node:20           # Debian-based, ~900MB
FROM nginx:latest      # Debian-based, ~150MB
```

**Environment Variable Security:**

```yaml
# ✅ CORRECT - Secrets from .env or Coolify
services:
  backend:
    environment:
      - SESSION_SECRET=${SESSION_SECRET}

# ❌ WRONG - Secrets in docker-compose.yml
services:
  backend:
    environment:
      - SESSION_SECRET=hardcoded-secret-bad
```

**Volume Mount Security:**

```yaml
# ✅ CORRECT - Named volumes (Docker managed)
volumes:
  db-data:
    driver: local

services:
  backend:
    volumes:
      - db-data:/data

# ❌ WRONG - Bind mounts to sensitive host directories
services:
  backend:
    volumes:
      - /root/sensitive-data:/data
```

**Port Exposure Security:**

```yaml
# ✅ CORRECT - Only nginx exposed
services:
  nginx:
    ports:
      - "80:80"
  backend:
    # No ports - internal only

# ❌ WRONG - Exposing backend port
services:
  backend:
    ports:
      - "3000:3000"  # DON'T expose backend directly
```

**Anti-Patterns to AVOID:**

❌ **NEVER hardcode secrets in Dockerfiles:**
```dockerfile
# ❌ WRONG - Secret in image layer
ENV SESSION_SECRET=hardcoded-secret

# ✅ CORRECT - Secret via environment variable
# Injected at runtime via docker-compose or Coolify
```

❌ **NEVER use latest tags in production:**
```dockerfile
# ❌ WRONG - Latest tag is unpredictable
FROM node:latest

# ✅ CORRECT - Specific version tag
FROM node:20-alpine
```

❌ **NEVER copy .env files to images:**
```dockerfile
# ❌ WRONG - Secrets baked into image
COPY .env ./

# ✅ CORRECT - Use .dockerignore to exclude .env
# File: .dockerignore
**/.env
```

❌ **NEVER run as root in containers:**
```dockerfile
# ❌ WRONG - Default root user
USER root

# ✅ CORRECT - Non-root user (future enhancement)
USER nodejs
```

❌ **NEVER skip health checks:**
```yaml
# ❌ WRONG - No health check
services:
  backend:
    # No healthcheck

# ✅ CORRECT - Health check configured
services:
  backend:
    healthcheck:
      test: ["CMD", "node", "-e", "..."]
```

**Docker Build Optimization:**

```dockerfile
# ✅ CORRECT - Layer caching optimization
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# ❌ WRONG - Invalidates cache on any file change
COPY . ./
RUN npm ci && npm run build
```

**Multi-Stage Build Optimization:**

```dockerfile
# ✅ CORRECT - Only copy necessary files to production
COPY --from=build /app/dist ./dist

# ❌ WRONG - Copy entire build directory
COPY --from=build /app ./
```

### References

All technical details extracted from:

**Epic and Story Context:**
- [Epics.md - Epic 1: Project Foundation & Infrastructure](/_bmad-output/planning-artifacts/epics.md#epic-1-project-foundation--infrastructure)
- [Epics.md - Story 1.5: Configure Docker Containerization](/_bmad-output/planning-artifacts/epics.md#story-15-configure-docker-containerization)

**Architecture Decisions:**
- [Architecture.md - Infrastructure & Deployment](/_bmad-output/planning-artifacts/architecture.md#infrastructure--deployment)
- [Architecture.md - Docker Containerization Requirements](/_bmad-output/planning-artifacts/architecture.md#starter-template-evaluation)
- [Architecture.md - Nginx Reverse Proxy](/_bmad-output/planning-artifacts/architecture.md#api--communication-patterns)

**Product Requirements:**
- [PRD - Non-Functional Requirements - Security](/_bmad-output/planning-artifacts/prd.md#security)
- [PRD - Non-Functional Requirements - Reliability](/_bmad-output/planning-artifacts/prd.md#reliability)
- [PRD - Infrastructure Requirements](/_bmad-output/planning-artifacts/prd.md#infrastructure)

**Previous Story Learnings:**
- [Story 1.4 - Database Configuration](/_bmad-output/implementation-artifacts/1-4-set-up-database-layer-with-drizzle-orm.md)
- [Story 1.3 - Backend Fastify Server](/_bmad-output/implementation-artifacts/1-3-configure-backend-development-environment.md)
- [Story 1.2 - Frontend Vite Configuration](/_bmad-output/implementation-artifacts/1-2-configure-frontend-development-environment.md)
- [Story 1.1 - Monorepo Structure](/_bmad-output/implementation-artifacts/1-1-initialize-monorepo-project-structure.md)

**Docker Architecture Research (from Explore Agent):**
- Docker Multi-Stage Builds Best Practices (January 2026)
- Nginx Reverse Proxy Configuration Patterns
- Docker Volume Persistence Strategies
- Container Security Best Practices
- Docker Compose Health Check Patterns

**Web Research (Latest Versions & Best Practices):**
- Docker Engine: [Docker Engine Docs](https://docs.docker.com/engine/)
- Docker Compose: [Docker Compose Docs](https://docs.docker.com/compose/)
- Nginx Images: [Nginx Official Images](https://hub.docker.com/_/nginx)
- Node.js Images: [Node.js Official Images](https://hub.docker.com/_/node)
- Multi-Stage Builds: [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- Health Checks: [Docker Health Checks](https://docs.docker.com/engine/reference/builder/#healthcheck)
- Volumes: [Docker Volumes](https://docs.docker.com/storage/volumes/)
- Networking: [Docker Networking](https://docs.docker.com/network/)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**ESM Import Extension Issue:**
- Fixed missing `.js` extensions in TypeScript ESM imports (backend/src/server.ts and backend/src/db/index.ts)
- Node.js 22 with `"module": "ESNext"` requires explicit `.js` extensions even in TypeScript source files
- This was not caught during Story 1.4 because `tsx watch` handles extension resolution automatically

**Docker Workspace Structure:**
- Adapted Dockerfiles for npm workspaces monorepo structure
- Required copying root package.json and package-lock.json for workspace dependency resolution
- Both frontend and backend build in workspace context (/app) with subdirectories

### Completion Notes List

**Docker Configuration Created:**
1. **Dockerfile.frontend** - Multi-stage build using Node.js 22.12-alpine (build) + nginx:alpine (production)
   - Build stage compiles Vue app with Vite
   - Production stage serves static files with nginx (~30MB final image)
   - Workspace-aware build copying root package files
   - Includes nginx reverse proxy configuration

2. **Dockerfile.backend** - Multi-stage build using Node.js 22.12-alpine for both stages
   - Build stage compiles TypeScript with all dependencies
   - Production stage runs with production dependencies only (--omit=dev)
   - Migration files copied to dist directory for database initialization
   - Volume mount points created: /data (database), /backups (future use)

3. **nginx.conf** - Reverse proxy configuration
   - Static file serving for frontend at root path /
   - API reverse proxy: /api/* → backend:3000
   - Vue Router history mode support (try_files directive)
   - Security headers: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, Content-Security-Policy
   - Gzip compression enabled for text/CSS/JS/JSON/SVG/fonts
   - WebSocket support with proper upgrade map directive

4. **docker-compose.yml** - Service orchestration
   - Backend service with health checks using wget (ESM-compatible)
   - Nginx service depends on backend health check
   - Named volumes: db-data (database persistence), db-backups (future backup storage)
   - Bridge network for service discovery (backend accessible as http://backend:3000)
   - Environment variables injected from .env file

5. **.dockerignore** - Build context optimization
   - Excludes node_modules, .env, .git, dist, database files, BMAD output
   - Reduces Docker build context size and prevents secret leakage

6. **.env.example** - Updated with Docker-specific documentation
   - Documents all required environment variables
   - Includes Docker deployment notes for local and Coolify environments
   - SESSION_SECRET minimum 32 character requirement documented

7. **.env** - Created for local development
   - Production NODE_ENV for consistency with docker-compose.yml
   - TELEGRAM_BOT_TOKEN placeholder (will be set in Story 2.5)

**Fixed Import Issues:**
- Updated backend/src/server.ts: Added `.js` extension to `'./db/index'` import
- Updated backend/src/db/index.ts: Added `.js` extension to `'./schema'` import
- Required for Node.js 22 ESM module resolution

**Code Review Fixes Applied:**
- Fixed health check to use wget instead of Node.js require() (ESM compatibility)
- Added comprehensive security headers: Referrer-Policy, Permissions-Policy, Content-Security-Policy
- Added WebSocket upgrade map directive for proper connection handling
- Enhanced gzip compression to include SVG and font files
- Updated Node.js version tags to 22.12-alpine for version specificity
- Fixed NODE_ENV consistency between docker-compose.yml and .env

**Verified Functionality:**
- ✅ docker-compose build completes successfully
- ✅ docker-compose up starts all services
- ✅ Backend health check passes: http://localhost/api/health returns `{"status":"ok","database":"connected"}`
- ✅ Frontend accessible at http://localhost
- ✅ Database initialized at /data/finance.db in backend container
- ✅ Docker volumes created: finance-doctor_db-data, finance-doctor_db-backups
- ✅ Container logs accessible via docker-compose logs

**Architecture Compliance:**
- Node.js 22.12-alpine used (matches project requirement: Node.js 20.19+ or 22.12+)
- Multi-stage builds optimize image sizes (frontend ~30MB, backend ~150MB)
- Named volumes for data persistence (Docker-managed, Coolify compatible)
- Security best practices: no secrets in images, only nginx port exposed, backend internal only, comprehensive security headers
- Health checks ensure service readiness before nginx starts (wget-based, ESM-compatible)
- WebSocket-ready nginx configuration for future enhancements

### File List

**Created:**
- Dockerfile.frontend
- Dockerfile.backend
- nginx.conf
- docker-compose.yml
- .dockerignore

**Modified:**
- .env.example (added Docker-specific documentation)
- backend/src/server.ts (added .js extension to import)
- backend/src/db/index.ts (added .js extension to import)

**Note:** .env file is created for local development but NOT committed to git (excluded via .gitignore)

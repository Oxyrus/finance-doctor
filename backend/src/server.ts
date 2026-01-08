import Fastify from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import env from '@fastify/env'
import { initializeDatabase, checkDatabaseConnection } from './db/index'

interface EnvConfig {
  PORT: number
  DATABASE_PATH: string
  SESSION_SECRET: string
  TELEGRAM_BOT_TOKEN: string
  NODE_ENV: string
  FRONTEND_URL: string
}

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvConfig
  }
}

const schema = {
  type: 'object',
  required: ['PORT'],
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
    },
    NODE_ENV: {
      type: 'string',
      default: 'development'
    },
    FRONTEND_URL: {
      type: 'string',
      default: 'http://localhost:5173'
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

// Register environment variable validation first
await fastify.register(env, { schema, dotenv: true })

// Initialize database connection
const dbPath = fastify.config.DATABASE_PATH || './data/finance.db'
initializeDatabase(dbPath)
fastify.log.info(`Database initialized at ${dbPath}`)

// Register plugins
await fastify.register(helmet)
await fastify.register(cors, {
  origin: fastify.config.FRONTEND_URL
})

// Health check endpoint
fastify.get('/api/health', async (_request, _reply) => {
  const isDatabaseHealthy = checkDatabaseConnection()
  return {
    status: isDatabaseHealthy ? 'ok' : 'degraded',
    database: isDatabaseHealthy ? 'connected' : 'disconnected'
  }
})

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: fastify.config.PORT,
      host: '0.0.0.0'
    })
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()

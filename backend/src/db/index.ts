// backend/src/db/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from './schema';

// ============================================================================
// DATABASE CONNECTION INITIALIZATION
// ============================================================================
// This module initializes the SQLite database connection using better-sqlite3
// and Drizzle ORM with optimized settings for the finance-doctor application.
//
// CRITICAL CONFIGURATION:
// - WAL mode: Better concurrency for reads/writes
// - Foreign keys: MUST be enabled for relational integrity
// - Snake case: Auto-converts camelCase to snake_case
// - Synchronous: better-sqlite3 is fully synchronous (no async/await needed)
// ============================================================================

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function initializeDatabase(dbPath: string) {
  // Create SQLite connection
  const sqlite = new Database(dbPath);

  // Enable Write-Ahead Logging for better concurrency
  // Critical for multi-device access and Telegram bot + web app writes
  sqlite.pragma('journal_mode = WAL');

  // Enable foreign key enforcement (NOT enabled by default in SQLite)
  // Critical for maintaining data integrity between tables
  sqlite.pragma('foreign_keys = ON');

  // Set synchronous mode to NORMAL for balance between safety and performance
  // This is the default for better-sqlite3 with WAL mode
  sqlite.pragma('synchronous = NORMAL');

  // Create Drizzle instance with automatic camelCase → snake_case conversion
  dbInstance = drizzle(sqlite, {
    schema,
    casing: 'snake_case', // CRITICAL: firstName → first_name
  });

  return dbInstance;
}

export function getDatabase() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
}

export function closeDatabase() {
  // better-sqlite3 will close automatically on process exit
  // But we set instance to null to allow re-initialization if needed
  dbInstance = null;
}

// Health check helper for API endpoint
export function checkDatabaseConnection(): boolean {
  try {
    const db = getDatabase();
    // Simple query to verify connection is alive
    db.get(sql`SELECT 1`);
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Export types for use in other modules
export type Database = NonNullable<typeof dbInstance>;

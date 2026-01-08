// backend/src/db/schema.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// ============================================================================
// DATABASE SCHEMA
// ============================================================================
// This file defines all database tables using Drizzle ORM.
//
// CRITICAL CONVENTIONS:
// - Define properties in camelCase (e.g., userId, firstName)
// - Drizzle auto-converts to snake_case in database (user_id, first_name)
// - Always export table definitions and type inference
//
// TABLE DEFINITIONS ADDED BY FEATURE STORIES:
// - Story 2.1: users, sessions, categories tables
// - Story 3.1: expenses table
// ============================================================================

// Placeholder - actual table definitions will be added in future stories

// Type inference helpers for future use
// export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;

import { defineConfig } from "drizzle-kit";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './shared/schema';
import { supabaseServiceRoleKey } from './config';

if (!process.env.SUPABASE_URL || !supabaseServiceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Did you forget to configure Supabase?');
}

const sql = postgres(process.env.SUPABASE_URL, {
  max: 1,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  token: supabaseServiceRoleKey
});

export const db = drizzle(sql, { schema });

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: db,
});

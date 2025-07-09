import { defineConfig } from "drizzle-kit";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './shared/schema';
import { supabaseServiceRoleKey } from './config';

const sql = postgres('postgresql://postgres:PWk3aaHXMxSbMbK1@db.mwtenoalqvadgcmyszqe.supabase.co:5432/postgres', {
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

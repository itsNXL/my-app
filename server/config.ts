export const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dGVub2FscXZhZGdjbXlzenFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjAxNDYwMiwiZXhwIjoyMDY3NTkwNjAyfQ.5a8gK66zXx9meZqxhu5YGMoMmy4k5SCpVkJi8ubnan0';
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dGVub2FscXZhZGdjbXlzenFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjAxNDYwMiwiZXhwIjoyMDY3NTkwNjAyfQ.5a8gK66zXx9meZqxhu5YGMoMmy4k5SCpVkJi8ubnan0';

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY must be set');
}

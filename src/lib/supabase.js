// Supabase client — primary database and auth provider.
// Credentials are loaded from .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Returns null when credentials are not yet configured,
// so the app still works offline via localStorage.

export const supabase =
  supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project")
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const isSupabaseConfigured = !!supabase;

/* ─── Supabase SQL schema (run once in Supabase SQL editor) ──────────────────

create table if not exists tasks (
  id          text primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  description text default '',
  priority    text default 'medium',
  categories  text[] default '{}',
  due_date    date,
  completed   boolean default false,
  "order"     integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Row-level security: users can only access their own tasks
alter table tasks enable row level security;

create policy "Users can manage their own tasks"
  on tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

──────────────────────────────────────────────────────────────────────────── */

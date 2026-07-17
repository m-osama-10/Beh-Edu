/**
 * Supabase clients for client and server components.
 *
 * - `supabaseBrowser` — use in 'use client' components (auth, real-time, etc.)
 * - `createServerClient` — use in Server Components / API routes (cookies, RLS bypass via service role)
 *
 * Auth flow:
 * - signUp(email, password, { name, role }) → creates user in Supabase Auth
 * - On signup, a DB trigger inserts a row in `users` + `teachers`/`students` table
 * - signInWithPassword returns session → stored in HTTP-only cookies
 * - getSession() reads current session from cookies (SSR-safe)
 */
import { createBrowserClient } from "@supabase/ssr";
import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** Browser client — uses publishable (anon) key. RLS applies. */
export const supabaseBrowser = createBrowserClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);

/**
 * Server client bound to the request's cookies (for SSR session retrieval).
 * Use in Server Components or Server Actions. RLS applies.
 */
export async function getServerSupabase() {
  const cookieStore = await cookies();
  return createSSRServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // Safe to ignore if you have middleware refreshing sessions.
          }
        },
      },
    },
  );
}

/**
 * Admin client using service-role key — bypasses RLS.
 * Use ONLY in trusted server-side code (API routes, server actions, scripts).
 * NEVER expose this to the client.
 *
 * NOTE: The service_role key is REQUIRED for this to work. Without it,
 * all write operations (creating courses, sections, lessons, etc.) will fail
 * because RLS policies restrict writes to authenticated Supabase Auth users only.
 *
 * To get your service_role key:
 *   1. Go to https://supabase.com/dashboard/project/towfnhenuhjflkkgbagi/settings/api
 *   2. Copy the "service_role" secret key (NOT the anon/publishable key)
 *   3. Add it to your .env file as SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."
 *   4. Add it to Vercel environment variables as well
 */
import { createClient } from "@supabase/supabase-js";

export function getAdminSupabase() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your .env file (get it from Supabase Dashboard → Settings → API → service_role key).",
    );
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** Helper: returns the current session user, or null. */
export async function getCurrentUser() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch the matching row from public.users (with role, status, name, avatar)
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

/** Helper: require an authenticated user, or return null + redirect target. */
export async function requireUser() {
  const user = await getCurrentUser();
  return user;
}

/** Helper: require an authenticated user with a specific role. */
export async function requireRole(role: "ADMIN" | "TEACHER" | "STUDENT") {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "unauthenticated" as const };
  if (user.role !== role) return { user, error: "forbidden" as const };
  return { user, error: null };
}

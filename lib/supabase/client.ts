import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/config";
import type { Database } from "@/types/supabase";

export function createClient() {
  const env = getSupabaseEnv();

  if (!env) {
    return null;
  }

  return createBrowserClient<Database>(
    env.url,
    env.anonKey
  );
}

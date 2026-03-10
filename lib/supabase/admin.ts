import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminEnv } from "@/lib/supabase/config";
import type { Database } from "@/types/supabase";

export function createAdminClient() {
  const env = getSupabaseAdminEnv();

  if (!env) {
    return null;
  }

  return createClient<Database>(env.url, env.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

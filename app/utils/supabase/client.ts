import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "~/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    window.ENV.SUPABASE_URL!,
    window.ENV.SUPABASE_ANON_KEY!
  );
}


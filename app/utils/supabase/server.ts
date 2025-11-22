import {
    createServerClient,
    parseCookieHeader,
    serializeCookieHeader,
} from "@supabase/ssr";
import type { Database } from "~/types/database";

export function createClient(request: Request) {
  const cookies = parseCookieHeader(request.headers.get("Cookie") ?? "");
  const headers = new Headers();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies
            .filter((cookie) => cookie.value !== undefined)
            .map((cookie) => ({
              name: cookie.name,
              value: cookie.value as string,
            }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append("Set-Cookie", serializeCookieHeader(name, value, options))
          );
        },
      },
    }
  );

  return { supabase, headers };
}
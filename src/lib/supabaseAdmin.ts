import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "videos";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl) {
    throw new Error("Falta SUPABASE_URL en las variables de Railway.");
  }

  if (!apiKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en las variables de Railway.");
  }

  // Supabase's new sb_secret_* keys are opaque API keys, not JWTs.
  // Storage must receive them through `apikey`; sending an sb_secret_* value
  // as `Authorization: Bearer ...` can make Storage try to verify it as a JWT
  // and return "signature verification failed".
  const isSecretKey = apiKey.startsWith("sb_secret_");

  const customFetch: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);

    if (isSecretKey) {
      headers.set("apikey", apiKey);
      headers.delete("Authorization");
    }

    return fetch(input, {
      ...init,
      headers,
    });
  };

  client = createClient(supabaseUrl, apiKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: customFetch,
    },
  });

  return client;
}

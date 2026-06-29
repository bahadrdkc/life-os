import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server Component / Server Action / Route Handler tarafı Supabase istemcisi.
// Cookie'ler üzerinden oturumu okur ve tazeler.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            // Server Component içinden set çağrılırsa hata atar; middleware
            // oturumu zaten tazelediği için burada yutmak güvenli.
          }
        },
      },
    },
  );
}

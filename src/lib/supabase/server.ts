import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    const allHelpers = cookieStore.getAll();
                    // Log cookies for debugging (filtering out sensitive values if needed in prod, but helpful here)
                    console.log('[Server] Cookies present:', allHelpers.map(c => c.name));
                    console.log('[Server] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
                    return allHelpers;
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            if (value) {
                                cookieStore.set(name, value, options);
                            }
                        });
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        }
    );

    return supabase;
}

"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

    console.log("[signIn] Starting sign-in for:", email);
    console.log("[signIn] isProduction:", isProduction);

    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    const all = cookieStore.getAll();
                    console.log("[signIn] getAll called, cookies:", all.map(c => c.name));
                    return all;
                },
                setAll(cookiesToSet) {
                    console.log("[signIn] setAll called with cookies:", cookiesToSet.map(c => c.name));
                    cookiesToSet.forEach(({ name, value, options }) => {
                        console.log("[signIn] Setting cookie:", name);
                        cookieStore.set(name, value, {
                            ...options,
                            path: "/",
                            sameSite: "lax",
                            secure: isProduction,
                            httpOnly: true,
                        });
                    });
                },
            },
        }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    console.log("[signIn] Auth result - User:", data?.user?.email || "null", "Error:", error?.message || "none");

    if (error) {
        return { error: error.message };
    }

    console.log("[signIn] Success! Returning redirectTo:", redirectTo);
    return { success: true, redirectTo };
}

export async function signUp(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, {
                            ...options,
                            path: "/",
                            sameSite: "lax",
                            secure: isProduction,
                            httpOnly: true,
                        })
                    );
                },
            },
        }
    );

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, message: "Check your email for verification link" };
}


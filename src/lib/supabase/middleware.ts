import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('[Middleware] Path:', request.nextUrl.pathname);
    console.log('[Middleware] Supabase URL exists:', !!supabaseUrl);
    console.log('[Middleware] Supabase Key exists:', !!supabaseKey);
    console.log('[Middleware] Cookies:', request.cookies.getAll().map(c => c.name));

    if (!supabaseUrl || !supabaseKey) {
        console.error('[Middleware] Missing Supabase environment variables!');
        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        if (value) {
                            request.cookies.set(name, value);
                            response.cookies.set(name, value, options);
                        }
                    });
                },
            },
        }
    );

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    console.log('[Middleware] User exists:', !!user);
    console.log('[Middleware] Auth error:', error?.message || 'none');

    const protectedPaths = [
        "/dashboard",
        "/sessions",
        "/my-decks",
        "/progress",
        "/timer",
        "/profile",
        "/settings",
        "/reports",
        "/goals",
        "/achievements",
    ];

    const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedPath && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/sign-in";
        url.searchParams.set("redirectTo", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    const authPaths = ["/sign-in", "/sign-up"];
    const isAuthPath = authPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isAuthPath && user) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return response;
}


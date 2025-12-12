import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const supabase = await createServerClient();

    await supabase.auth.signOut();

    return NextResponse.redirect(`${requestUrl.origin}/sign-in`);
}

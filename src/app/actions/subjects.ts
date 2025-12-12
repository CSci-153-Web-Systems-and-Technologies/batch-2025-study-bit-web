"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createSubject(name: string, color: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    if (!name || name.trim().length === 0) {
        return { success: false, error: "Subject name is required" };
    }

    const { data, error } = await supabase
        .from("subjects")
        .insert({
            user_id: user.id,
            name: name.trim(),
            color: color || "#06b6d4" // Default to Cyan if missing
        })
        .select()
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/sessions");
    revalidatePath("/dashboard");
    revalidatePath("/reports");

    return { success: true, subject: data };
}

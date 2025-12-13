"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/supabase";

type DistractionType = Database["public"]["Enums"]["distraction_type"];

export async function recordDistraction(
    sessionId: string,
    distractionType: DistractionType,
    durationSeconds?: number,
    notes?: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const { data: session } = await supabase
        .from("study_sessions")
        .select("id, user_id")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single();

    if (!session) {
        return { success: false, error: "Session not found" };
    }

    const { error } = await supabase.from("distraction_events").insert({
        session_id: sessionId,
        user_id: user.id,
        distraction_type: distractionType,
        duration_seconds: durationSeconds || null,
        notes: notes || null,
        occurred_at: new Date().toISOString(),
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/sessions");
    return { success: true };
}

export async function getSessionDistractions(
    sessionId: string
): Promise<Database["public"]["Tables"]["distraction_events"]["Row"][]> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("distraction_events")
        .select("*")
        .eq("session_id", sessionId)
        .eq("user_id", user.id)
        .order("occurred_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

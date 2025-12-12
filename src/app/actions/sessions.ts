"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/supabase";

type StudySession = Database["public"]["Tables"]["study_sessions"]["Row"];

export async function getActiveSession(): Promise<StudySession | null> {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", user.id)
        .is("ended_at", null)
        .order("started_at", { ascending: false })
        .limit(1)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
    }

    return data;
}

export async function startSession(
    subjectId?: string,
    plannedDurationMinutes?: number
): Promise<{ success: boolean; session?: StudySession; error?: string }> {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const existingSession = await getActiveSession();
    if (existingSession) {
        return {
            success: false,
            error: "You already have an active session. End it before starting a new one.",
        };
    }

    const { data, error } = await supabase
        .from("study_sessions")
        .insert({
            user_id: user.id,
            subject_id: subjectId || null,
            started_at: new Date().toISOString(),
            planned_duration_minutes: plannedDurationMinutes || null,
            source: "timer",
            is_completed: false,
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/sessions");
    return { success: true, session: data };
}

export async function endSession(
    sessionId: string,
    focusScore: number,
    honestyScore: number,
    notes?: string
): Promise<{ success: boolean; session?: StudySession; error?: string }> {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const { data: session } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single();

    if (!session) {
        return { success: false, error: "Session not found" };
    }

    const startedAt = new Date(session.started_at);
    const endedAt = new Date();
    const durationMinutes = Math.round(
        (endedAt.getTime() - startedAt.getTime()) / (1000 * 60)
    );

    const { data, error } = await supabase
        .from("study_sessions")
        .update({
            ended_at: endedAt.toISOString(),
            actual_duration_minutes: durationMinutes,
            focus_score: Math.min(100, Math.max(0, focusScore)),
            honesty_score: Math.min(100, Math.max(0, honestyScore)),
            notes: notes || null,
            is_completed: true,
        })
        .eq("id", sessionId)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    if (session.subject_id) {
        await supabase.rpc("update_subject_total_minutes", {
            p_subject_id: session.subject_id,
            p_minutes: durationMinutes,
        }).catch(() => {
            // Ignore RPC errors, we'll update this manually if needed
        });
    }

    revalidatePath("/sessions");
    revalidatePath("/dashboard");
    return { success: true, session: data };
}

export async function cancelSession(
    sessionId: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
        .from("study_sessions")
        .delete()
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .is("is_completed", false);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/sessions");
    return { success: true };
}

export async function getRecentSessions(
    limit: number = 10
): Promise<StudySession[]> {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_completed", true)
        .order("ended_at", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data ?? [];
}

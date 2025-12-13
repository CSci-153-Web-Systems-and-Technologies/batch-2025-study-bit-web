"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { recalculateStreak } from "@/app/actions/streaks";
import type { Database } from "@/types/supabase";

type StudySession = Database["public"]["Tables"]["study_sessions"]["Row"];

export async function createManualSession(formData: {
    subjectId?: string;
    date: string;
    durationMinutes: number;
    notes?: string;
    focusScore?: number;
}): Promise<{ success: boolean; session?: StudySession; error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    if (!formData.date || !formData.durationMinutes) {
        return { success: false, error: "Date and duration are required" };
    }

    if (formData.durationMinutes < 1 || formData.durationMinutes > 1440) {
        return { success: false, error: "Duration must be between 1 and 1440 minutes" };
    }

    const startedAt = new Date(formData.date);
    const endedAt = new Date(startedAt.getTime() + formData.durationMinutes * 60 * 1000);

    const { data, error } = await supabase
        .from("study_sessions")
        .insert({
            user_id: user.id,
            subject_id: formData.subjectId || null,
            started_at: startedAt.toISOString(),
            ended_at: endedAt.toISOString(),
            actual_duration_minutes: formData.durationMinutes,
            focus_score: formData.focusScore ?? 80,
            honesty_score: 100,
            source: "manual",
            notes: formData.notes || null,
            is_completed: true,
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/sessions");
    revalidatePath("/my-decks");
    await recalculateStreak();
    return { success: true, session: data };
}

export async function updateSession(
    sessionId: string,
    updates: {
        subjectId?: string | null;
        durationMinutes?: number;
        notes?: string | null;
        focusScore?: number;
    }
): Promise<{ success: boolean; session?: StudySession; error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const updateData: Record<string, unknown> = {};

    if (updates.subjectId !== undefined) {
        updateData.subject_id = updates.subjectId;
    }
    if (updates.durationMinutes !== undefined) {
        updateData.actual_duration_minutes = updates.durationMinutes;
    }
    if (updates.notes !== undefined) {
        updateData.notes = updates.notes;
    }
    if (updates.focusScore !== undefined) {
        updateData.focus_score = updates.focusScore;
    }

    const { data, error } = await supabase
        .from("study_sessions")
        .update(updateData)
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/sessions");
    revalidatePath("/my-decks");
    await recalculateStreak();
    return { success: true, session: data };
}

export async function deleteSession(
    sessionId: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
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
        .eq("user_id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/sessions");
    revalidatePath("/my-decks");
    await recalculateStreak();
    return { success: true };
}

export async function getSessionsWithSubjects(
    limit: number = 50
): Promise<
    Array<StudySession & { subjects: { name: string; color: string } | null }>
> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("study_sessions")
        .select("*, subjects(name, color)")
        .eq("user_id", user.id)
        .eq("is_completed", true)
        .order("started_at", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data ?? [];
}

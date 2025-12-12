import { createServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type StudySession = Database["public"]["Tables"]["study_sessions"]["Row"];
type StudySessionInsert = Database["public"]["Tables"]["study_sessions"]["Insert"];
type StudySessionUpdate = Database["public"]["Tables"]["study_sessions"]["Update"];

export async function getSessions(limit = 50): Promise<StudySession[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data ?? [];
}

export async function getSessionsByDateRange(
    startDate: string,
    endDate: string
): Promise<StudySession[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .gte("started_at", startDate)
        .lte("started_at", endDate)
        .order("started_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function getSessionById(id: string): Promise<StudySession | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
    }
    return data;
}

export async function createSession(
    session: Omit<StudySessionInsert, "user_id">
): Promise<StudySession> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("study_sessions")
        .insert({ ...session, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateSession(
    id: string,
    updates: StudySessionUpdate
): Promise<StudySession> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("study_sessions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function completeSession(
    id: string,
    focusScore: number,
    honestyScore: number
): Promise<StudySession> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("study_sessions")
        .update({
            ended_at: new Date().toISOString(),
            is_completed: true,
            focus_score: focusScore,
            honesty_score: honestyScore,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteSession(id: string): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase
        .from("study_sessions")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export async function getTodaysTotalMinutes(): Promise<number> {
    const supabase = await createServerClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from("study_sessions")
        .select("actual_duration_minutes")
        .gte("started_at", today.toISOString())
        .eq("is_completed", true);

    if (error) throw error;

    return (data ?? []).reduce(
        (sum, session) => sum + (session.actual_duration_minutes ?? 0),
        0
    );
}

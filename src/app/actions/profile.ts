"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

interface UpdateProfileData {
    fullName?: string;
    avatarUrl?: string;
    coverUrl?: string;
    timezone?: string;
    dailyGoalMinutes?: number;
    preferredSessionDuration?: number;
}

export async function updateProfile(data: UpdateProfileData) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString()
    };

    if (data.fullName !== undefined) updates.full_name = data.fullName;
    if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl;
    if (data.coverUrl !== undefined) updates.cover_url = data.coverUrl;
    if (data.timezone !== undefined) updates.timezone = data.timezone;
    if (data.dailyGoalMinutes !== undefined) updates.daily_goal_minutes = data.dailyGoalMinutes;
    if (data.preferredSessionDuration !== undefined) updates.preferred_session_duration = data.preferredSessionDuration;

    const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/sessions");

    return { success: true };
}

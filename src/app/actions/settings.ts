"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: {
    fullName?: string;
    dailyGoalMinutes?: number;
    penaltyMode?: "none" | "pause_timer" | "streak_debit";
}): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const updateData: Record<string, unknown> = {};
    if (formData.fullName !== undefined) updateData.full_name = formData.fullName;
    if (formData.dailyGoalMinutes !== undefined) updateData.daily_goal_minutes = formData.dailyGoalMinutes;
    if (formData.penaltyMode !== undefined) updateData.penalty_mode = formData.penaltyMode;

    const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/settings");
    return { success: true };
}

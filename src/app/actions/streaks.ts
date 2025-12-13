"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateStreak } from "@/lib/streaks/calculateStreak";
import { revalidatePath } from "next/cache";
import { checkAchievements } from "@/app/actions/achievements";

export async function recalculateStreak() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Not authenticated" };

    try {
        // Fetch valid sessions
        // We consider any completed session as valid for streak for now
        const { data: sessions, error: fetchError } = await supabase
            .from("study_sessions")
            .select("started_at")
            .eq("user_id", user.id)
            .eq("is_completed", true)
            .order("started_at", { ascending: false });

        if (fetchError) throw fetchError;

        const dates = sessions?.map(s => s.started_at) || [];
        const result = calculateStreak(dates);

        // Upsert streak record
        const { error: upsertError } = await supabase
            .from("streaks")
            .upsert({
                user_id: user.id,
                current_streak: result.currentStreak,
                longest_streak: result.longestStreak,
                last_study_date: result.lastStudyDate,
                updated_at: new Date().toISOString()
            }, { onConflict: "user_id" });

        if (upsertError) throw upsertError;

        await checkAchievements();

        revalidatePath("/dashboard");
        revalidatePath("/achievements");

        return { success: true, streak: result };

    } catch (error) {
        console.error("Failed to recalculate streak:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

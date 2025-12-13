"use server";

import { createClient } from "@/lib/supabase/server";
import { ACHIEVEMENT_RULES } from "@/lib/achievements/rules";
import { UserStats } from "@/lib/achievements/types";
import { revalidatePath } from "next/cache";

export async function checkAchievements() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Not authenticated" };

    try {
        // 1. Fetch Stats
        const [streakRes, sessionsRes, goalsRes, existingRes] = await Promise.all([
            supabase.from("streaks").select("*").eq("user_id", user.id).single(),
            supabase.from("study_sessions")
                .select("actual_duration_minutes, focus_score")
                .eq("user_id", user.id)
                .eq("is_completed", true),
            supabase.from("goals")
                .select("id")
                .eq("user_id", user.id)
                .eq("status", "completed"),
            supabase.from("achievements")
                .select("achievement_key")
                .eq("user_id", user.id)
        ]);

        const streakData = streakRes.data;
        const sessions = sessionsRes.data || [];
        const completedGoalsCount = goalsRes.data?.length || 0;
        const existingKeys = new Set(existingRes.data?.map(a => a.achievement_key) || []);

        let totalMinutes = 0;
        let totalFocus = 0;
        let ratedSessions = 0;

        sessions.forEach(s => {
            totalMinutes += s.actual_duration_minutes || 0;
            if (s.focus_score !== null) {
                totalFocus += s.focus_score;
                ratedSessions++;
            }
        });

        const stats: UserStats = {
            currentStreak: streakData?.current_streak || 0,
            longestStreak: streakData?.longest_streak || 0,
            totalMinutes,
            totalSessions: sessions.length,
            completedGoals: completedGoalsCount,
            averageFocusScore: ratedSessions > 0 ? totalFocus / ratedSessions : null
        };

        // 2. Evaluate Rules
        const newAchievements = [];
        for (const rule of ACHIEVEMENT_RULES) {
            if (!existingKeys.has(rule.key) && rule.condition(stats)) {
                newAchievements.push({
                    user_id: user.id,
                    achievement_key: rule.key,
                    category: rule.category,
                    title: rule.title,
                    description: rule.description,
                    icon: rule.icon
                });
            }
        }

        // 3. Insert new achievements
        if (newAchievements.length > 0) {
            const { error } = await supabase.from("achievements").insert(newAchievements);
            if (error) throw error;
            revalidatePath("/achievements");
            revalidatePath("/dashboard");
            return { success: true, newCount: newAchievements.length, achievements: newAchievements };
        }

        return { success: true, newCount: 0 };

    } catch (error) {
        console.error("Error checking achievements:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function getAchievements() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: false });

    return data || [];
}

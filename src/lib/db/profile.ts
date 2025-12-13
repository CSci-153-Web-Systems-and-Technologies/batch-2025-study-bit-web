import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type Streak = Database["public"]["Tables"]["streaks"]["Row"];

export async function getProfile(): Promise<Profile | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
    }
    return data;
}

export async function updateProfile(updates: ProfileUpdate): Promise<Profile> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getStreak(): Promise<Streak | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
    }
    return data;
}

export async function updateStreak(): Promise<Streak> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const streak = await getStreak();
    if (!streak) throw new Error("Streak not found");

    const today = new Date().toISOString().split("T")[0];
    const lastStudy = streak.last_study_date;

    let newCurrentStreak = streak.current_streak;

    if (!lastStudy) {
        newCurrentStreak = 1;
    } else if (lastStudy === today) {
        return streak;
    } else {
        const lastDate = new Date(lastStudy);
        const todayDate = new Date(today);
        const diffDays = Math.floor(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
            newCurrentStreak = streak.current_streak + 1;
        } else {
            newCurrentStreak = 1;
        }
    }

    const newLongestStreak = Math.max(newCurrentStreak, streak.longest_streak);

    const { data, error } = await supabase
        .from("streaks")
        .update({
            current_streak: newCurrentStreak,
            longest_streak: newLongestStreak,
            last_study_date: today,
        })
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

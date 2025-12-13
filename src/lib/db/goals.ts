import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"];
type GoalInsert = Database["public"]["Tables"]["goals"]["Insert"];
type GoalUpdate = Database["public"]["Tables"]["goals"]["Update"];

export async function getActiveGoals(): Promise<Goal[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("status", "active")
        .order("deadline", { ascending: true, nullsFirst: false });

    if (error) throw error;
    return data ?? [];
}

export async function getAllGoals(): Promise<Goal[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function getGoalById(id: string): Promise<Goal | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
    }
    return data;
}

export async function createGoal(goal: Omit<GoalInsert, "user_id">): Promise<Goal> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("goals")
        .insert({ ...goal, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateGoal(id: string, updates: GoalUpdate): Promise<Goal> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("goals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateGoalProgress(id: string, additionalMinutes: number): Promise<Goal> {
    const supabase = await createClient();

    const goal = await getGoalById(id);
    if (!goal) throw new Error("Goal not found");

    const newMinutes = (goal.current_minutes ?? 0) + additionalMinutes;
    const isComplete = newMinutes >= goal.target_minutes;

    const { data, error } = await supabase
        .from("goals")
        .update({
            current_minutes: newMinutes,
            status: isComplete ? "completed" : "active",
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function completeGoal(id: string): Promise<Goal> {
    return updateGoal(id, { status: "completed" });
}

export async function abandonGoal(id: string): Promise<Goal> {
    return updateGoal(id, { status: "abandoned" });
}

export async function deleteGoal(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"];

export async function createGoal(formData: {
    title: string;
    description?: string;
    targetMinutes: number;
    subjectId?: string;
    deadline?: string;
}): Promise<{ success: boolean; goal?: Goal; error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    if (!formData.title || !formData.targetMinutes) {
        return { success: false, error: "Title and target minutes are required" };
    }

    if (formData.targetMinutes < 1) {
        return { success: false, error: "Target must be at least 1 minute" };
    }

    const { data, error } = await supabase
        .from("goals")
        .insert({
            user_id: user.id,
            title: formData.title,
            description: formData.description || null,
            target_minutes: formData.targetMinutes,
            current_minutes: 0,
            subject_id: formData.subjectId || null,
            deadline: formData.deadline || null,
            status: "active",
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/goals");
    return { success: true, goal: data };
}

export async function updateGoal(
    goalId: string,
    updates: {
        title?: string;
        description?: string | null;
        targetMinutes?: number;
        currentMinutes?: number;
        status?: "active" | "completed" | "abandoned";
        deadline?: string | null;
    }
): Promise<{ success: boolean; goal?: Goal; error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const updateData: Record<string, unknown> = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.targetMinutes !== undefined) updateData.target_minutes = updates.targetMinutes;
    if (updates.currentMinutes !== undefined) updateData.current_minutes = updates.currentMinutes;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.deadline !== undefined) updateData.deadline = updates.deadline;

    const { data, error } = await supabase
        .from("goals")
        .update(updateData)
        .eq("id", goalId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/goals");
    return { success: true, goal: data };
}

export async function deleteGoal(
    goalId: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", goalId)
        .eq("user_id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/goals");
    return { success: true };
}

export async function getGoalsWithProgress(): Promise<Goal[]> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function completeGoal(
    goalId: string
): Promise<{ success: boolean; error?: string }> {
    return updateGoal(goalId, { status: "completed" });
}

export async function abandonGoal(
    goalId: string
): Promise<{ success: boolean; error?: string }> {
    return updateGoal(goalId, { status: "abandoned" });
}

import { createServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Subject = Database["public"]["Tables"]["subjects"]["Row"];
type SubjectInsert = Database["public"]["Tables"]["subjects"]["Insert"];
type SubjectUpdate = Database["public"]["Tables"]["subjects"]["Update"];

export async function getSubjects(): Promise<Subject[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("is_archived", false)
        .order("name");

    if (error) throw error;
    return data ?? [];
}

export async function getSubjectById(id: string): Promise<Subject | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
    }
    return data;
}

export async function createSubject(subject: Omit<SubjectInsert, "user_id">): Promise<Subject> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("subjects")
        .insert({ ...subject, user_id: user.id })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateSubject(id: string, updates: SubjectUpdate): Promise<Subject> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("subjects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function archiveSubject(id: string): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase
        .from("subjects")
        .update({ is_archived: true })
        .eq("id", id);

    if (error) throw error;
}

export async function deleteSubject(id: string): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase
        .from("subjects")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

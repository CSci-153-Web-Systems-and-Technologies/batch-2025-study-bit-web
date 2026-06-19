import { createServerClient } from "@/lib/supabase";
import { SettingsForm } from "@/components/SettingsForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Settings",
};

export default async function SettingsPage() {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/sign-in");

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, daily_goal_minutes, penalty_mode")
        .eq("id", user.id)
        .single();

    const defaultProfile = {
        full_name: user.user_metadata?.full_name || "",
        daily_goal_minutes: 120,
        penalty_mode: "pause_timer",
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-4 sm:p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">Settings</h1>
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sm:p-8">
                    <SettingsForm initialProfile={profile || defaultProfile} />
                </div>
            </div>
        </div>
    );
}

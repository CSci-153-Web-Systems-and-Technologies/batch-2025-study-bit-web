import { SessionTimerClient } from "@/components/SessionTimerClient";
import { getSubjects } from "@/lib/db/subjects";
import { getActiveSession } from "@/app/actions/sessions";
import { getStreak } from "@/lib/db/profile";

import { createServerClient } from "@/lib/supabase";

export const metadata = {
    title: "Study Session",
};

export default async function SessionsPage() {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const [subjects, activeSession, profileResult, streak] = await Promise.all([
        getSubjects(),
        getActiveSession(),
        user
            ? supabase
                .from("profiles")
                .select("penalty_mode, daily_goal_minutes")
                .eq("id", user.id)
                .single()
            : Promise.resolve({ data: null }),
        getStreak()
    ]);

    const penaltyMode = profileResult.data?.penalty_mode as "none" | "pause_timer" | "streak_debit" | null;
    const dailyGoalMinutes = profileResult.data?.daily_goal_minutes || 120;

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Study Session
                    </h1>
                    <p className="text-neutral-600">
                        Track your focus time and build consistent study habits
                    </p>
                </div>

                <SessionTimerClient
                    subjects={subjects}
                    initialActiveSession={activeSession}
                    penaltyMode={penaltyMode}
                    dailyGoalMinutes={dailyGoalMinutes}
                    currentStreak={streak?.current_streak || 0}
                />
            </div>
        </div>
    );
}

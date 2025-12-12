import { ACHIEVEMENT_RULES } from "@/lib/achievements/rules";
import { getAchievements } from "@/app/actions/achievements";
import { AchievementCard } from "@/components/AchievementCard";
import { createServerClient } from "@/lib/supabase";

export const metadata = {
    title: "Achievements",
};

export default async function AchievementsPage() {
    const unlocked = await getAchievements();
    const unlockedMap = new Map(unlocked.map(a => [a.achievement_key, a]));

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    let currentStreak = 0;
    let longestStreak = 0;

    if (user) {
        const { data: streakData } = await supabase
            .from("streaks")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (streakData) {
            currentStreak = streakData.current_streak;
            longestStreak = streakData.longest_streak;
        }
    }

    // Sort achievements: unlocked first, then locked
    const sortedRules = [...ACHIEVEMENT_RULES].sort((a, b) => {
        const aUnlocked = unlockedMap.has(a.key);
        const bUnlocked = unlockedMap.has(b.key);
        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return 0; // maintain original order otherwise
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Achievements</h1>
                    <p className="text-neutral-600">Unlock badges by staying consistent.</p>
                </div>

                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-center sm:text-left">
                            <div className="text-amber-100 font-medium mb-1">Current Streak</div>
                            <div className="text-4xl font-bold flex items-center justify-center sm:justify-start gap-2">
                                <span>{currentStreak}</span>
                                <span className="text-2xl opacity-75">days</span>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-white/20 hidden sm:block"></div>
                        <div className="text-center sm:text-left">
                            <div className="text-amber-100 font-medium mb-1">Longest Streak</div>
                            <div className="text-4xl font-bold flex items-center justify-center sm:justify-start gap-2">
                                <span>{longestStreak}</span>
                                <span className="text-2xl opacity-75">days</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Badges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedRules.map(rule => {
                            const unlockedParams = unlockedMap.get(rule.key);
                            return (
                                <AchievementCard
                                    key={rule.key}
                                    title={rule.title}
                                    description={rule.description}
                                    icon={rule.icon}
                                    isUnlocked={!!unlockedParams}
                                    unlockedAt={unlockedParams?.unlocked_at}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

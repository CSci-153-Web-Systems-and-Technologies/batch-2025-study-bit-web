import { createClient } from "@/lib/supabase/server";

export interface DashboardMetrics {
    todayMinutes: number;
    weekMinutes: number;
    monthMinutes: number;
    todaySessions: number;
    weekSessions: number;
    currentStreak: number;
    longestStreak: number;
    averageFocusScore: number | null;
    averageHonestyScore: number | null;
    activeGoals: number;
    completedGoals: number;
    last7Days: { date: string; minutes: number }[];
}

function getStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getStartOfMonth(date: Date): Date {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            todayMinutes: 0,
            weekMinutes: 0,
            monthMinutes: 0,
            todaySessions: 0,
            weekSessions: 0,
            currentStreak: 0,
            longestStreak: 0,
            averageFocusScore: null,
            averageHonestyScore: null,
            activeGoals: 0,
            completedGoals: 0,
            last7Days: [],
        };
    }

    const now = new Date();
    const todayStart = getStartOfDay(now);
    const weekStart = getStartOfWeek(now);
    const monthStart = getStartOfMonth(now);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [sessionsResult, streakResult, goalsResult] = await Promise.all([
        supabase
            .from("study_sessions")
            .select("started_at, actual_duration_minutes, focus_score, honesty_score")
            .eq("user_id", user.id)
            .eq("is_completed", true)
            .gte("started_at", monthStart.toISOString())
            .order("started_at", { ascending: false }),

        supabase
            .from("streaks")
            .select("current_streak, longest_streak")
            .eq("user_id", user.id)
            .single(),

        supabase
            .from("goals")
            .select("status")
            .eq("user_id", user.id),
    ]);

    const sessions = sessionsResult.data ?? [];
    const streak = streakResult.data;
    const goals = goalsResult.data ?? [];

    let todayMinutes = 0;
    let weekMinutes = 0;
    let monthMinutes = 0;
    let todaySessions = 0;
    let weekSessions = 0;
    let totalFocusScore = 0;
    let focusCount = 0;
    let totalHonestyScore = 0;
    let honestyCount = 0;

    const dailyMinutes: Record<string, number> = {};

    for (let i = 0; i < 7; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        dailyMinutes[key] = 0;
    }

    for (const session of sessions) {
        const sessionDate = new Date(session.started_at);
        const minutes = session.actual_duration_minutes || 0;
        const dateKey = sessionDate.toISOString().split("T")[0];

        monthMinutes += minutes;

        if (sessionDate >= weekStart) {
            weekMinutes += minutes;
            weekSessions++;
        }

        if (sessionDate >= todayStart) {
            todayMinutes += minutes;
            todaySessions++;
        }

        if (dateKey in dailyMinutes) {
            dailyMinutes[dateKey] += minutes;
        }

        if (session.focus_score !== null) {
            totalFocusScore += session.focus_score;
            focusCount++;
        }

        if (session.honesty_score !== null) {
            totalHonestyScore += session.honesty_score;
            honestyCount++;
        }
    }

    const last7Days = Object.entries(dailyMinutes)
        .map(([date, minutes]) => ({ date, minutes }))
        .sort((a, b) => a.date.localeCompare(b.date));

    const activeGoals = goals.filter((g) => g.status === "active").length;
    const completedGoals = goals.filter((g) => g.status === "completed").length;

    return {
        todayMinutes,
        weekMinutes,
        monthMinutes,
        todaySessions,
        weekSessions,
        currentStreak: streak?.current_streak ?? 0,
        longestStreak: streak?.longest_streak ?? 0,
        averageFocusScore: focusCount > 0 ? Math.round(totalFocusScore / focusCount) : null,
        averageHonestyScore: honestyCount > 0 ? Math.round(totalHonestyScore / honestyCount) : null,
        activeGoals,
        completedGoals,
        last7Days,
    };
}

export function formatMinutes(minutes: number): string {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
}

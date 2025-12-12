import { createServerClient } from "@/lib/supabase";
import { ReportData, ChartDataPoint, SubjectDistribution } from "./types";

export async function getReportData(
    userId: string,
    from: Date,
    to: Date,
    subjectIds?: string[]
): Promise<ReportData> {
    const supabase = await createServerClient();

    let query = supabase
        .from("study_sessions")
        .select(`
            id, 
            started_at, 
            actual_duration_minutes, 
            focus_score, 
            honesty_score, 
            subject_id,
            subjects(name, color)
        `)
        .eq("user_id", userId)
        .eq("is_completed", true)
        .gte("started_at", from.toISOString())
        .lte("started_at", to.toISOString());

    if (subjectIds && subjectIds.length > 0) {
        query = query.in("subject_id", subjectIds);
    }

    const { data: sessions, error } = await query;

    if (error) {
        throw error;
    }

    if (!sessions || sessions.length === 0) {
        return {
            totalMinutes: 0,
            totalSessions: 0,
            avgFocus: 0,
            avgHonesty: 0,
            timeline: [],
            subjects: []
        };
    }

    return aggregateReports(sessions as unknown as SessionInput[]);
}

interface SessionInput {
    actual_duration_minutes: number | null;
    focus_score: number | null;
    honesty_score: number | null;
    started_at: string;
    subjects: { name: string; color: string } | { name: string; color: string }[] | null;
}

export function aggregateReports(sessions: SessionInput[]): ReportData {
    let totalMinutes = 0;
    let totalFocus = 0;
    let totalHonesty = 0;
    let focusCount = 0;
    let honestyCount = 0;

    const timelineMap = new Map<string, { minutes: number; focusSum: number; focusCount: number; honestySum: number; honestyCount: number; sessions: number }>();
    const subjectMap = new Map<string, { minutes: number; color: string }>();

    sessions.forEach(session => {
        const minutes = session.actual_duration_minutes || 0;
        totalMinutes += minutes;

        if (session.focus_score !== null) {
            totalFocus += session.focus_score;
            focusCount++;
        }

        if (session.honesty_score !== null) {
            totalHonesty += session.honesty_score;
            honestyCount++;
        }

        // Timeline (Group by Date)
        const dateKey = new Date(session.started_at).toISOString().split("T")[0];
        if (!timelineMap.has(dateKey)) {
            timelineMap.set(dateKey, { minutes: 0, focusSum: 0, focusCount: 0, honestySum: 0, honestyCount: 0, sessions: 0 });
        }
        const dayEntry = timelineMap.get(dateKey)!;
        dayEntry.minutes += minutes;
        dayEntry.sessions++;
        if (session.focus_score !== null) {
            dayEntry.focusSum += session.focus_score;
            dayEntry.focusCount++;
        }
        if (session.honesty_score !== null) {
            dayEntry.honestySum += session.honesty_score;
            dayEntry.honestyCount++;
        }

        // Subject Distribution
        // Supabase returns object for single relation or array for multiple
        const subj = session.subjects;
        const subjObj = Array.isArray(subj) ? subj[0] : subj;

        const subjectName = subjObj ? (subjObj as { name: string }).name : "Uncategorized";
        const subjectColor = subjObj ? (subjObj as { color: string }).color : "#94a3b8"; // slate-400

        if (!subjectMap.has(subjectName)) {
            subjectMap.set(subjectName, { minutes: 0, color: subjectColor });
        }
        subjectMap.get(subjectName)!.minutes += minutes;
    });

    // Formatting Timeline
    const timeline: ChartDataPoint[] = Array.from(timelineMap.entries())
        .map(([date, data]) => ({
            date,
            minutes: data.minutes,
            sessions: data.sessions,
            focus: data.focusCount > 0 ? Math.round(data.focusSum / data.focusCount) : 0,
            honesty: data.honestyCount > 0 ? Math.round(data.honestySum / data.honestyCount) : 0
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Formatting Subjects
    const subjects: SubjectDistribution[] = Array.from(subjectMap.entries())
        .map(([name, data]) => ({
            name,
            color: data.color,
            minutes: data.minutes,
            percentage: totalMinutes > 0 ? Math.round((data.minutes / totalMinutes) * 100) : 0
        }))
        .sort((a, b) => b.minutes - a.minutes); // Descending

    return {
        totalMinutes,
        totalSessions: sessions.length,
        avgFocus: focusCount > 0 ? Math.round(totalFocus / focusCount) : 0,
        avgHonesty: honestyCount > 0 ? Math.round(totalHonesty / honestyCount) : 0,
        timeline,
        subjects
    };
}

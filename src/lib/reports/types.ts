export interface DateRange {
    from: Date;
    to: Date;
}

export type PeriodOption = "week" | "month" | "year" | "custom";

export interface ChartDataPoint {
    date: string; // YYYY-MM-DD
    minutes: number;
    focus: number;
    honesty: number;
    sessions: number;
}

export interface SubjectDistribution {
    [key: string]: string | number;
    name: string;
    color: string;
    minutes: number;
    percentage: number;
}

export interface ReportData {
    totalMinutes: number;
    totalSessions: number;
    avgFocus: number;
    avgHonesty: number;
    timeline: ChartDataPoint[];
    subjects: SubjectDistribution[];
}

import { AchievementRule } from "./types";

export const ACHIEVEMENT_RULES: AchievementRule[] = [
    {
        key: "streak_3",
        category: "streak",
        title: "Heating Up",
        description: "Reach a 3-day study streak",
        icon: "Flame",
        condition: (stats) => stats.longestStreak >= 3
    },
    {
        key: "streak_7",
        category: "streak",
        title: "Week Warrior",
        description: "Reach a 7-day study streak",
        icon: "Zap",
        condition: (stats) => stats.longestStreak >= 7
    },
    {
        key: "streak_30",
        category: "streak",
        title: "Unstoppable",
        description: "Reach a 30-day study streak",
        icon: "Trophy",
        condition: (stats) => stats.longestStreak >= 30
    },
    {
        key: "sessions_10",
        category: "sessions",
        title: "Getting Started",
        description: "Complete 10 study sessions",
        icon: "BookOpen",
        condition: (stats) => stats.totalSessions >= 10
    },
    {
        key: "sessions_100",
        category: "sessions",
        title: "Dedicated Scholar",
        description: "Complete 100 study sessions",
        icon: "Library",
        condition: (stats) => stats.totalSessions >= 100
    },
    {
        key: "hours_10",
        category: "time",
        title: "10 Hour Club",
        description: "Study for 10 total hours",
        icon: "Clock",
        condition: (stats) => stats.totalMinutes >= 600
    },
    {
        key: "focus_master",
        category: "focus",
        title: "Focus Master",
        description: "Maintain >90% average focus (min 5 sessions)",
        icon: "Target",
        condition: (stats) => stats.totalSessions >= 5 && (stats.averageFocusScore || 0) >= 90
    }
];

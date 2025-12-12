export type AchievementCategory = 'streak' | 'time' | 'sessions' | 'focus' | 'milestone';

export interface UserStats {
    currentStreak: number;
    longestStreak: number;
    totalMinutes: number;
    totalSessions: number;
    completedGoals: number;
    averageFocusScore: number | null;
}

export interface AchievementRule {
    key: string;
    category: AchievementCategory;
    title: string;
    description: string;
    icon: string;
    condition: (stats: UserStats) => boolean;
}

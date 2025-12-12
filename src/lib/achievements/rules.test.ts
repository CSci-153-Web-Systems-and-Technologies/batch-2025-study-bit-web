import { ACHIEVEMENT_RULES } from "./rules";
import { UserStats } from "./types";

describe("Achievement Rules", () => {
    const baseStats: UserStats = {
        currentStreak: 0,
        longestStreak: 0,
        totalMinutes: 0,
        totalSessions: 0,
        completedGoals: 0,
        averageFocusScore: 0
    };

    it("evaluates streak achievements", () => {
        const stats: UserStats = { ...baseStats, longestStreak: 7 };

        const streak3 = ACHIEVEMENT_RULES.find(r => r.key === "streak_3")!;
        const streak7 = ACHIEVEMENT_RULES.find(r => r.key === "streak_7")!;
        const streak30 = ACHIEVEMENT_RULES.find(r => r.key === "streak_30")!;

        expect(streak3.condition(stats)).toBe(true);
        expect(streak7.condition(stats)).toBe(true);
        expect(streak30.condition(stats)).toBe(false);
    });

    it("evaluates session achievements", () => {
        const stats: UserStats = { ...baseStats, totalSessions: 50 };

        const sessions10 = ACHIEVEMENT_RULES.find(r => r.key === "sessions_10")!;
        const sessions100 = ACHIEVEMENT_RULES.find(r => r.key === "sessions_100")!;

        expect(sessions10.condition(stats)).toBe(true);
        expect(sessions100.condition(stats)).toBe(false);
    });

    it("evaluates focus achievements", () => {
        const stats: UserStats = { ...baseStats, totalSessions: 10, averageFocusScore: 95 };
        const statsLowFocus: UserStats = { ...baseStats, totalSessions: 10, averageFocusScore: 80 };
        const statsLowSessions: UserStats = { ...baseStats, totalSessions: 2, averageFocusScore: 95 };

        const focusMaster = ACHIEVEMENT_RULES.find(r => r.key === "focus_master")!;

        expect(focusMaster.condition(stats)).toBe(true);
        expect(focusMaster.condition(statsLowFocus)).toBe(false);
        expect(focusMaster.condition(statsLowSessions)).toBe(false);
    });
});

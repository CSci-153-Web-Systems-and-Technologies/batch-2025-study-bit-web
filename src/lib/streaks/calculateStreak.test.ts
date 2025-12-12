import { calculateStreak } from "./calculateStreak";

describe("calculateStreak", () => {
    const today = new Date("2024-01-10T12:00:00Z"); // Wednesday

    it("returns 0 for empty input", () => {
        const result = calculateStreak([], today);
        expect(result.currentStreak).toBe(0);
        expect(result.longestStreak).toBe(0);
        expect(result.lastStudyDate).toBeNull();
    });

    it("returns 1 if studied today", () => {
        const result = calculateStreak(["2024-01-10"], today);
        expect(result.currentStreak).toBe(1);
        expect(result.longestStreak).toBe(1);
        expect(result.lastStudyDate).toBe("2024-01-10");
    });

    it("returns 1 if studied yesterday (and not today)", () => {
        const result = calculateStreak(["2024-01-09"], today);
        expect(result.currentStreak).toBe(1);
        expect(result.longestStreak).toBe(1);
        expect(result.lastStudyDate).toBe("2024-01-09");
    });

    it("returns 0 if last study was 2 days ago", () => {
        const result = calculateStreak(["2024-01-08"], today);
        expect(result.currentStreak).toBe(0);
        expect(result.longestStreak).toBe(1); // Historical achievement
        expect(result.lastStudyDate).toBe("2024-01-08");
    });

    it("calculates multi-day streak (today start)", () => {
        const dates = ["2024-01-10", "2024-01-09", "2024-01-08"];
        const result = calculateStreak(dates, today);
        expect(result.currentStreak).toBe(3);
        expect(result.longestStreak).toBe(3);
    });

    it("calculates multi-day streak (yesterday start)", () => {
        const dates = ["2024-01-09", "2024-01-08", "2024-01-07"]; // No study on 10th
        const result = calculateStreak(dates, today);
        expect(result.currentStreak).toBe(3);
        expect(result.longestStreak).toBe(3);
        expect(result.lastStudyDate).toBe("2024-01-09");
    });

    it("handles gaps correctly", () => {
        // Studied 10th, 9th, GAP (7th), 6th
        const dates = ["2024-01-10", "2024-01-09", "2024-01-07", "2024-01-06"];
        const result = calculateStreak(dates, today);
        expect(result.currentStreak).toBe(2);
        expect(result.longestStreak).toBe(2);
    });

    it("identifies longest streak historically", () => {
        // Studied today (10th) - Streak 1
        // Studied long ago: 1st, 2nd, 3rd, 4th, 5th (Streak 5)
        const dates = [
            "2024-01-10",
            "2024-01-05", "2024-01-04", "2024-01-03", "2024-01-02", "2024-01-01"
        ];
        const result = calculateStreak(dates, today);
        expect(result.currentStreak).toBe(1);
        expect(result.longestStreak).toBe(5);
    });

    it("handles duplicates and unsorted input", () => {
        const dates = ["2024-01-08", "2024-01-10", "2024-01-09", "2024-01-10"];
        const result = calculateStreak(dates, today);
        expect(result.currentStreak).toBe(3);
    });
});

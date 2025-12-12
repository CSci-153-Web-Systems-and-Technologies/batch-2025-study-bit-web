import { aggregateReports } from "./queries";

describe("aggregateReports", () => {
    it("aggregates data correctly", () => {
        const sessions = [
            {
                started_at: "2024-01-01T10:00:00Z",
                actual_duration_minutes: 60,
                focus_score: 80,
                honesty_score: 100,
                subjects: { name: "Math", color: "red" }
            },
            {
                started_at: "2024-01-01T12:00:00Z",
                actual_duration_minutes: 30,
                focus_score: 90,
                honesty_score: 80,
                subjects: { name: "Science", color: "blue" }
            },
            {
                started_at: "2024-01-02T10:00:00Z",
                actual_duration_minutes: 45,
                focus_score: null, // Test nulls
                honesty_score: null,
                subjects: null // Test null subject
            }
        ];

        const result = aggregateReports(sessions);

        expect(result.totalMinutes).toBe(135);
        expect(result.totalSessions).toBe(3);

        // Focus: (80 + 90) / 2 = 85. 3rd session has null.
        expect(result.avgFocus).toBe(85);

        // Honesty: (100 + 80) / 2 = 90.
        expect(result.avgHonesty).toBe(90);

        // Timeline: 2 dates
        expect(result.timeline.length).toBe(2);

        const day1 = result.timeline.find(t => t.date === "2024-01-01");
        expect(day1?.minutes).toBe(90);
        expect(day1?.sessions).toBe(2);
        expect(day1?.focus).toBe(85);

        const day2 = result.timeline.find(t => t.date === "2024-01-02");
        expect(day2?.minutes).toBe(45);
        expect(day2?.focus).toBe(0); // Check fallback

        // Subjects: Math (60), Science (30), Uncategorized (45) -> Sorted: Math(60), Uncat(45), Sci(30)
        expect(result.subjects.length).toBe(3);
        expect(result.subjects[0].name).toBe("Math"); // sorted by minutes (60)
        expect(result.subjects[1].name).toBe("Uncategorized"); // (45)
        expect(result.subjects[2].name).toBe("Science"); // (30)
    });

    it("handles empty sessions", () => {
        const result = aggregateReports([]);
        expect(result.totalMinutes).toBe(0);
    });
});

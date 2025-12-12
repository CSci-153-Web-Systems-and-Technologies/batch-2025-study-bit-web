export interface StreakResult {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string | null; // YYYY-MM-DD
}

/**
 * Calculates the current streak based on session dates.
 * Assumes dates are already normalized to the user's timezone if needed.
 * "Today" checks against the provided reference date.
 */
export function calculateStreak(
    datesInput: (Date | string)[],
    referenceDate: Date = new Date()
): StreakResult {
    // 1. Normalize all dates to YYYY-MM-DD strings to ignore time
    const uniqueDates = new Set<string>();

    datesInput.forEach((d) => {
        const dateObj = typeof d === "string" ? new Date(d) : d;
        if (!isNaN(dateObj.getTime())) {
            uniqueDates.add(dateObj.toISOString().split("T")[0]);
        }
    });

    const sortedDates = Array.from(uniqueDates).sort().reverse(); // Descending
    const todayStr = referenceDate.toISOString().split("T")[0];

    // Create yesterday string
    const yesterday = new Date(referenceDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (sortedDates.length === 0) {
        return { currentStreak: 0, longestStreak: 0, lastStudyDate: null };
    }

    // 2. Determine where streak starts
    // If user studied today, streak starts from today.
    // If user didn't study today but studied yesterday, streak counts from yesterday.
    // If neither, streak is 0.

    let currentStreak = 0;
    const hasStudiedToday = sortedDates.includes(todayStr);
    const hasStudiedYesterday = sortedDates.includes(yesterdayStr);

    // Optimization: Pointer to current date being checked
    const checkDate = new Date(referenceDate);

    // If studied today or yesterday, calculate current streak
    if (hasStudiedToday || hasStudiedYesterday) {
        if (!hasStudiedToday) {
            checkDate.setDate(checkDate.getDate() - 1); // Start checking from yesterday
        }

        // 3. Count consecutive days
        while (true) {
            const checkStr = checkDate.toISOString().split("T")[0];
            if (uniqueDates.has(checkStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1); // Go to previous day
            } else {
                break;
            }
        }
    }

    // 4. Calculate longest streak
    let longestStreak = 0;

    // We need to iterate through all unique dates chronologically or reverse
    // Let's use the sortedDates (descending) but iterate carefully or convert to numeric timestamps for easier gap checking
    // Actually, easiest is to sort ascending for this part.
    const datesAsc = Array.from(uniqueDates).sort(); // Ascending string sort works for YYYY-MM-DD

    if (datesAsc.length > 0) {
        let tempStreak = 1;
        longestStreak = 1; // At least 1 if there's any session

        for (let i = 1; i < datesAsc.length; i++) {
            const prev = new Date(datesAsc[i - 1]);
            const curr = new Date(datesAsc[i]);

            // Calculate diff in days
            const diffTime = Math.abs(curr.getTime() - prev.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }

            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }
        }
    }

    // Ensure longest streak is at least current streak (consistency check)
    longestStreak = Math.max(longestStreak, currentStreak);

    return {
        currentStreak,
        longestStreak,
        lastStudyDate: sortedDates[0]
    };
}

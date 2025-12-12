export interface HonestyResult {
    honestyScore: number;
    honestyImpact: number;
    focusScore: number;
}

export function calculateHonestyImpact(
    selfReportedFocus: number, // 1-100
    isHonest: boolean,
    distractionCount: number,
    sessionDurationMinutes: number
): HonestyResult {
    // Base calculation
    let honestyImpact = 0;
    let honestyScore = 100;

    // 1. Distraction Penalty
    // Each distraction reduces honesty score (system detected vs self-reported check)
    // If user says they were honest but had distractions, big penalty
    if (isHonest) {
        if (distractionCount > 0) {
            // User claimed honesty but was distracted
            // Penalty: -10 score per distraction, capped at -50
            const penalty = Math.min(distractionCount * 10, 50);
            honestyScore -= penalty;
            honestyImpact = -Math.floor(penalty / 2); // Impact is half the score penalty
        } else {
            // User claimed honesty and was not distracted
            // Bonus: +10 impact for clean session (if duration > 15m)
            if (sessionDurationMinutes >= 15) {
                honestyImpact = 10;
            }
        }
    } else {
        // User admitted to being distracted
        // Reward for honesty: We don't penalize the score as much
        honestyScore = 90; // Fixed high score for admitting it
        honestyImpact = 5; // Small bonus for honesty
    }

    // 2. Focus Score Alignment
    // If focus score is high (80+) but distractions existed, slightly lower it
    let adjustedFocusScore = selfReportedFocus;
    if (distractionCount > 0 && selfReportedFocus > 80) {
        adjustedFocusScore = Math.max(selfReportedFocus - (distractionCount * 5), 60);
    }

    return {
        honestyScore: Math.max(0, Math.min(100, honestyScore)),
        honestyImpact,
        focusScore: adjustedFocusScore,
    };
}

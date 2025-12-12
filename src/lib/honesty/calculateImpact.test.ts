import { calculateHonestyImpact } from "./calculateImpact";

describe("calculateHonestyImpact", () => {
    it("should return perfect score for honest, distraction-free session > 15m", () => {
        const result = calculateHonestyImpact(100, true, 0, 25);
        // honestyScore: 100, honestyImpact: 10, focusScore: 100
        if (result.honestyScore !== 100) throw new Error("honestyScore mismatch");
        if (result.honestyImpact !== 10) throw new Error("honestyImpact mismatch");
    });

    it("should penalize score for claimed honesty with distractions", () => {
        const result = calculateHonestyImpact(100, true, 2, 25);
        // Penalty: 2 * 10 = 20. honestyScore = 80. impact = -10.
        if (result.honestyScore !== 80) throw new Error("honestyScore mismatch");
        if (result.honestyImpact !== -10) throw new Error("honestyImpact mismatch");
    });

    it("should cap penalty at 50", () => {
        const result = calculateHonestyImpact(100, true, 10, 25);
        // Penalty: 10 * 10 = 100 -> capped at 50. honestyScore = 50.
        if (result.honestyScore !== 50) throw new Error("honestyScore mismatch");
    });

    it("should reward admitting distractions", () => {
        const result = calculateHonestyImpact(80, false, 5, 25);
        // honestyScore = 90 (fixed reward), impact = 5
        if (result.honestyScore !== 90) throw new Error("honestyScore mismatch");
        if (result.honestyImpact !== 5) throw new Error("honestyImpact mismatch");
    });

    it("should adjust focus score if high focus claimed but distracted", () => {
        const result = calculateHonestyImpact(100, true, 4, 25);
        // Adjusted: 100 - (4*5) = 80.
        if (result.focusScore !== 80) throw new Error("focusScore mismatch: " + result.focusScore);
    });
});

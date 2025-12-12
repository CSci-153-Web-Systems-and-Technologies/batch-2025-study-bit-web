export function getDateRange(period: string): { from: Date; to: Date } {
    const now = new Date();
    const from = new Date();

    // Reset time to end of day? Or just current time?
    // Usually for reports "Last 7 days" implies strict 24h * 7 window or start of day 7 days ago.
    // For simplicity we use current time.

    if (period === 'month') {
        from.setDate(now.getDate() - 30);
    } else if (period === 'year') {
        from.setDate(now.getDate() - 365);
    } else if (period === 'all') {
        from.setTime(0); // Epoch
    } else {
        from.setDate(now.getDate() - 7);
    }

    return { from, to: now };
}

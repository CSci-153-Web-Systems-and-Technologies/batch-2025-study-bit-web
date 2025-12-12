"use client";

interface DashboardChartProps {
    data: { date: string; minutes: number }[];
}

export function DashboardChart({ data }: DashboardChartProps) {
    const maxMinutes = Math.max(...data.map((d) => d.minutes), 1);
    const hasData = data.some((d) => d.minutes > 0);

    if (!hasData) {
        return (
            <div className="bg-white rounded-xl border border-neutral-100 p-6">
                <h3 className="text-sm font-medium text-neutral-500 mb-4">
                    Last 7 Days
                </h3>
                <div className="h-32 flex items-center justify-center text-neutral-400 text-sm">
                    No study sessions yet. Start studying to see your progress!
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-neutral-100 p-6">
            <h3 className="text-sm font-medium text-neutral-500 mb-4">Last 7 Days</h3>
            <div className="flex items-end justify-between gap-2 h-32">
                {data.map((day) => {
                    const height = (day.minutes / maxMinutes) * 100;
                    const dayLabel = new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                    });

                    return (
                        <div key={day.date} className="flex-1 flex flex-col items-center">
                            <div className="relative w-full flex justify-center mb-2">
                                <div
                                    className="w-full max-w-8 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-md transition-all duration-300 hover:from-cyan-400 hover:to-blue-400"
                                    style={{ height: `${Math.max(height, 4)}%` }}
                                    title={`${day.minutes} minutes`}
                                />
                            </div>
                            <span className="text-xs text-neutral-400">{dayLabel}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

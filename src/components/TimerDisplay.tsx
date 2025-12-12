"use client";

import { formatTime } from "@/lib/sessionTimer";

interface TimerDisplayProps {
    elapsedMs: number;
    status: "idle" | "running" | "paused" | "completed";
}

export function TimerDisplay({ elapsedMs, status }: TimerDisplayProps) {
    const formattedTime = formatTime(elapsedMs);

    return (
        <div className="text-center">
            <div
                className={`text-7xl md:text-8xl font-mono font-bold tabular-nums tracking-tight ${status === "running"
                        ? "text-cyan-500"
                        : status === "paused"
                            ? "text-amber-500"
                            : "text-neutral-800"
                    }`}
            >
                {formattedTime}
            </div>
            <div className="mt-2 text-sm text-neutral-500 uppercase tracking-wide">
                {status === "idle" && "Ready to start"}
                {status === "running" && "Session in progress"}
                {status === "paused" && "Paused"}
                {status === "completed" && "Session completed"}
            </div>
        </div>
    );
}

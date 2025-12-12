"use client";

import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import type { TimerStatus } from "@/lib/sessionTimer";

interface TimerControlsProps {
    status: TimerStatus;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
    onCancel: () => void;
    disabled?: boolean;
}

export function TimerControls({
    status,
    onStart,
    onPause,
    onResume,
    onStop,
    onCancel,
    disabled = false,
}: TimerControlsProps) {
    if (status === "idle") {
        return (
            <div className="flex flex-col gap-3">
                <Button
                    onClick={onStart}
                    disabled={disabled}
                    size="lg"
                    className="w-full text-xl py-6"
                >
                    <Play className="w-6 h-6 mr-2" />
                    Start Session
                </Button>
            </div>
        );
    }

    if (status === "running") {
        return (
            <div className="flex gap-3">
                <Button
                    onClick={onPause}
                    disabled={disabled}
                    variant="secondary"
                    size="lg"
                    className="flex-1 bg-amber-500/20 border-amber-500/30 text-amber-600 hover:bg-amber-500/30"
                >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                </Button>
                <Button
                    onClick={onStop}
                    disabled={disabled}
                    size="lg"
                    className="flex-1"
                >
                    <Square className="w-5 h-5 mr-2" />
                    End Session
                </Button>
            </div>
        );
    }

    if (status === "paused") {
        return (
            <div className="flex gap-3">
                <Button
                    onClick={onResume}
                    disabled={disabled}
                    size="lg"
                    className="flex-1"
                >
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                </Button>
                <Button
                    onClick={onStop}
                    disabled={disabled}
                    variant="secondary"
                    size="lg"
                    className="flex-1 bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200"
                >
                    <Square className="w-5 h-5 mr-2" />
                    End
                </Button>
                <Button
                    onClick={onCancel}
                    disabled={disabled}
                    variant="ghost"
                    size="lg"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                    <RotateCcw className="w-5 h-5" />
                </Button>
            </div>
        );
    }

    return null;
}

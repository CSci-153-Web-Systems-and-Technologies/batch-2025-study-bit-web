export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface TimerState {
    status: TimerStatus;
    sessionId: string | null;
    subjectId: string | null;
    startedAt: number | null;
    pausedAt: number | null;
    accumulatedTime: number;
    plannedDuration: number | null;
}

export type TimerAction =
    | { type: "START"; sessionId: string; subjectId?: string; plannedDuration?: number }
    | { type: "PAUSE" }
    | { type: "RESUME" }
    | { type: "STOP" }
    | { type: "RESET" }
    | { type: "RESTORE"; state: Partial<TimerState> }
    | { type: "TICK" };

export const initialTimerState: TimerState = {
    status: "idle",
    sessionId: null,
    subjectId: null,
    startedAt: null,
    pausedAt: null,
    accumulatedTime: 0,
    plannedDuration: null,
};

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
    switch (action.type) {
        case "START":
            return {
                ...state,
                status: "running",
                sessionId: action.sessionId,
                subjectId: action.subjectId || null,
                startedAt: Date.now(),
                pausedAt: null,
                accumulatedTime: 0,
                plannedDuration: action.plannedDuration || null,
            };

        case "PAUSE":
            if (state.status !== "running") return state;
            return {
                ...state,
                status: "paused",
                pausedAt: Date.now(),
                accumulatedTime:
                    state.accumulatedTime + (Date.now() - (state.startedAt || Date.now())),
                startedAt: null,
            };

        case "RESUME":
            if (state.status !== "paused") return state;
            return {
                ...state,
                status: "running",
                startedAt: Date.now(),
                pausedAt: null,
            };

        case "STOP":
            return {
                ...state,
                status: "completed",
            };

        case "RESET":
            return initialTimerState;

        case "RESTORE":
            return {
                ...state,
                ...action.state,
            };

        case "TICK":
            return state;

        default:
            return state;
    }
}

export function getElapsedTime(state: TimerState): number {
    if (state.status === "idle") return 0;

    if (state.status === "running" && state.startedAt) {
        return state.accumulatedTime + (Date.now() - state.startedAt);
    }

    return state.accumulatedTime;
}

export function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
}

export function formatTimeVerbose(ms: number): string {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
}

const STORAGE_KEY = "studybit_timer_state";

export function persistTimerState(state: TimerState): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Ignore storage errors
    }
}

export function loadTimerState(): TimerState | null {
    if (typeof window === "undefined") return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        return JSON.parse(stored) as TimerState;
    } catch {
        return null;
    }
}

export function clearTimerState(): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignore storage errors
    }
}

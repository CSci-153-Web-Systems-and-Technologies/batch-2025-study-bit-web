"use client";

import { useReducer, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SubjectSelect } from "@/components/SubjectSelect";
import { TimerControls } from "@/components/TimerControls";
import { TimerDisplay } from "@/components/TimerDisplay";
import { DistractionWarning } from "@/components/DistractionWarning";
import { HonestyModal } from "@/components/HonestyModal";
import { useDistractionWatcher } from "@/hooks/useDistractionWatcher";
import {
    timerReducer,
    initialTimerState,
    getElapsedTime,
    persistTimerState,
    loadTimerState,
    clearTimerState,
    formatTimeVerbose,
} from "@/lib/sessionTimer";
import {
    startSession,
    endSession,
    cancelSession,
    getActiveSession,
} from "@/app/actions/sessions";
import { recordDistraction } from "@/app/actions/distractions";
import type { Database } from "@/types/supabase";
import { Clock, Target, TrendingUp } from "lucide-react";

type Subject = Database["public"]["Tables"]["subjects"]["Row"];

interface SessionTimerClientProps {
    subjects: Subject[];
    initialActiveSession: Database["public"]["Tables"]["study_sessions"]["Row"] | null;
    penaltyMode?: "none" | "pause_timer" | "streak_debit" | null;
    dailyGoalMinutes?: number;
    currentStreak?: number;
}

export function SessionTimerClient({
    subjects,
    initialActiveSession,
    penaltyMode = "pause_timer",
    dailyGoalMinutes = 120,
    currentStreak = 0,
}: SessionTimerClientProps) {
    const router = useRouter();
    const [state, dispatch] = useReducer(timerReducer, initialTimerState);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
        () => initialActiveSession?.subject_id || null
    );
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEndModal, setShowEndModal] = useState(false);

    const [isInitialized, setIsInitialized] = useState(false);
    const [showDistractionWarning, setShowDistractionWarning] = useState(false);
    const [distractionCount, setDistractionCount] = useState(0);

    const handleDistraction = useCallback(async () => {
        if (state.sessionId && state.status === "running") {
            // Apply penalty based on mode
            if (penaltyMode === "pause_timer" || penaltyMode === undefined || penaltyMode === null) {
                dispatch({ type: "PAUSE" });
            }

            setShowDistractionWarning(true);
            setDistractionCount((prev) => prev + 1);
            await recordDistraction(state.sessionId, "other");
        }
    }, [state.sessionId, state.status, penaltyMode]);

    const handleReturnFromDistraction = useCallback(() => {
        setShowDistractionWarning(false);
    }, []);

    useDistractionWatcher({
        isActive: state.status === "running",
        onDistraction: handleDistraction,
        onReturn: handleReturnFromDistraction,
    });

    const handleResumeFromDistraction = useCallback(() => {
        setShowDistractionWarning(false);
        dispatch({ type: "RESUME" });
    }, []);


    useEffect(() => {
        if (isInitialized) return;

        const initializeSession = async () => {
            if (initialActiveSession) {
                const startedAt = new Date(initialActiveSession.started_at).getTime();

                dispatch({
                    type: "RESTORE",
                    state: {
                        status: "running",
                        sessionId: initialActiveSession.id,
                        subjectId: initialActiveSession.subject_id,
                        startedAt,
                        accumulatedTime: 0,
                    },
                });
            } else {
                const savedState = loadTimerState();
                if (savedState && savedState.status !== "idle") {
                    const session = await getActiveSession();
                    if (session) {
                        const startedAt = new Date(session.started_at).getTime();
                        dispatch({
                            type: "RESTORE",
                            state: {
                                status: "running",
                                sessionId: session.id,
                                subjectId: session.subject_id,
                                startedAt,
                                accumulatedTime: 0,
                            },
                        });
                    } else {
                        clearTimerState();
                    }
                }
            }
            setIsInitialized(true);
        };

        initializeSession();
    }, [initialActiveSession, isInitialized]);

    useEffect(() => {
        if (state.status !== "running") {
            return;
        }

        const interval = setInterval(() => {
            setElapsedTime(getElapsedTime(state));
        }, 100);

        return () => clearInterval(interval);
    }, [state]);

    const displayedElapsedTime = state.status === "running" ? elapsedTime : getElapsedTime(state);

    useEffect(() => {
        if (state.status !== "idle") {
            persistTimerState(state);
        }
    }, [state]);

    const handleStart = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const result = await startSession(selectedSubjectId || undefined);

        if (!result.success) {
            setError(result.error || "Failed to start session");
            setIsLoading(false);
            return;
        }

        dispatch({
            type: "START",
            sessionId: result.session!.id,
            subjectId: selectedSubjectId || undefined,
        });

        setIsLoading(false);
    }, [selectedSubjectId]);

    const handlePause = useCallback(() => {
        dispatch({ type: "PAUSE" });
    }, []);

    const handleResume = useCallback(() => {
        dispatch({ type: "RESUME" });
    }, []);

    const handleStop = useCallback(() => {
        setShowEndModal(true);
    }, []);

    const handleEndSession = useCallback(async (data: { focusRating: number; isHonest: boolean; notes: string }) => {
        if (!state.sessionId) return;

        setIsLoading(true);
        setError(null);

        const result = await endSession(
            state.sessionId,
            data.focusRating,
            data.isHonest,
            data.notes
        );

        if (!result.success) {
            setError(result.error || "Failed to end session");
            setIsLoading(false);
            return;
        }

        dispatch({ type: "RESET" });
        clearTimerState();
        setShowEndModal(false);

        setDistractionCount(0);
        setIsLoading(false);
        router.refresh();
    }, [state.sessionId, router]);

    const handleCancel = useCallback(async () => {
        if (!state.sessionId) return;

        setIsLoading(true);
        await cancelSession(state.sessionId);
        dispatch({ type: "RESET" });
        clearTimerState();
        setIsLoading(false);
        router.refresh();
    }, [state.sessionId, router]);

    const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

    return (
        <div className="space-y-8">
            <DistractionWarning
                isVisible={showDistractionWarning}
                distractionCount={distractionCount}
                onResume={handleResumeFromDistraction}
            />
            <div className="bg-white rounded-2xl shadow-xl shadow-cyan-500/5 border border-neutral-100 p-8">
                <div className="max-w-md mx-auto space-y-8">
                    {state.status === "idle" && (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-neutral-700">
                                What are you studying?
                            </label>
                            <SubjectSelect
                                subjects={subjects}
                                value={selectedSubjectId}
                                onChange={setSelectedSubjectId}
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {state.status !== "idle" && selectedSubject && (
                        <div className="flex items-center justify-center gap-2 text-neutral-600">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: selectedSubject.color }}
                            />
                            <span>{selectedSubject.name}</span>
                        </div>
                    )}

                    <TimerDisplay elapsedMs={displayedElapsedTime} status={state.status} />

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <TimerControls
                        status={state.status}
                        onStart={handleStart}
                        onPause={handlePause}
                        onResume={handleResume}
                        onStop={handleStop}
                        onCancel={handleCancel}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 border border-neutral-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-cyan-500" />
                        <span className="text-sm text-neutral-500">Today&apos;s Study Time</span>
                    </div>
                    <div className="text-2xl font-bold text-neutral-900">
                        {formatTimeVerbose(displayedElapsedTime)}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-neutral-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-neutral-500">Daily Goal</span>
                    </div>
                    <div className="text-2xl font-bold text-neutral-900">
                        {Math.floor(dailyGoalMinutes / 60)}h {dailyGoalMinutes % 60}m
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-neutral-100">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                        <span className="text-sm text-neutral-500">Current Streak</span>
                    </div>
                    <div className="text-2xl font-bold text-neutral-900">{currentStreak} days</div>
                </div>
            </div>

            <HonestyModal
                isOpen={showEndModal}
                onComplete={handleEndSession}
                distractionCount={distractionCount}
            />
        </div>
    );
}

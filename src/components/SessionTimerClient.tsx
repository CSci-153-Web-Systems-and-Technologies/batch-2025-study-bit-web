"use client";

import { useReducer, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SubjectSelect } from "@/components/SubjectSelect";
import { TimerControls } from "@/components/TimerControls";
import { TimerDisplay } from "@/components/TimerDisplay";
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
import type { Database } from "@/types/supabase";
import { Clock, Target, TrendingUp } from "lucide-react";

type Subject = Database["public"]["Tables"]["subjects"]["Row"];

interface SessionTimerClientProps {
    subjects: Subject[];
    initialActiveSession: Database["public"]["Tables"]["study_sessions"]["Row"] | null;
}

export function SessionTimerClient({
    subjects,
    initialActiveSession,
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
    const [focusScore, setFocusScore] = useState(80);
    const [honestyScore, setHonestyScore] = useState(80);
    const [notes, setNotes] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);

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

    const handleEndSession = useCallback(async () => {
        if (!state.sessionId) return;

        setIsLoading(true);
        setError(null);

        const result = await endSession(
            state.sessionId,
            focusScore,
            honestyScore,
            notes || undefined
        );

        if (!result.success) {
            setError(result.error || "Failed to end session");
            setIsLoading(false);
            return;
        }

        dispatch({ type: "RESET" });
        clearTimerState();
        setShowEndModal(false);
        setFocusScore(80);
        setHonestyScore(80);
        setNotes("");
        setIsLoading(false);
        router.refresh();
    }, [state.sessionId, focusScore, honestyScore, notes, router]);

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
                    <div className="text-2xl font-bold text-neutral-900">2h 0m</div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-neutral-100">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                        <span className="text-sm text-neutral-500">Current Streak</span>
                    </div>
                    <div className="text-2xl font-bold text-neutral-900">0 days</div>
                </div>
            </div>

            {showEndModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-6">
                        <h2 className="text-xl font-bold text-neutral-900">
                            End Study Session
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Focus Score: {focusScore}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={focusScore}
                                    onChange={(e) => setFocusScore(Number(e.target.value))}
                                    className="w-full accent-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Honesty Score: {honestyScore}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={honestyScore}
                                    onChange={(e) => setHonestyScore(Number(e.target.value))}
                                    className="w-full accent-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Notes (optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                                    placeholder="What did you accomplish?"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEndModal(false)}
                                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndSession}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? "Saving..." : "Save Session"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

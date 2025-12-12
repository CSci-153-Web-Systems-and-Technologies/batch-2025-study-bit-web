"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatTimeVerbose } from "@/lib/sessionTimer";
import { deleteSession } from "@/app/actions/manualSessions";
import { Trash2, Edit2, Clock, Calendar, Target } from "lucide-react";
import type { Database } from "@/types/supabase";

type StudySession = Database["public"]["Tables"]["study_sessions"]["Row"];

interface SessionsListProps {
    sessions: Array<
        StudySession & { subjects: { name: string; color: string } | null }
    >;
}

export function SessionsList({ sessions }: SessionsListProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function handleDelete(id: string) {
        if (!confirm("Delete this session?")) return;

        setDeletingId(id);
        await deleteSession(id);
        router.refresh();
        setDeletingId(null);
    }

    if (sessions.length === 0) {
        return (
            <div className="text-center py-12 text-neutral-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No study sessions yet.</p>
                <p className="text-sm">Start a timer or log a manual session!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {sessions.map((session) => {
                const startDate = new Date(session.started_at);
                const formattedDate = startDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                });
                const formattedTime = startDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                });

                return (
                    <div
                        key={session.id}
                        className="bg-white rounded-xl border border-neutral-100 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    {session.subjects ? (
                                        <>
                                            <div
                                                className="w-3 h-3 rounded-full shrink-0"
                                                style={{ backgroundColor: session.subjects.color }}
                                            />
                                            <span className="font-medium text-neutral-900 truncate">
                                                {session.subjects.name}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="font-medium text-neutral-500">
                                            General Study
                                        </span>
                                    )}
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${session.source === "timer"
                                                ? "bg-cyan-100 text-cyan-700"
                                                : "bg-purple-100 text-purple-700"
                                            }`}
                                    >
                                        {session.source}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {formattedDate} at {formattedTime}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {formatTimeVerbose(
                                            (session.actual_duration_minutes || 0) * 60 * 1000
                                        )}
                                    </span>
                                    {session.focus_score !== null && (
                                        <span className="flex items-center gap-1">
                                            <Target className="w-4 h-4" />
                                            {session.focus_score}% focus
                                        </span>
                                    )}
                                </div>

                                {session.notes && (
                                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                                        {session.notes}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => { }}
                                    className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(session.id)}
                                    disabled={deletingId === session.id}
                                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

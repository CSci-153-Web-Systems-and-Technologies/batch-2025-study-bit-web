"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubjectSelect } from "@/components/SubjectSelect";
import { Button } from "@/components/ui";
import { createManualSession } from "@/app/actions/manualSessions";
import { Calendar, Clock, FileText, Loader2 } from "lucide-react";
import type { Database } from "@/types/supabase";

type Subject = Database["public"]["Tables"]["subjects"]["Row"];

interface ManualLogFormProps {
    subjects: Subject[];
    onSuccess?: () => void;
}

export function ManualLogForm({ subjects, onSuccess }: ManualLogFormProps) {
    const router = useRouter();
    const [subjectId, setSubjectId] = useState<string | null>(null);
    const [date, setDate] = useState(() => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    });
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(25);
    const [notes, setNotes] = useState("");
    const [focusScore, setFocusScore] = useState(80);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const totalMinutes = hours * 60 + minutes;

        if (totalMinutes < 1) {
            setError("Duration must be at least 1 minute");
            setIsLoading(false);
            return;
        }

        const result = await createManualSession({
            subjectId: subjectId || undefined,
            date,
            durationMinutes: totalMinutes,
            notes: notes || undefined,
            focusScore,
        });

        if (!result.success) {
            setError(result.error || "Failed to log session");
            setIsLoading(false);
            return;
        }

        setHours(0);
        setMinutes(25);
        setNotes("");
        setFocusScore(80);
        setIsLoading(false);
        router.refresh();
        onSuccess?.();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                    Subject
                </label>
                <SubjectSelect
                    subjects={subjects}
                    value={subjectId}
                    onChange={setSubjectId}
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date & Time
                </label>
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Duration
                </label>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={hours}
                                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                            />
                            <span className="text-neutral-500">hours</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={minutes}
                                onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                            />
                            <span className="text-neutral-500">min</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
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

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Notes (optional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="What did you study?"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900 resize-none"
                />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Logging...
                    </>
                ) : (
                    "Log Session"
                )}
            </Button>
        </form>
    );
}

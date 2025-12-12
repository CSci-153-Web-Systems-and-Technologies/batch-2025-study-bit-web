"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGoal, completeGoal, abandonGoal } from "@/app/actions/goals";
import { Trash2, Check, X, Target, Clock, Calendar } from "lucide-react";
import type { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"];

interface GoalsListProps {
    goals: Goal[];
}

export function GoalsList({ goals }: GoalsListProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    async function handleComplete(id: string) {
        setLoadingId(id);
        await completeGoal(id);
        router.refresh();
        setLoadingId(null);
    }

    async function handleAbandon(id: string) {
        if (!confirm("Abandon this goal?")) return;
        setLoadingId(id);
        await abandonGoal(id);
        router.refresh();
        setLoadingId(null);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this goal permanently?")) return;
        setLoadingId(id);
        await deleteGoal(id);
        router.refresh();
        setLoadingId(null);
    }

    const activeGoals = goals.filter((g) => g.status === "active");
    const completedGoals = goals.filter((g) => g.status === "completed");
    const abandonedGoals = goals.filter((g) => g.status === "abandoned");

    if (goals.length === 0) {
        return (
            <div className="text-center py-12 text-neutral-500">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No goals yet.</p>
                <p className="text-sm">Create a goal to track your progress!</p>
            </div>
        );
    }

    function GoalCard({ goal }: { goal: Goal }) {
        const progress = Math.min(
            100,
            Math.round((goal.current_minutes / goal.target_minutes) * 100)
        );
        const targetHours = Math.round(goal.target_minutes / 60);
        const currentHours = (goal.current_minutes / 60).toFixed(1);
        const deadline = goal.deadline
            ? new Date(goal.deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })
            : null;

        const isActive = goal.status === "active";
        const isCompleted = goal.status === "completed";

        return (
            <div
                className={`bg-white rounded-xl border p-4 ${isCompleted
                        ? "border-green-200 bg-green-50/30"
                        : goal.status === "abandoned"
                            ? "border-neutral-200 opacity-60"
                            : "border-neutral-100"
                    }`}
            >
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3
                            className={`font-semibold ${isCompleted ? "text-green-700" : "text-neutral-900"
                                }`}
                        >
                            {goal.title}
                        </h3>
                        {goal.description && (
                            <p className="text-sm text-neutral-500 mt-1 line-clamp-1">
                                {goal.description}
                            </p>
                        )}
                    </div>

                    {isActive && (
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => handleComplete(goal.id)}
                                disabled={loadingId === goal.id}
                                className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Mark complete"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleAbandon(goal.id)}
                                disabled={loadingId === goal.id}
                                className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Abandon"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(goal.id)}
                                disabled={loadingId === goal.id}
                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-neutral-500">
                            {currentHours}h / {targetHours}h
                        </span>
                        <span
                            className={`font-medium ${progress >= 100 ? "text-green-600" : "text-cyan-600"
                                }`}
                        >
                            {progress}%
                        </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${progress >= 100
                                    ? "bg-gradient-to-r from-green-400 to-green-500"
                                    : "bg-gradient-to-r from-cyan-400 to-blue-500"
                                }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {targetHours} hours target
                    </span>
                    {deadline && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due {deadline}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {activeGoals.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
                        Active Goals ({activeGoals.length})
                    </h3>
                    <div className="space-y-3">
                        {activeGoals.map((goal) => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                </div>
            )}

            {completedGoals.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-green-600 uppercase tracking-wide mb-3">
                        Completed ({completedGoals.length})
                    </h3>
                    <div className="space-y-3">
                        {completedGoals.map((goal) => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                </div>
            )}

            {abandonedGoals.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-3">
                        Abandoned ({abandonedGoals.length})
                    </h3>
                    <div className="space-y-3">
                        {abandonedGoals.map((goal) => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

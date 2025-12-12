"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { createGoal } from "@/app/actions/goals";
import { Target, Calendar, Clock, Loader2 } from "lucide-react";

interface GoalFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function GoalForm({ onSuccess, onCancel }: GoalFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetHours, setTargetHours] = useState(10);
    const [deadline, setDeadline] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!title.trim()) {
            setError("Title is required");
            setIsLoading(false);
            return;
        }

        const result = await createGoal({
            title: title.trim(),
            description: description.trim() || undefined,
            targetMinutes: targetHours * 60,
            deadline: deadline || undefined,
        });

        if (!result.success) {
            setError(result.error || "Failed to create goal");
            setIsLoading(false);
            return;
        }

        setTitle("");
        setDescription("");
        setTargetHours(10);
        setDeadline("");
        setIsLoading(false);
        router.refresh();
        onSuccess?.();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                    <Target className="inline w-4 h-4 mr-1" />
                    Goal Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Master React Hooks"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                    Description (optional)
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What do you want to achieve?"
                    rows={2}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900 resize-none"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Target Study Time
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="1"
                        value={targetHours}
                        onChange={(e) => setTargetHours(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                    />
                    <span className="text-neutral-500">hours</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Deadline (optional)
                </label>
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                />
            </div>

            <div className="flex gap-3 pt-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        className="flex-1 text-neutral-600"
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Goal"
                    )}
                </Button>
            </div>
        </form>
    );
}

"use client";

import { useState } from "react";
import { GoalForm } from "@/components/GoalForm";
import { GoalsList } from "@/components/GoalsList";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui";
import type { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"];

interface GoalsClientProps {
    goals: Goal[];
}

export function GoalsClient({ goals }: GoalsClientProps) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Goals</h1>
                    <p className="text-neutral-600 mt-1">
                        Set and track your study objectives
                    </p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    size="lg"
                >
                    {showForm ? (
                        <>
                            <X className="w-5 h-5 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5 mr-2" />
                            New Goal
                        </>
                    )}
                </Button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl shadow-xl shadow-cyan-500/5 border border-neutral-100 p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                        Create New Goal
                    </h2>
                    <GoalForm
                        onSuccess={() => setShowForm(false)}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl shadow-cyan-500/5 border border-neutral-100 p-6">
                <GoalsList goals={goals} />
            </div>
        </div>
    );
}

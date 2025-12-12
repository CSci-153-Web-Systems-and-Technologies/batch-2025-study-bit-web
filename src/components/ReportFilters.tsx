"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Calendar, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Subject {
    id: string;
    name: string;
}

interface ReportFiltersProps {
    subjects: Subject[];
}

type Period = "week" | "month" | "year" | "all";

export function ReportFilters({ subjects }: ReportFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPeriod = (searchParams.get("period") as Period) || "week";
    const selectedSubjects = searchParams.getAll("subject");

    const updateFilter = useCallback((key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === null) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.replace(`/reports?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const toggleSubject = useCallback((subjectId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const current = params.getAll("subject");

        if (current.includes(subjectId)) {
            params.delete("subject");
            current.filter(id => id !== subjectId).forEach(id => params.append("subject", id));
        } else {
            params.append("subject", subjectId);
        }

        router.push(`/reports?${params.toString()}`);
    }, [router, searchParams]);

    return (
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                {/* Period Select */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
                    <div className="flex bg-neutral-100 p-1 rounded-lg">
                        {(["week", "month", "year", "all"] as const).map((period) => (
                            <button
                                key={period}
                                onClick={() => updateFilter("period", period)}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize",
                                    currentPeriod === period
                                        ? "bg-white text-neutral-900 shadow-sm"
                                        : "text-neutral-500 hover:text-neutral-900"
                                )}
                            >
                                {period === "all" ? "All Time" : `Last ${period.charAt(0).toUpperCase() + period.slice(1)}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Label */}
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Filter className="w-4 h-4" />
                    <span>Filter Subjects</span>
                </div>
            </div>

            {/* Subject Cloud */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete("subject");
                        router.push(`/reports?${params.toString()}`);
                    }}
                    className={cn(
                        "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
                        selectedSubjects.length === 0
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                    )}
                >
                    All Subjects
                </button>
                {subjects.map(subject => {
                    const isSelected = selectedSubjects.includes(subject.id);
                    return (
                        <button
                            key={subject.id}
                            onClick={() => toggleSubject(subject.id)}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
                                isSelected
                                    ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                            )}
                        >
                            {subject.name}
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { ChevronDown, BookOpen, Plus, X, Check } from "lucide-react";
import type { Database } from "@/types/supabase";
import { createSubject } from "@/app/actions/subjects";
import { useRouter } from "next/navigation";

type Subject = Database["public"]["Tables"]["subjects"]["Row"];

interface SubjectSelectProps {
    subjects: Subject[];
    value: string | null;
    onChange: (subjectId: string | null) => void;
    disabled?: boolean;
}

const COLORS = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#a855f7", // purple
    "#ec4899", // pink
];

export function SubjectSelect({
    subjects,
    value,
    onChange,
    disabled = false,
}: SubjectSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectColor, setNewSubjectColor] = useState(COLORS[4]); // Cyan default
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const selectedSubject = subjects.find((s) => s.id === value);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-subject-select]")) {
                setIsOpen(false);
                setIsCreating(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleCreateSubject = async () => {
        if (!newSubjectName.trim()) return;
        setIsSubmitting(true);

        try {
            const result = await createSubject(newSubjectName, newSubjectColor);
            if (result.success && result.subject) {
                // Optimistic or wait for refresh? 
                // Since this component relies on 'subjects' prop, we MUST wait for parent refresh
                router.refresh();

                // We can optimistically call onChange, but the Name won't show in the main button until subjects prop updates 
                // UNLESS we handle the display logic to accept a partial subject?
                // For valid UX, we set value and close. 
                // The main button will show "Select a subject" briefly until prop updates unless we handle it locally.
                // But typically action + refresh is fast.

                setIsOpen(false);
                setIsCreating(false);
                setNewSubjectName("");
                onChange(result.subject.id);
            }
        } catch (error) {
            console.error("Failed to create subject", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative" data-subject-select>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-xl text-left hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: selectedSubject?.color || "#94a3b8" }}
                    />
                    <span className="text-neutral-900">
                        {selectedSubject?.name || "Select a subject"}
                    </span>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 overflow-hidden max-h-80 overflow-y-auto">
                    {!isCreating ? (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(null);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
                            >
                                <BookOpen className="w-4 h-4 text-neutral-400" />
                                <span className="text-neutral-600">No subject (general study)</span>
                            </button>

                            {subjects.map((subject) => (
                                <button
                                    key={subject.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(subject.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors ${value === subject.id ? "bg-cyan-50" : ""
                                        }`}
                                >
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: subject.color }}
                                    />
                                    <span className="text-neutral-900">{subject.name}</span>
                                </button>
                            ))}

                            <div className="border-t border-neutral-100 p-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-cyan-600 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create New Subject
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 space-y-3 bg-neutral-50">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-neutral-500 uppercase">New Subject</span>
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="text-neutral-400 hover:text-neutral-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <input
                                type="text"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                                placeholder="Subject name..."
                                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                                autoFocus
                            />

                            <div className="flex flex-wrap gap-2">
                                {COLORS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setNewSubjectColor(color)}
                                        className={`w-6 h-6 rounded-full border-2 transition-all ${newSubjectColor === color ? "border-neutral-900 scale-110" : "border-transparent"}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleCreateSubject}
                                disabled={isSubmitting || !newSubjectName.trim()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Create Subject
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import type { Database } from "@/types/supabase";

type Subject = Database["public"]["Tables"]["subjects"]["Row"];

interface SubjectSelectProps {
    subjects: Subject[];
    value: string | null;
    onChange: (subjectId: string | null) => void;
    disabled?: boolean;
}

export function SubjectSelect({
    subjects,
    value,
    onChange,
    disabled = false,
}: SubjectSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedSubject = subjects.find((s) => s.id === value);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-subject-select]")) {
                setIsOpen(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

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
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 overflow-hidden">
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

                    {subjects.length === 0 && (
                        <div className="px-4 py-3 text-neutral-500 text-sm">
                            No subjects yet. Create one in your dashboard.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

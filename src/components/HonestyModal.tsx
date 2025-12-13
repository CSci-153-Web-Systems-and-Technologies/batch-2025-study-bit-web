"use client";

import { useState } from "react";
import { Star, ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface HonestyModalProps {
    isOpen: boolean;
    onComplete: (data: { focusRating: number; isHonest: boolean; notes: string }) => void;
    distractionCount: number;
}

export function HonestyModal({ isOpen, onComplete, distractionCount }: HonestyModalProps) {
    const [focusRating, setFocusRating] = useState(4); // 1-5
    const [isHonest, setIsHonest] = useState(true);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Convert 1-5 to 1-100 scale roughly (20, 40, 60, 80, 100)
        const focusScore = focusRating * 20;
        onComplete({ focusRating: focusScore, isHonest, notes });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="honesty-modal-title"
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white text-center">
                    <h2 id="honesty-modal-title" className="text-2xl font-bold mb-2">Session Complete!</h2>
                    <p className="text-cyan-100">Time to reflect on your study session.</p>
                </div>

                <div className="p-6 space-y-8">
                    {/* Focus Rating */}
                    <div className="space-y-3 text-center">
                        <label className="block text-sm font-medium text-neutral-700">
                            How focused were you?
                        </label>
                        <div className="flex justify-center gap-2" role="group" aria-label="Focus rating">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() => setFocusRating(rating)}
                                    aria-label={`Rate focus ${rating} out of 5 stars`}
                                    aria-pressed={rating <= focusRating}
                                    className="p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={cn(
                                            "w-8 h-8 transition-colors",
                                            rating <= focusRating
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-neutral-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="text-xs text-neutral-500 font-medium">
                            {focusRating === 5 && "Laser Focused! 🚀"}
                            {focusRating === 4 && "Pretty Good 👍"}
                            {focusRating === 3 && "Average 😐"}
                            {focusRating === 2 && "Distracted 😕"}
                            {focusRating === 1 && "Start Over 🛑"}
                        </div>
                    </div>

                    {/* Honesty Toggle */}
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <div className="flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg", isHonest ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600")}>
                                {isHonest ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-neutral-900 mb-1">Honesty Check</h3>
                                <p className="text-xs text-neutral-500 mb-3">
                                    Did you stay on task the entire time?
                                    {distractionCount > 0 && (
                                        <span className="block mt-1 text-amber-600 font-medium">
                                            (System detected {distractionCount} distraction{distractionCount !== 1 ? "s" : ""})
                                        </span>
                                    )}
                                </p>

                                <div className="flex bg-white rounded-lg p-1 border border-neutral-200">
                                    <button
                                        type="button"
                                        onClick={() => setIsHonest(true)}
                                        className={cn(
                                            "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
                                            isHonest ? "bg-green-50 text-green-700 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                                        )}
                                    >
                                        Yes, I was
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsHonest(false)}
                                        className={cn(
                                            "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
                                            !isHonest ? "bg-amber-50 text-amber-700 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                                        )}
                                    >
                                        No, I slipped
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700">
                            Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="What did you accomplish?"
                            className="w-full h-20 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-neutral-900 bg-white"
                        />
                    </div>

                    <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
                        Complete Session
                    </Button>
                </div>
            </div>
        </div>
    );
}

import Link from "next/link";
import { Play, PenLine, Target } from "lucide-react";

export function QuickActions() {
    return (
        <div className="bg-white rounded-xl border border-neutral-100 p-6">
            <h3 className="text-sm font-medium text-neutral-500 mb-4">
                Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                    href="/sessions"
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
                >
                    <Play className="w-5 h-5" />
                    <div>
                        <div className="font-medium">Start Timer</div>
                        <div className="text-xs text-cyan-100">Begin a study session</div>
                    </div>
                </Link>

                <Link
                    href="/my-decks"
                    className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors border border-purple-100"
                >
                    <PenLine className="w-5 h-5" />
                    <div>
                        <div className="font-medium">Log Session</div>
                        <div className="text-xs text-purple-400">Add manual entry</div>
                    </div>
                </Link>

                <Link
                    href="/goals"
                    className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors border border-amber-100"
                >
                    <Target className="w-5 h-5" />
                    <div>
                        <div className="font-medium">Set Goal</div>
                        <div className="text-xs text-amber-400">Create study goal</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

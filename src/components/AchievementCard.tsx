import { Trophy, Flame, Zap, BookOpen, Library, Clock, Target, Shield, Star, Award, Medal, LucideIcon } from "lucide-react";

// Map string icon names to components
const iconMap: Record<string, LucideIcon> = {
    Trophy, Flame, Zap, BookOpen, Library, Clock, Target, Shield, Star, Award, Medal
};

interface AchievementCardProps {
    title: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    unlockedAt?: string;
}

export function AchievementCard({ title, description, icon, isUnlocked, unlockedAt }: AchievementCardProps) {
    const Icon = iconMap[icon] || Trophy;

    return (
        <div className={`p-4 rounded-xl border transition-all ${isUnlocked ? "bg-white border-cyan-100 shadow-sm hover:shadow-md" : "bg-neutral-50 border-neutral-200 opacity-75"}`}>
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${isUnlocked ? "bg-cyan-50 text-cyan-600" : "bg-neutral-200 text-neutral-400"}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className={`font-semibold ${isUnlocked ? "text-neutral-900" : "text-neutral-500"}`}>{title}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{description}</p>
                    {isUnlocked && unlockedAt && (
                        <p className="text-xs text-cyan-600 mt-2 font-medium">
                            Unlocked {new Date(unlockedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

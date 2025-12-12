import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: string;
    className?: string;
    trend?: {
        value: number;
        label: string;
        isPositive?: boolean;
    };
}

export function DashboardCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = "text-cyan-500",
    className,
    trend,
}: DashboardCardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-xl border border-neutral-100 p-5 hover:shadow-lg hover:shadow-cyan-500/5 transition-shadow",
                className
            )}
        >
            <div className="flex items-start justify-between mb-3">
                <div
                    className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        iconColor === "text-cyan-500" && "bg-cyan-50",
                        iconColor === "text-green-500" && "bg-green-50",
                        iconColor === "text-amber-500" && "bg-amber-50",
                        iconColor === "text-purple-500" && "bg-purple-50",
                        iconColor === "text-blue-500" && "bg-blue-50",
                        iconColor === "text-red-500" && "bg-red-50"
                    )}
                >
                    <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
                {trend && (
                    <span
                        className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full",
                            trend.isPositive
                                ? "bg-green-50 text-green-600"
                                : "bg-neutral-100 text-neutral-500"
                        )}
                    >
                        {trend.isPositive && "+"}
                        {trend.value}% {trend.label}
                    </span>
                )}
            </div>

            <div className="text-2xl font-bold text-neutral-900 mb-1">{value}</div>
            <div className="text-sm text-neutral-500">{title}</div>
            {subtitle && (
                <div className="text-xs text-neutral-400 mt-1">{subtitle}</div>
            )}
        </div>
    );
}

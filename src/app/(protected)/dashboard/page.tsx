import { getDashboardMetrics, formatMinutes } from "@/lib/analytics";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardChart } from "@/components/DashboardChart";
import { QuickActions } from "@/components/QuickActions";
import { Clock, Calendar, Flame, Target, TrendingUp, Award, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Dashboard",
};

export default async function DashboardPage() {
    const metrics = await getDashboardMetrics();

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
                        Dashboard
                    </h1>
                    <p className="text-neutral-600">
                        Track your progress and stay focused
                    </p>
                </div>

                <QuickActions />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardCard
                        title={"Today's Study Time"}
                        value={formatMinutes(metrics.todayMinutes)}
                        subtitle={`${metrics.todaySessions} session${metrics.todaySessions !== 1 ? "s" : ""}`}
                        icon={Clock}
                        iconColor="text-cyan-500"
                    />

                    <DashboardCard
                        title="This Week"
                        value={formatMinutes(metrics.weekMinutes)}
                        subtitle={`${metrics.weekSessions} session${metrics.weekSessions !== 1 ? "s" : ""}`}
                        icon={Calendar}
                        iconColor="text-blue-500"
                    />

                    <DashboardCard
                        title="Current Streak"
                        value={`${metrics.currentStreak} day${metrics.currentStreak !== 1 ? "s" : ""}`}
                        subtitle={`Best: ${metrics.longestStreak} days`}
                        icon={Flame}
                        iconColor="text-amber-500"
                    />

                    <DashboardCard
                        title="Focus Score"
                        value={metrics.averageFocusScore !== null ? `${metrics.averageFocusScore}%` : "--"}
                        subtitle="Average this month"
                        icon={TrendingUp}
                        iconColor="text-green-500"
                    />

                    <DashboardCard
                        title="Honesty Score"
                        value={metrics.averageHonestyScore !== null ? `${metrics.averageHonestyScore}%` : "--"}
                        subtitle="Self-reported avg"
                        icon={ShieldCheck}
                        iconColor="text-purple-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <DashboardChart data={metrics.last7Days} />
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-neutral-500">Goals</h3>
                            <Link
                                href="/goals"
                                className="text-xs text-cyan-600 hover:text-cyan-700"
                            >
                                View all →
                            </Link>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900">
                                        {metrics.completedGoals}
                                    </div>
                                    <div className="text-sm text-neutral-500">Goals Completed</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900">
                                        {metrics.activeGoals}
                                    </div>
                                    <div className="text-sm text-neutral-500">Active Goals</div>
                                </div>
                            </div>
                        </div>

                        {metrics.activeGoals === 0 && metrics.completedGoals === 0 && (
                            <div className="mt-4 pt-4 border-t border-neutral-100">
                                <Link
                                    href="/goals"
                                    className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                                >
                                    Create your first goal →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">
                                This Month: {formatMinutes(metrics.monthMinutes)}
                            </h3>
                            <p className="text-cyan-100 text-sm">
                                Keep up the great work! Consistency is key to success.
                            </p>
                        </div>
                        <Link
                            href="/sessions"
                            className="px-6 py-2 bg-white text-cyan-600 rounded-lg font-medium hover:bg-cyan-50 transition-colors shrink-0"
                        >
                            Start Studying
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

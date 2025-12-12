import { createServerClient } from "@/lib/supabase";
import { getReportData } from "@/lib/reports/queries";
import { ReportFilters } from "@/components/ReportFilters";
import { redirect } from "next/navigation";
import { Clock, BookOpen, Target, ShieldCheck } from "lucide-react";

export const metadata = {
    title: "Reports",
};

export default async function ReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/sign-in");

    const params = await searchParams;
    const period = (typeof params.period === 'string' ? params.period : 'week') as 'week' | 'month' | 'year' | 'all';
    const subjectParam = params.subject;
    const subjectIds = Array.isArray(subjectParam) ? subjectParam : (subjectParam ? [subjectParam] : []);

    const now = new Date();
    let from = new Date();

    // Set 'from' date based on period
    // Simple logic: subtract days. 
    // 'all' sets to epoch.
    if (period === 'month') {
        from.setDate(now.getDate() - 30);
    } else if (period === 'year') {
        from.setDate(now.getDate() - 365);
    } else if (period === 'all') {
        from = new Date(0); // 1970
    } else {
        from.setDate(now.getDate() - 7); // including today?
    }

    // For 'week', usually means last 7 days.

    const reportData = await getReportData(user.id, from, now, subjectIds);

    const { data: subjects } = await supabase
        .from('subjects')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');

    // Calculate hours for display
    const totalHours = (reportData.totalMinutes / 60).toFixed(1);

    return (
        <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Study Reports</h1>
                    <p className="text-neutral-500">Analyze your focus and consistency.</p>
                </div>

                <ReportFilters subjects={subjects || []} />

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-neutral-500">Total Time</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">{totalHours} <span className="text-sm font-normal text-neutral-400">hrs</span></div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-neutral-500">Sessions</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">{reportData.totalSessions}</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <Target className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-neutral-500">Avg Focus</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">{reportData.avgFocus}%</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-neutral-500">Avg Honesty</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">{reportData.avgHonesty}%</div>
                    </div>
                </div>

                {/* Debug / Data Check */}
                {/* 
                <pre className="text-xs">{JSON.stringify(reportData.timeline.slice(0, 5), null, 2)}</pre> 
                */}
            </div>
        </div>
    );
}

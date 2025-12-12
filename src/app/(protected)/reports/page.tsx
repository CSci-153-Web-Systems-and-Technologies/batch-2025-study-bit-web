import { createServerClient } from "@/lib/supabase";
import { getReportData } from "@/lib/reports/queries";
import { getDateRange } from "@/lib/reports/utils";
import { ReportFilters } from "@/components/ReportFilters";
import { ReportCharts } from "@/components/ReportCharts";
import { redirect } from "next/navigation";
import { Clock, BookOpen, Target, ShieldCheck, Download } from "lucide-react";

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

    // Resolve params
    const resolvedParams = await searchParams;
    const period = typeof resolvedParams.period === 'string' ? resolvedParams.period : 'week';
    const subjectParam = resolvedParams.subject;
    const subjectIds = Array.isArray(subjectParam) ? subjectParam : (subjectParam ? [subjectParam] : []);

    const { from, to } = getDateRange(period);
    const reportData = await getReportData(user.id, from, to, subjectIds);

    const { data: subjects } = await supabase
        .from('subjects')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');

    const totalHours = (reportData.totalMinutes / 60).toFixed(1);

    // Construct export URL
    const exportParams = new URLSearchParams();
    if (period) exportParams.set("period", period);
    subjectIds.forEach(id => exportParams.append("subject", id));
    const exportUrl = `/api/reports/export?${exportParams.toString()}`;

    return (
        <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Study Reports</h1>
                        <p className="text-neutral-500">Analyze your focus and consistency.</p>
                    </div>
                    <a
                        href={exportUrl}
                        className="inline-flex items-center px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 shadow-sm transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </a>
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

                <ReportCharts timeline={reportData.timeline} subjects={reportData.subjects} />
            </div>
        </div>
    );
}

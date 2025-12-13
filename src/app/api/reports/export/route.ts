import { createClient } from "@/lib/supabase/server";
import { getReportData } from "@/lib/reports/queries";
import { getDateRange } from "@/lib/reports/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";
    // Check if subject is passed as CSV or multiple params
    // Next.js searchParams.getAll("subject") handles ?subject=1&subject=2
    const subjectIds = searchParams.getAll("subject");

    const { from, to } = getDateRange(period);

    try {
        const data = await getReportData(user.id, from, to, subjectIds);

        // CSV Generation
        const headers = ["Date", "Minutes", "Sessions", "Avg Focus", "Avg Honesty"];
        const rows = data.timeline.map(pt => [
            pt.date,
            pt.minutes.toString(),
            pt.sessions.toString(),
            pt.focus.toString(),
            pt.honesty.toString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="study-report-${period}.csv"`
            }
        });

    } catch (error) {
        console.error("Export error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

import { ManualLogForm } from "@/components/ManualLogForm";
import { SessionsList } from "@/components/SessionsList";
import { getSubjects } from "@/lib/db/subjects";
import { getSessionsWithSubjects } from "@/app/actions/manualSessions";

export const metadata = {
    title: "My Study Log",
};

export default async function MyDecksPage() {
    const [subjects, sessions] = await Promise.all([
        getSubjects(),
        getSessionsWithSubjects(50),
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        My Study Log
                    </h1>
                    <p className="text-neutral-600">
                        Track your study sessions and monitor your progress
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl shadow-cyan-500/5 border border-neutral-100 p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                                Log Manual Session
                            </h2>
                            <ManualLogForm subjects={subjects} />
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl shadow-cyan-500/5 border border-neutral-100 p-6">
                            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                                Recent Sessions
                            </h2>
                            <SessionsList sessions={sessions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

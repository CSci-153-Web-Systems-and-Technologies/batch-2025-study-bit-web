import { SessionTimerClient } from "@/components/SessionTimerClient";
import { getSubjects } from "@/lib/db/subjects";
import { getActiveSession } from "@/app/actions/sessions";

export const metadata = {
    title: "Study Session",
};

export default async function SessionsPage() {
    const [subjects, activeSession] = await Promise.all([
        getSubjects(),
        getActiveSession(),
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        Study Session
                    </h1>
                    <p className="text-neutral-600">
                        Track your focus time and build consistent study habits
                    </p>
                </div>

                <SessionTimerClient
                    subjects={subjects}
                    initialActiveSession={activeSession}
                />
            </div>
        </div>
    );
}

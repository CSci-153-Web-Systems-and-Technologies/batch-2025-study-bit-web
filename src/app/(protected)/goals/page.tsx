import { GoalsClient } from "@/components/GoalsClient";
import { getGoalsWithProgress } from "@/app/actions/goals";

export const metadata = {
    title: "Goals",
};

export default async function GoalsPage() {
    const goals = await getGoalsWithProgress();

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <GoalsClient goals={goals} />
            </div>
        </div>
    );
}

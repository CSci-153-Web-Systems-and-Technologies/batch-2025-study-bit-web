export default function Loading() {
    return (
        <div className="min-h-screen bg-neutral-50 p-8 flex items-center justify-center">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-neutral-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" role="status" aria-label="Loading dashboard" />
                <p className="text-neutral-500">Loading dashboard...</p>
            </div>
        </div>
    );
}

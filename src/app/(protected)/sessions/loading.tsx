export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-8 px-4 flex items-center justify-center">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-neutral-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" role="status" aria-label="Loading study timer" />
                <p className="text-neutral-500">Loading study timer...</p>
            </div>
        </div>
    );
}

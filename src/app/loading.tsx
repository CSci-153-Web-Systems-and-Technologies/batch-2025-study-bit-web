export default function Loading() {
    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-neutral-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" role="status" aria-label="Loading" />
                <p className="text-neutral-600 font-medium">Loading...</p>
            </div>
        </div>
    );
}

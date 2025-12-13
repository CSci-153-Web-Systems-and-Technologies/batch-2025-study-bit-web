"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-neutral-200 p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                    Something went wrong
                </h1>

                <p className="text-neutral-600 mb-6">
                    We encountered an unexpected error. Please try again or return to the homepage.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
                        aria-label="Try again"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try Again
                    </button>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                        aria-label="Go to dashboard"
                    >
                        <Home className="w-4 h-4" />
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

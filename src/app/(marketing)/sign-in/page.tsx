"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

export default function SignInPage() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("redirectTo", redirectTo);

        const result = await signIn(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
            return;
        }
        // If successful, signIn will redirect automatically
    }

    return (
        <div className="min-h-screen flex">

            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 overflow-hidden">
                <div className="absolute inset-0">
                    <svg
                        className="absolute bottom-0 left-0 right-0 w-full"
                        viewBox="0 0 800 400"
                        preserveAspectRatio="xMidYMax slice"
                    >
                        <defs>
                            <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#0891b2" />
                                <stop offset="100%" stopColor="#0e7490" />
                            </linearGradient>
                            <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#0891b2" />
                            </linearGradient>
                            <linearGradient id="mountain3" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#22d3ee" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>

                        <polygon
                            points="0,400 200,150 400,300 600,100 800,250 800,400"
                            fill="url(#mountain1)"
                            opacity="0.8"
                        />
                        <polygon
                            points="0,400 150,200 350,350 500,180 700,300 800,220 800,400"
                            fill="url(#mountain2)"
                            opacity="0.7"
                        />
                        <polygon
                            points="0,400 100,280 250,380 400,250 550,350 700,280 800,350 800,400"
                            fill="url(#mountain3)"
                            opacity="0.6"
                        />

                        <rect x="80" y="300" width="8" height="60" fill="#dc2626" />
                        <rect x="90" y="300" width="8" height="60" fill="#dc2626" />
                        <rect x="100" y="300" width="8" height="60" fill="#dc2626" />
                        <rect x="110" y="300" width="8" height="60" fill="#dc2626" />
                        <rect x="76" y="290" width="48" height="12" fill="#7f1d1d" />

                        <circle cx="680" cy="280" r="4" fill="#22d3ee" opacity="0.8" />
                        <circle cx="700" cy="300" r="3" fill="#22d3ee" opacity="0.6" />
                        <circle cx="660" cy="320" r="4" fill="#22d3ee" opacity="0.7" />
                        <rect x="695" y="295" width="6" height="20" fill="#22d3ee" opacity="0.5" />
                    </svg>

                    <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-cyan-300/30 rounded-lg transform rotate-12" />
                    <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-white/20 rounded-lg transform -rotate-12" />
                    <div className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-cyan-200/30 rounded-lg transform rotate-45" />
                </div>

                <div className="absolute top-8 left-8">
                    <Link href="/" className="text-2xl font-bold text-white">
                        STUDYBIT
                    </Link>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Sign In</h1>
                        <p className="text-neutral-600">Get started absolutely free</p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-neutral-900"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-neutral-900"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-neutral-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="font-medium text-cyan-600 hover:text-cyan-500">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

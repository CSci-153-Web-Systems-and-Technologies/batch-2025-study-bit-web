"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";
import { Eye, EyeOff, Mail, Lock, Loader2, User } from "lucide-react";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const supabase = createClient();

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
            return;
        }

        setSuccess(true);
        setIsLoading(false);
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
                <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-xl shadow-cyan-500/10 border border-neutral-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900">Check your email</h2>
                    <p className="text-neutral-600">
                        We&apos;ve sent a confirmation link to <span className="font-semibold">{email}</span>. Please check your inbox to confirm your account.
                    </p>
                    <div className="pt-4">
                        <Link href="/sign-in">
                            <Button
                                variant="secondary"
                                className="w-full bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                            >
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 overflow-hidden">
                <div className="absolute inset-0">
                    <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice">
                        <defs>
                            <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#0891b2" />
                                <stop offset="100%" stopColor="#0e7490" />
                            </linearGradient>
                        </defs>
                        <polygon points="0,400 200,150 400,300 600,100 800,250 800,400" fill="url(#mountain1)" opacity="0.8" />
                    </svg>
                    <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-cyan-300/30 rounded-lg transform rotate-12" />
                </div>
                <div className="absolute top-8 left-8">
                    <Link href="/" className="text-2xl font-bold text-white">STUDYBIT</Link>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Sign Up</h1>
                        <p className="text-neutral-600">Join thousands of students studying smarter</p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                        )}

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-neutral-900"
                                    placeholder="Create a password"
                                    required
                                    minLength={6}
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

                        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-neutral-600">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="font-medium text-cyan-600 hover:text-cyan-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

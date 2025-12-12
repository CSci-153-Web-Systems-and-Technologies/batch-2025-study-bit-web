"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Timer, Menu, X, User } from "lucide-react";
import { useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface HeaderProps {
    user: SupabaseUser | null;
}

const navLinks: { href: string; label: string }[] = [];

export function Header({ user }: HeaderProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-lg border-b border-white/10">
            <Container size="xl">
                <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
                    >
                        <Timer className="w-6 h-6 text-cyan-400" />
                        <span className="text-cyan-400">STUDYBIT</span>
                    </Link>

                    {navLinks.length > 0 && (
                        <ul className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
                                            pathname === link.href
                                                ? "text-white bg-white/10"
                                                : "text-neutral-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span>{user.email}</span>
                                </Link>
                                <a
                                    href="/sign-out"
                                    className="text-sm text-neutral-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                                >
                                    Sign Out
                                </a>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="text-sm text-neutral-400 hover:text-white transition-colors px-4 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-in"
                                    className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </nav>

                {mobileMenuOpen && (
                    <div id="mobile-menu" className="md:hidden py-4 border-t border-white/10">
                        <ul className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                            pathname === link.href
                                                ? "text-white bg-white/10"
                                                : "text-neutral-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-white/5"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>{user.email}</span>
                                    </Link>
                                    <a
                                        href="/sign-out"
                                        className="text-sm text-neutral-400 hover:text-white transition-colors px-4 py-3 rounded-lg hover:bg-white/5"
                                    >
                                        Sign Out
                                    </a>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/sign-in"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-sm text-neutral-400 hover:text-white transition-colors px-4 py-3 rounded-lg"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/sign-in"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-3 rounded-lg text-center"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Container>
        </header>
    );
}

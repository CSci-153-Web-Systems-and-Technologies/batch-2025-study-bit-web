"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Timer,
    LayoutDashboard,
    Library,
    TrendingUp,
    Clock,
    User,
    Settings,
    LogOut,
    Target,
    Menu,
    X,
} from "lucide-react";

const overviewLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/sessions", label: "Study Timer", icon: Clock },
    { href: "/my-decks", label: "Study Log", icon: Library },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/progress", label: "Progress", icon: TrendingUp },
    { href: "/profile", label: "Profile", icon: User },
];

const settingsLinks = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/sign-out", label: "Logout", icon: LogOut, isLogout: true },
];

interface SidebarProps {
    children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-neutral-200 flex items-center px-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 -ml-2 rounded-lg hover:bg-neutral-100"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-neutral-600" />
                    ) : (
                        <Menu className="w-6 h-6 text-neutral-600" />
                    )}
                </button>
                <Link href="/" className="flex items-center gap-2 ml-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                        <Timer className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-cyan-500">STUDYBIT</span>
                </Link>
            </div>

            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-neutral-200 flex flex-col z-40 transition-transform duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="p-6 border-b border-neutral-100">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-xl"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                            <Timer className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-cyan-500">STUDYBIT</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-3">
                            Overview
                        </h3>
                        <ul className="space-y-1">
                            {overviewLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-cyan-50 text-cyan-600"
                                                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                                            )}
                                        >
                                            <Icon className={cn("w-5 h-5", isActive ? "text-cyan-500" : "text-neutral-400")} />
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-3">
                            Settings
                        </h3>
                        <ul className="space-y-1">
                            {settingsLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                                link.isLogout
                                                    ? "text-red-500 hover:bg-red-50"
                                                    : isActive
                                                        ? "bg-cyan-50 text-cyan-600"
                                                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                                            )}
                                        >
                                            <Icon className={cn("w-5 h-5", link.isLogout ? "text-red-400" : isActive ? "text-cyan-500" : "text-neutral-400")} />
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            </aside>

            <main className="flex-1 lg:ml-64 bg-neutral-50 min-h-screen pt-14 lg:pt-0">
                {children}
            </main>
        </div>
    );
}

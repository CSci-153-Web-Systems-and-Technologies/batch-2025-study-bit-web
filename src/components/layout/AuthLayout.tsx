import Link from "next/link";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
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
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-xl text-white"
                    >
                        <span className="text-white">STUDYBIT</span>
                    </Link>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}

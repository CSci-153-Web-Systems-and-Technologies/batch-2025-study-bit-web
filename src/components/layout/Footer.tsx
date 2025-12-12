import Link from "next/link";
import { Container } from "@/components/ui";
import { Timer } from "lucide-react";

const footerLinks = {
    product: [
        { href: "/features", label: "Features" },
        { href: "/pricing", label: "Pricing" },
        { href: "/changelog", label: "Changelog" },
    ],
    company: [
        { href: "/about", label: "About" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
    ],
    legal: [
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
    ],
};

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-950 border-t border-white/10">
            <Container size="xl">
                <div className="py-12 sm:py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
                            >
                                <Timer className="w-6 h-6 text-cyan-400" />
                                <span className="text-cyan-400">STUDYBIT</span>
                            </Link>
                            <p className="mt-4 text-sm text-neutral-400 max-w-xs">
                                Your honest study companion for mastering any subject with focused, bite-sized sessions.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
                            <ul className="space-y-3">
                                {footerLinks.product.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-neutral-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-neutral-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-neutral-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="py-6 border-t border-white/10">
                    <p className="text-sm text-neutral-500 text-center">
                        © {currentYear} Study Bit. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
}

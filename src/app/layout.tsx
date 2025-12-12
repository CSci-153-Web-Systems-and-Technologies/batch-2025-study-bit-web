import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createServerClient } from "@/lib/supabase";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "STUDYBIT - Study Smarter, Not Harder",
    template: "%s | STUDYBIT",
  },
  description:
    "Your honest study companion that helps you track, measure, and improve your focus with bite-sized sessions and actionable insights.",
  keywords: [
    "study tracker",
    "focus timer",
    "productivity",
    "study sessions",
    "learning",
    "education",
  ],
  authors: [{ name: "STUDYBIT Team" }],
  openGraph: {
    title: "STUDYBIT - Study Smarter, Not Harder",
    description:
      "Your honest study companion that helps you track, measure, and improve your focus with bite-sized sessions and actionable insights.",
    type: "website",
    locale: "en_US",
    siteName: "STUDYBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "STUDYBIT - Study Smarter, Not Harder",
    description:
      "Your honest study companion that helps you track, measure, and improve your focus with bite-sized sessions and actionable insights.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white min-h-screen flex flex-col`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <Header user={user} />
        <main id="main-content" className="flex-1 pt-16" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

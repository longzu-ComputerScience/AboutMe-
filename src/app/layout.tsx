import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
    subsets: ["latin", "vietnamese"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "LongZu | Developer & Designer",
    description: "Personal portfolio showcasing projects, skills, and professional services in web development, design, and IT solutions.",
    keywords: ["developer", "portfolio", "web development", "design", "IT services", "freelancer"],
    authors: [{ name: "LongZu" }],
    openGraph: {
        title: "LongZu | Developer & Designer",
        description: "Personal portfolio showcasing projects, skills, and professional services.",
        type: "website",
        locale: "vi_VN",
    },
    twitter: {
        card: "summary_large_image",
        title: "LongZu | Developer & Designer",
        description: "Personal portfolio showcasing projects, skills, and professional services.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className="dark">
            <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
                {/* Animated Background */}
                <div className="animated-bg" />

                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="flex-1 pt-[var(--header-height)]">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </body>
        </html>
    );
}

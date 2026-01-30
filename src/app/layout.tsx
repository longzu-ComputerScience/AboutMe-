import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";

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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} className="dark">
            <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
                <NextIntlClientProvider messages={messages}>
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

                    <Analytics />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

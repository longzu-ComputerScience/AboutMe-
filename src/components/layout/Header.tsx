"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, Code2, LogOut, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { setLocale } from "@/lib/locale";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Header() {
    const t = useTranslations("nav");
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [isVietnamese, setIsVietnamese] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [user, setUser] = useState<User | null>(null);

    const navLinks = [
        { href: "/", label: t("home") },
        { href: "/about", label: t("about") },
        { href: "/projects", label: t("projects") },
        { href: "/blog", label: t("blog") },
        { href: "/services", label: t("services") },
        { href: "/cv", label: t("cv") },
        { href: "/contact", label: t("contact") },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // Check current locale on mount
        const checkLocale = async () => {
            const response = await fetch("/api/locale");
            const data = await response.json();
            setIsVietnamese(data.locale === "vi");
        };
        checkLocale();

        // Check auth state
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
    };

    const toggleLanguage = () => {
        const newLocale = isVietnamese ? "en" : "vi";
        setIsVietnamese(!isVietnamese);

        startTransition(async () => {
            await setLocale(newLocale);
            // Dispatch event for client components to update
            window.dispatchEvent(new CustomEvent("localeChange"));
            router.refresh();
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/");
        router.refresh();
    };

    // Check if current path matches link
    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-[var(--bg-primary)]/90 backdrop-blur-lg shadow-lg border-b border-[var(--border-color)]"
                    : "bg-transparent"
                    }`}
                style={{ height: "var(--header-height)" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-xl font-bold group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow duration-300">
                                <Code2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="gradient-text hidden sm:inline">LongZu</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.href)
                                        ? "text-primary-600 dark:text-white bg-primary-500/10 dark:bg-white/10 border-b-2 border-primary-500"
                                        : "text-[var(--text-primary)]/80 hover:text-primary-500 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {/* Admin link - only show when logged in */}
                            {user && (
                                <Link
                                    href="/admin/dashboard"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname.startsWith("/admin")
                                        ? "text-amber-400 bg-amber-500/10"
                                        : "text-amber-400/80 hover:text-amber-400 hover:bg-amber-500/10"
                                        }`}
                                >
                                    <Settings className="w-4 h-4 inline mr-1" />
                                    {t("admin")}
                                </Link>
                            )}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                disabled={isPending}
                                className={`px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200 text-sm font-medium flex items-center gap-1 ${isPending ? 'opacity-50' : ''}`}
                                aria-label="Toggle language"
                                title={isVietnamese ? "Switch to English" : "Chuyển sang Tiếng Việt"}
                            >
                                <span className={`transition-opacity ${isVietnamese ? "opacity-100" : "opacity-50"}`}>🇻🇳</span>
                                <span className="text-[var(--text-muted)]">/</span>
                                <span className={`transition-opacity ${!isVietnamese ? "opacity-100" : "opacity-50"}`}>🇺🇸</span>
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200"
                                aria-label="Toggle theme"
                            >
                                {isDark ? (
                                    <Sun className="w-5 h-5 text-amber-400" />
                                ) : (
                                    <Moon className="w-5 h-5 text-primary-400" />
                                )}
                            </button>

                            {/* Logout button - only show when logged in */}
                            {user && (
                                <button
                                    onClick={handleLogout}
                                    className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`md:hidden p-2.5 rounded-xl transition-all duration-200 border-2 ${isMobileMenuOpen
                                    ? "bg-primary-500 border-primary-500 text-white shadow-glow-sm"
                                    : "bg-[var(--bg-card)] border-[var(--border-color)] hover:border-primary-500/50 hover:bg-primary-500/10"
                                    }`}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </header>

            {/* Mobile Menu Backdrop Overlay - Outside header for proper stacking */}
            <div
                className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-md transition-all duration-300 ${isMobileMenuOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible pointer-events-none"
                    }`}
                style={{ zIndex: 45 }}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Content - Outside header for proper stacking */}
            <div
                className={`md:hidden fixed left-0 right-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-primary)]/98 to-[var(--bg-primary)]/95 border-t border-[var(--border-color)] transition-all duration-300 overflow-y-auto ${isMobileMenuOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-4 pointer-events-none"
                    }`}
                style={{
                    top: 'var(--header-height)',
                    maxHeight: 'calc(100vh - var(--header-height))',
                    zIndex: 49
                }}
            >
                <nav className="flex flex-col p-4 gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 flex items-center gap-3 ${isActive(link.href)
                                ? "text-white bg-primary-500 shadow-lg shadow-primary-500/20 border-l-4 border-white/30"
                                : "text-[var(--text-primary)] hover:text-primary-500 hover:bg-primary-500/10 border-l-4 border-transparent"
                                }`}
                        >
                            {isActive(link.href) && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                            {link.label}
                        </Link>
                    ))}
                    {/* Admin link in mobile - only show when logged in */}
                    {user && (
                        <>
                            <Link
                                href="/admin/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 rounded-lg text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors duration-200 text-center mt-2"
                            >
                                <Settings className="w-4 h-4 inline mr-1" />
                                {t("admin")}
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="px-4 py-3 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors duration-200 text-center mt-2"
                            >
                                <LogOut className="w-4 h-4 inline mr-1" />
                                Đăng xuất
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </>
    );
}

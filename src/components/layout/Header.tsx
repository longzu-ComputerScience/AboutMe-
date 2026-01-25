"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun, Code2 } from "lucide-react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/services", label: "Services" },
    { href: "/cv", label: "CV" },
    { href: "/contact", label: "Contact" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-dark-bg/80 backdrop-blur-lg shadow-lg border-b border-dark-border"
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
                                className="px-4 py-2 rounded-lg text-sm font-medium text-dark-text/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-amber-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-primary-400" />
                            )}
                        </button>

                        {/* Admin Link */}
                        <Link
                            href="/admin/login"
                            className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors duration-200"
                        >
                            Admin
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 bg-dark-bg/95 backdrop-blur-lg border-b border-dark-border transition-all duration-300 ${isMobileMenuOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <nav className="flex flex-col p-4 gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-3 rounded-lg text-sm font-medium text-dark-text/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/admin/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-3 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors duration-200 text-center mt-2"
                    >
                        Admin Panel
                    </Link>
                </nav>
            </div>
        </header>
    );
}

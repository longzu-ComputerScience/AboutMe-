"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Github, Linkedin, Facebook, Mail, Heart, ArrowUp } from "lucide-react";

const socialLinks = [
    { href: "https://github.com/longzu", icon: Github, label: "GitHub" },
    { href: "https://linkedin.com/in/longzu", icon: Linkedin, label: "LinkedIn" },
    { href: "https://facebook.com/longzu", icon: Facebook, label: "Facebook" },
    { href: "mailto:contact@longzu.dev", icon: Mail, label: "Email" },
];

export default function Footer() {
    const t = useTranslations("footer");
    const tNav = useTranslations("nav");
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { href: "/about", label: tNav("about") },
        { href: "/projects", label: tNav("projects") },
        { href: "/blog", label: tNav("blog") },
        { href: "/services", label: tNav("services") },
        { href: "/cv", label: tNav("cv") },
        { href: "/contact", label: tNav("contact") },
    ];

    return (
        <footer className="relative border-t border-dark-border bg-dark-bg/50 backdrop-blur-sm">
            {/* Scroll to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-purple flex items-center justify-center shadow-glow-sm hover:shadow-glow-md transition-all duration-300 hover:scale-110"
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-5 h-5 text-white" />
            </button>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold gradient-text">LongZu</h3>
                        <p className="text-dark-muted text-sm leading-relaxed">
                            {t("description")}
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:text-primary-400"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-dark-muted">
                            {t("quickLinks")}
                        </h4>
                        <nav className="grid grid-cols-2 gap-2">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-dark-text/70 hover:text-primary-400 transition-colors duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Newsletter / CTA */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-dark-muted">
                            {t("getInTouch")}
                        </h4>
                        <p className="text-sm text-dark-text/70">
                            {t("ctaDescription")}
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-accent-purple text-white text-sm font-medium hover:shadow-glow-sm transition-all duration-300"
                        >
                            <Mail className="w-4 h-4" />
                            {t("contactMe")}
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-dark-muted flex items-center gap-1">
                        © {currentYear} LongZu. {t("madeWith")}
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        {t("in")}
                    </p>
                    <p className="text-xs text-dark-muted">
                        {t("builtWith")}
                    </p>
                </div>
            </div>
        </footer>
    );
}

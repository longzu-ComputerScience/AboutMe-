"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Download, Sparkles, Code2, Palette, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import TypingEffect from "@/components/ui/TypingEffect";
import ProjectCard from "@/components/ui/ProjectCard";
import { profileData } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";

interface Project {
    id: string;
    title: string;
    title_vi: string | null;
    slug: string;
    description: string;
    description_vi: string | null;
    image_url: string | null;
    tags: string[] | null;
    demo_url: string | null;
    source_url: string | null;
    is_paid: boolean;
    category: string;
    is_featured: boolean;
}

export default function HomePage() {
    const t = useTranslations();
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [isVietnamese, setIsVietnamese] = useState(true);

    // Get locale from cookie synchronously
    useEffect(() => {
        const getCookieLocale = () => {
            const cookies = document.cookie.split("; ");
            const localeCookie = cookies.find((c) => c.startsWith("locale="));
            return localeCookie ? localeCookie.split("=")[1] : "vi";
        };

        setIsVietnamese(getCookieLocale() === "vi");

        // Listen for locale changes
        const handleLocaleChange = () => {
            setIsVietnamese(getCookieLocale() === "vi");
        };
        window.addEventListener("localeChange", handleLocaleChange);

        return () => {
            window.removeEventListener("localeChange", handleLocaleChange);
        };
    }, []);

    useEffect(() => {
        // Fetch featured projects from Supabase
        const fetchProjects = async () => {
            const { data } = await supabase
                .from("projects")
                .select("*")
                .eq("is_published", true)
                .eq("is_featured", true)
                .order("created_at", { ascending: false })
                .limit(3);

            if (data) {
                setFeaturedProjects(data);
            }
        };

        fetchProjects();
    }, []);

    // Get localized title and description
    const getLocalizedProject = (project: Project) => ({
        title: isVietnamese && project.title_vi ? project.title_vi : project.title,
        description: isVietnamese && project.description_vi ? project.description_vi : project.description,
    });

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[calc(100vh-var(--header-height))] flex items-center">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float animate-delay-300" />
                </div>

                <div className="section-container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-8 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sm text-[var(--text-secondary)]">{t("hero.badge")}</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
                            Hi, Here&apos;s{" "}
                            <span className="gradient-text">{profileData.name}</span>
                            <br />
                            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                                I&apos;m a{" "}
                                <TypingEffect
                                    texts={[
                                        "Full Stack Developer",
                                        "UI/UX Designer",
                                        "Problem Solver",
                                        "Tech Enthusiast",
                                    ]}
                                    className="text-primary-400"
                                />
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200 whitespace-pre-line">
                            {t("profile.bio")}
                        </p>

                        {/* Audience CTAs - 2 Target Groups */}
                        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto animate-slide-up animate-delay-300">
                            {/* Student CTA */}
                            <Link
                                href="/blog"
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                                <div className="relative z-10">
                                    <div className="text-3xl mb-2">{t("hero.audience.student.title")}</div>
                                    <p className="text-sm text-[var(--text-muted)] mb-3 whitespace-pre-line">
                                        {t("hero.audience.student.subtitle")}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium group-hover:gap-2 transition-all">
                                        {t("hero.audience.student.cta")}
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>

                            {/* Business CTA */}
                            <Link
                                href="/services"
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-purple/10 border border-primary-500/20 p-6 hover:border-primary-500/40 transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all" />
                                <div className="relative z-10">
                                    <div className="text-3xl mb-2">{t("hero.audience.business.title")}</div>
                                    <p className="text-sm text-[var(--text-muted)] mb-3 whitespace-pre-line">
                                        {t("hero.audience.business.subtitle")}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-primary-400 text-sm font-medium group-hover:gap-2 transition-all">
                                        {t("hero.audience.business.cta")}
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Secondary CTAs */}
                        <div className="flex items-center justify-center gap-6 mt-6 animate-slide-up animate-delay-400">
                            <Link href="/cv" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                {t("hero.cta.downloadCV")}
                            </Link>
                            <Link href="/contact" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                {t("hero.cta.contactMe")} →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
                    </div>
                </div>
            </section>

            {/* What I Do Section */}
            <section className="section-container">
                <div className="text-center mb-12">
                    <h2 className="section-title">
                        {t("sections.whatIDo.title")} <span className="gradient-text">{t("sections.whatIDo.titleHighlight")}</span>
                    </h2>
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
                        {t("sections.whatIDo.description")}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="glass-card p-6 text-center group hover:border-primary-500/30 transition-all duration-300">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
                            <Code2 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{t("services.webDev.title")}</h3>
                        <p className="text-sm text-[var(--text-muted)]">
                            {t("services.webDev.description")}
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="glass-card p-6 text-center group hover:border-accent-purple/30 transition-all duration-300">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-purple to-pink-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-lg transition-shadow">
                            <Palette className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{t("services.uiux.title")}</h3>
                        <p className="text-sm text-[var(--text-muted)]">
                            {t("services.uiux.description")}
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="glass-card p-6 text-center group hover:border-emerald-500/30 transition-all duration-300">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-shadow">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{t("services.productLaunch.title")}</h3>
                        <p className="text-sm text-[var(--text-muted)]">
                            {t("services.productLaunch.description")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="section-container">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="section-title text-left mb-2">
                            {t("sections.featuredProjects.title")} <span className="gradient-text">{t("sections.featuredProjects.titleHighlight")}</span>
                        </h2>
                        <p className="text-[var(--text-muted)]">
                            {t("sections.featuredProjects.description")}
                        </p>
                    </div>
                    <Link
                        href="/projects"
                        className="hidden sm:flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        {t("sections.featuredProjects.viewAll")}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProjects.map((project) => {
                        const localized = getLocalizedProject(project);
                        return (
                            <ProjectCard
                                key={project.id}
                                title={localized.title}
                                slug={project.slug}
                                description={localized.description}
                                image={project.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"}
                                tags={project.tags || []}
                                demoUrl={project.demo_url || undefined}
                                sourceUrl={project.source_url || undefined}
                                isPaid={project.is_paid}
                                category={project.category}
                            />
                        );
                    })}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link href="/projects" className="btn-outline inline-flex items-center gap-2">
                        {t("sections.featuredProjects.viewAll")}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-container">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-500/10 via-accent-purple/10 to-pink-500/10 border border-white/10 p-8 md:p-12 lg:p-16">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/20 rounded-full blur-3xl" />

                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {t("sections.cta.title")}{" "}
                            <span className="gradient-text">{t("sections.cta.titleHighlight")}</span>{" "}
                            {t("sections.cta.titleEnd")}
                        </h2>
                        <p className="text-[var(--text-muted)] mb-8">
                            {t("sections.cta.description")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/contact" className="btn-glow inline-flex items-center justify-center gap-2">
                                {t("sections.cta.getInTouch")}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/services" className="btn-outline inline-flex items-center justify-center gap-2">
                                {t("sections.cta.viewServices")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

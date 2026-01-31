"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Tag } from "lucide-react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Project {
    id: string;
    title: string;
    title_vi: string | null;
    slug: string;
    description: string;
    description_vi: string | null;
    content: string | null;
    content_vi: string | null;
    image_url: string | null;
    tags: string[] | null;
    demo_url: string | null;
    source_url: string | null;
    is_paid: boolean;
    category: string;
    is_featured: boolean;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isVietnamese, setIsVietnamese] = useState(true);

    // Get locale from cookie
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

    // Fetch project data from Supabase
    useEffect(() => {
        const fetchProject = async () => {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("slug", slug)
                .eq("is_published", true)
                .single();

            if (error || !data) {
                setNotFound(true);
            } else {
                setProject(data);
            }
            setIsLoading(false);
        };

        if (slug) {
            fetchProject();
        }
    }, [slug]);

    // Get localized content
    const getLocalizedField = (en: string | null, vi: string | null) => {
        if (isVietnamese && vi) return vi;
        return en || "";
    };

    if (isLoading) {
        return (
            <div className="section-container flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (notFound || !project) {
        return (
            <div className="section-container flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Link>
            </div>
        );
    }

    const title = getLocalizedField(project.title, project.title_vi);
    const description = getLocalizedField(project.description, project.description_vi);
    const content = getLocalizedField(project.content, project.content_vi);

    return (
        <>
            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Link>
            </div>

            {/* Hero */}
            <section className="section-container">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border-color)]">
                        <Image
                            src={project.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {project.is_paid ? (
                                <span className="badge badge-paid">Paid</span>
                            ) : (
                                <span className="badge badge-free">Free</span>
                            )}
                            {project.category && (
                                <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                    {project.category}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
                            <p className="text-lg text-[var(--text-muted)]">{description}</p>
                        </div>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            {project.demo_url && (
                                <a
                                    href={project.demo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-glow flex items-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Live Demo
                                </a>
                            )}
                            {project.source_url && (
                                <a
                                    href={project.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-outline flex items-center gap-2"
                                >
                                    <Github className="w-4 h-4" />
                                    View Source
                                </a>
                            )}
                            {project.is_paid && !project.demo_url && (
                                <Link href="/contact" className="btn-glow flex items-center gap-2">
                                    Request Access
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Details - PROMINENT CARD */}
            <section className="py-0 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* About This Project Card */}
                    <div className="relative bg-gradient-to-br from-primary-500/10 via-accent-purple/5 to-primary-500/10 border-2 border-primary-500/30 rounded-3xl p-8 mb-8 shadow-2xl shadow-primary-500/10">
                        {/* Decorative glow */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-primary-500/20 blur-3xl rounded-full" />

                        {/* Header with icon */}
                        <div className="relative flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                                <span className="text-2xl">📝</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)]">About This Project</h2>
                                <p className="text-sm text-primary-400">Project Overview</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative prose prose-invert dark:prose-invert max-w-none">
                            {content ? (
                                <div
                                    className="text-[var(--text-secondary)] text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
                                />
                            ) : (
                                <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                                    This project showcases {title.toLowerCase()}, built with modern technologies
                                    and best practices in mind. The application features a clean, intuitive interface
                                    designed to provide the best user experience.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Key Features Card */}
                    <div className="relative bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-8 mb-8 shadow-2xl shadow-amber-500/10">
                        {/* Decorative glow */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-amber-500/20 blur-3xl rounded-full" />

                        {/* Header with icon */}
                        <div className="relative flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                                <span className="text-2xl">✨</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">Key Features</h3>
                                <p className="text-sm text-amber-400">What makes this special</p>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="relative">
                            {(() => {
                                // Try to get key features from database
                                const keyFeaturesData = (project as { key_features?: string; key_features_vi?: string });
                                const keyFeatures = getLocalizedField(keyFeaturesData.key_features || null, keyFeaturesData.key_features_vi || null);

                                if (keyFeatures) {
                                    // Parse features from text (one per line)
                                    const features = keyFeatures.split('\n').filter(f => f.trim());
                                    return (
                                        <ul className="space-y-4">
                                            {features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                                                        <span className="text-amber-400 font-bold">{index + 1}</span>
                                                    </div>
                                                    <span className="text-[var(--text-secondary)] text-lg leading-relaxed">{feature.trim()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }

                                // Default fallback features with icons
                                const defaultFeatures = [
                                    { icon: '✨', text: 'Modern, responsive design' },
                                    { icon: '⚡', text: 'Optimized performance' },
                                    { icon: '🔒', text: 'Secure authentication' },
                                    { icon: '📱', text: 'Mobile-first approach' },
                                    { icon: '🎨', text: 'Customizable themes' },
                                ];
                                return (
                                    <ul className="space-y-4">
                                        {defaultFeatures.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                                                    <span>{feature.icon}</span>
                                                </div>
                                                <span className="text-[var(--text-secondary)] text-lg leading-relaxed">{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Tech Stack Card */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span>🛠️</span>
                            Tech Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags && project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 rounded-lg bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

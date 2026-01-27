"use client";

import { useState, useEffect } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import { Search, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
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
    price: number | null;
    category: string;
    is_featured: boolean;
}

const categories = ["All", "Web App", "Tool", "Template", "Mini App", "AI Tool"];
const filters = ["All", "Free", "Paid"];

export default function ProjectsPage() {
    const t = useTranslations();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [priceFilter, setPriceFilter] = useState("All");
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
        // Fetch projects from Supabase
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("is_published", true)
                .order("is_featured", { ascending: false })
                .order("created_at", { ascending: false });

            if (!error && data) {
                setProjects(data);
            }
            setIsLoading(false);
        };

        fetchProjects();
    }, []);

    // Get localized title and description
    const getLocalizedProject = (project: Project) => ({
        ...project,
        title: isVietnamese && project.title_vi ? project.title_vi : project.title,
        description: isVietnamese && project.description_vi ? project.description_vi : project.description,
    });

    const filteredProjects = projects.filter((project) => {
        const localizedProject = getLocalizedProject(project);
        const matchesSearch = localizedProject.title.toLowerCase().includes(search.toLowerCase()) ||
            localizedProject.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "All" || project.category === category;
        const matchesPrice = priceFilter === "All" ||
            (priceFilter === "Free" && !project.is_paid) ||
            (priceFilter === "Paid" && project.is_paid);

        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (isLoading) {
        return (
            <div className="section-container flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <section className="section-container pb-8">
                <div className="text-center">
                    <h1 className="section-title">
                        {t("projects.title")} <span className="gradient-text">{t("projects.titleHighlight")}</span>
                    </h1>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        {t("projects.description")}
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Search */}
                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                        <input
                            type="text"
                            placeholder={t("projects.searchPlaceholder")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-dark-muted" />
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${category === cat
                                            ? "bg-primary-500 text-white"
                                            : "bg-white/5 hover:bg-white/10 text-dark-text/70"
                                            }`}
                                    >
                                        {cat === "All" ? t("projects.filters.all") : cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="flex gap-2 ml-4">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setPriceFilter(filter)}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${priceFilter === filter
                                        ? filter === "Free"
                                            ? "bg-emerald-500 text-white"
                                            : filter === "Paid"
                                                ? "bg-amber-500 text-white"
                                                : "bg-primary-500 text-white"
                                        : "bg-white/5 hover:bg-white/10 text-dark-text/70"
                                        }`}
                                >
                                    {filter === "All"
                                        ? t("projects.filters.all")
                                        : filter === "Free"
                                            ? t("projects.filters.free")
                                            : t("projects.filters.paid")}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                {filteredProjects.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => {
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
                ) : (
                    <div className="text-center py-16">
                        <p className="text-dark-muted text-lg">{t("projects.noResults")}</p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setCategory("All");
                                setPriceFilter("All");
                            }}
                            className="mt-4 text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            {t("projects.clearFilters")}
                        </button>
                    </div>
                )}
            </section>
        </>
    );
}

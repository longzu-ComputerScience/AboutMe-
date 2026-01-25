"use client";

import { useState } from "react";
import { Metadata } from "next";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/lib/mockData";
import { Search, Filter } from "lucide-react";

const categories = ["All", "Web App", "Tool", "Template", "Mini App", "AI Tool"];
const filters = ["All", "Free", "Paid"];

export default function ProjectsPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [priceFilter, setPriceFilter] = useState("All");

    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "All" || project.category === category;
        const matchesPrice = priceFilter === "All" ||
            (priceFilter === "Free" && !project.isPaid) ||
            (priceFilter === "Paid" && project.isPaid);

        return matchesSearch && matchesCategory && matchesPrice;
    });

    return (
        <>
            {/* Header */}
            <section className="section-container pb-8">
                <div className="text-center">
                    <h1 className="section-title">
                        My <span className="gradient-text">Projects</span>
                    </h1>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        A collection of projects I&apos;ve worked on, from web applications to tools and templates.
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
                            placeholder="Search projects..."
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
                                        {cat}
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
                                    {filter}
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
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.id} {...project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-dark-muted text-lg">No projects found matching your criteria.</p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setCategory("All");
                                setPriceFilter("All");
                            }}
                            className="mt-4 text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>
        </>
    );
}

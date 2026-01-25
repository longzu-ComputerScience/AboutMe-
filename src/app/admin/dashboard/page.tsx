"use client";

import Link from "next/link";
import {
    FolderKanban,
    FileText,
    Briefcase,
    Eye,
    TrendingUp,
    Users,
    Plus,
    ArrowRight,
} from "lucide-react";
import { projects, blogPosts, services } from "@/lib/mockData";

const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderKanban, color: "primary" },
    { label: "Blog Posts", value: blogPosts.length, icon: FileText, color: "purple" },
    { label: "Services", value: services.length, icon: Briefcase, color: "pink" },
    { label: "Page Views", value: "12.5k", icon: Eye, color: "emerald" },
];

const quickActions = [
    { label: "New Project", href: "/admin/projects/new", icon: FolderKanban },
    { label: "New Blog Post", href: "/admin/blog/new", icon: FileText },
    { label: "Edit Services", href: "/admin/services", icon: Briefcase },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-dark-muted">Welcome back! Here&apos;s an overview of your portfolio.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-dark-card border border-dark-border rounded-2xl p-5"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-dark-muted mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color === "primary"
                                        ? "bg-primary-500/20 text-primary-400"
                                        : stat.color === "purple"
                                            ? "bg-accent-purple/20 text-accent-purple"
                                            : stat.color === "pink"
                                                ? "bg-pink-500/20 text-pink-400"
                                                : "bg-emerald-500/20 text-emerald-400"
                                    }`}
                            >
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400">
                            <TrendingUp className="w-3 h-3" />
                            <span>+12% from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-primary-500/30 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-primary-400" />
                            </div>
                            <span className="font-medium">{action.label}</span>
                            <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Content */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Projects</h2>
                        <Link
                            href="/admin/projects"
                            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {projects.slice(0, 4).map((project) => (
                            <div
                                key={project.id}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                    <FolderKanban className="w-5 h-5 text-dark-muted" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{project.title}</p>
                                    <p className="text-xs text-dark-muted">{project.category}</p>
                                </div>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${project.isPaid
                                            ? "bg-amber-500/20 text-amber-400"
                                            : "bg-emerald-500/20 text-emerald-400"
                                        }`}
                                >
                                    {project.isPaid ? "Paid" : "Free"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Blog Posts */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Blog Posts</h2>
                        <Link
                            href="/admin/blog"
                            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {blogPosts.slice(0, 4).map((post) => (
                            <div
                                key={post.id}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-dark-muted" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{post.title}</p>
                                    <p className="text-xs text-dark-muted">{post.date}</p>
                                </div>
                                {post.featured && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400">
                                        Featured
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Visitors Info (Placeholder) */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5 text-primary-400" />
                    <h2 className="text-lg font-semibold">Visitor Analytics</h2>
                </div>
                <div className="h-48 flex items-center justify-center border border-dashed border-dark-border rounded-xl">
                    <p className="text-dark-muted text-sm">
                        Analytics integration coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
}

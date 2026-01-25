"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ExternalLink,
    MoreVertical,
} from "lucide-react";
import { projects } from "@/lib/mockData";

export default function AdminProjectsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProjects = projects.filter(
        (project) =>
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <p className="text-dark-muted">Manage your portfolio projects</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="btn-glow inline-flex items-center gap-2 justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Add Project
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
            </div>

            {/* Projects Table */}
            <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-border">
                                <th className="text-left py-4 px-6 text-sm font-medium text-dark-muted">
                                    Project
                                </th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-dark-muted">
                                    Category
                                </th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-dark-muted">
                                    Type
                                </th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-dark-muted">
                                    Tags
                                </th>
                                <th className="text-right py-4 px-6 text-sm font-medium text-dark-muted">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project) => (
                                <tr
                                    key={project.id}
                                    className="border-b border-dark-border last:border-b-0 hover:bg-white/5 transition-colors"
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 relative">
                                                <Image
                                                    src={project.image}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium">{project.title}</p>
                                                <p className="text-xs text-dark-muted truncate max-w-[200px]">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-dark-text/70">
                                            {project.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${project.isPaid
                                                    ? "bg-amber-500/20 text-amber-400"
                                                    : "bg-emerald-500/20 text-emerald-400"
                                                }`}
                                        >
                                            {project.isPaid ? "Paid" : "Free"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex gap-1">
                                            {project.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs px-2 py-1 rounded bg-white/5 text-dark-muted"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {project.tags.length > 2 && (
                                                <span className="text-xs px-2 py-1 text-dark-muted">
                                                    +{project.tags.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {project.demoUrl && (
                                                <a
                                                    href={project.demoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                                    title="View Demo"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                            <button
                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProjects.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-dark-muted">No projects found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

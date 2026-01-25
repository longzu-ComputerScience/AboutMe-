"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Project {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    category: string;
    tags: string[] | null;
    is_paid: boolean;
    demo_url: string | null;
    is_published: boolean;
}

export default function AdminProjectsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Check auth and fetch projects
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
                return;
            }

            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) {
                setProjects(data);
            }
            setIsLoading(false);
        };
        init();
    }, [router]);

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);

        if (!error) {
            setProjects(prev => prev.filter(p => p.id !== id));
        }
        setDeleteId(null);
    };

    const filteredProjects = projects.filter(
        (project) =>
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-2">Delete Project?</h3>
                        <p className="text-dark-muted mb-6">
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                    Status
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
                                                {project.image_url ? (
                                                    <Image
                                                        src={project.image_url}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-purple/20" />
                                                )}
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
                                            className={`text-xs px-2 py-1 rounded-full ${project.is_paid
                                                ? "bg-amber-500/20 text-amber-400"
                                                : "bg-emerald-500/20 text-emerald-400"
                                                }`}
                                        >
                                            {project.is_paid ? "Paid" : "Free"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${project.is_published
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : "bg-gray-500/20 text-gray-400"
                                                }`}
                                        >
                                            {project.is_published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {project.demo_url && (
                                                <a
                                                    href={project.demo_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                                    title="View Demo"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                            <Link
                                                href={`/admin/projects/${project.id}`}
                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(project.id)}
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
                        <p className="text-dark-muted">
                            {projects.length === 0
                                ? "No projects yet. Create your first project!"
                                : "No projects found"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

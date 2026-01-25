"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, Star } from "lucide-react";
import { blogPosts } from "@/lib/mockData";

export default function AdminBlogPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPosts = blogPosts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Blog Posts</h1>
                    <p className="text-dark-muted">Manage your blog content</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="btn-glow inline-flex items-center gap-2 justify-center"
                >
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
            </div>

            {/* Posts Grid */}
            <div className="grid gap-4">
                {filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-primary-500/30 transition-colors"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-2">
                                    <h3 className="font-semibold">{post.title}</h3>
                                    {post.featured && (
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                                    )}
                                </div>
                                <p className="text-sm text-dark-muted line-clamp-2 mb-3">
                                    {post.excerpt}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-dark-muted">
                                    <span>{post.date}</span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                    <span>•</span>
                                    <div className="flex gap-1">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded bg-white/5"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    title="View Post"
                                >
                                    <Eye className="w-4 h-4" />
                                </Link>
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
                        </div>
                    </div>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="py-12 text-center bg-dark-card border border-dark-border rounded-2xl">
                    <p className="text-dark-muted">No posts found</p>
                </div>
            )}
        </div>
    );
}

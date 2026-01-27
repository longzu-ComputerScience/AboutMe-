"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit, Trash2, Eye, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string | null;
    slug: string;
    tags: string[] | null;
    read_time: string | null;
    is_featured: boolean;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
}

const formatDate = (value?: string | null) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
};

export default function AdminBlogPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
                return;
            }

            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) {
                setPosts(data);
            }
            setIsLoading(false);
        };

        init();
    }, [router]);

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("blog_posts")
            .delete()
            .eq("id", id);

        if (!error) {
            setPosts(prev => prev.filter((post) => post.id !== id));
        }
        setDeleteId(null);
    };

    const filteredPosts = posts.filter((post) => {
        const term = searchTerm.toLowerCase();
        return (
            post.title.toLowerCase().includes(term) ||
            post.slug.toLowerCase().includes(term) ||
            (post.tags || []).some((tag) => tag.toLowerCase().includes(term))
        );
    });

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
                        <h3 className="text-lg font-semibold mb-2">Delete Post?</h3>
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
                                    {post.is_featured && (
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                                    )}
                                </div>
                                <p className="text-sm text-dark-muted line-clamp-2 mb-3">
                                    {post.excerpt || "No excerpt provided."}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-dark-muted">
                                    <span>
                                        {post.is_published
                                            ? formatDate(post.published_at || post.created_at)
                                            : "Draft"}
                                    </span>
                                    {post.read_time && (
                                        <>
                                            <span className="text-dark-muted">|</span>
                                            <span>{post.read_time}</span>
                                        </>
                                    )}
                                    <span className="text-dark-muted">|</span>
                                    <span
                                        className={`px-2 py-0.5 rounded ${post.is_published
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-gray-500/20 text-gray-400"
                                            }`}
                                    >
                                        {post.is_published ? "Published" : "Draft"}
                                    </span>
                                </div>
                                {(post.tags || []).length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {(post.tags || []).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded bg-white/5 text-xs text-dark-text/70"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
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
                                <Link
                                    href={`/admin/blog/${post.id}`}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => setDeleteId(post.id)}
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
                    <p className="text-dark-muted">
                        {posts.length === 0 ? "No posts yet. Create your first post!" : "No posts found"}
                    </p>
                </div>
            )}
        </div>
    );
}

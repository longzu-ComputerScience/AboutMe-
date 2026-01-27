import { Metadata } from "next";
import BlogCard from "@/components/ui/BlogCard";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "Blog | LongZu",
    description: "Articles and tutorials about web development, design, and technology.",
};

export const dynamic = "force-dynamic";

interface BlogPost {
    id: string;
    title: string;
    title_vi: string | null;
    excerpt: string | null;
    excerpt_vi: string | null;
    slug: string;
    tags: string[] | null;
    read_time: string | null;
    is_featured: boolean;
    published_at: string | null;
    created_at: string;
}

const formatDate = (value?: string | null) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
};

export default async function BlogPage() {
    const locale = cookies().get("locale")?.value || "vi";
    const isVietnamese = locale === "vi";

    const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .order("created_at", { ascending: false });

    const posts = (data || []) as BlogPost[];
    const featuredPost = posts.find((post) => post.is_featured) || null;
    const regularPosts = posts.filter((post) => !post.is_featured);

    return (
        <>
            {/* Header */}
            <section className="section-container pb-8">
                <div className="text-center">
                    <h1 className="section-title">
                        Knowledge <span className="gradient-text">Hub</span>
                    </h1>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        Articles, tutorials, and insights about web development, design, and technology.
                    </p>
                </div>
            </section>

            {/* Search */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-card border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-dark-muted mb-4">
                        Featured Article
                    </h2>
                    <BlogCard
                        title={
                            isVietnamese && featuredPost.title_vi
                                ? featuredPost.title_vi
                                : featuredPost.title
                        }
                        excerpt={
                            isVietnamese && featuredPost.excerpt_vi
                                ? featuredPost.excerpt_vi
                                : featuredPost.excerpt || ""
                        }
                        slug={featuredPost.slug}
                        date={formatDate(featuredPost.published_at || featuredPost.created_at)}
                        readTime={featuredPost.read_time || "Quick read"}
                        tags={featuredPost.tags || []}
                        featured
                    />
                </section>
            )}

            {/* All Posts */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-dark-muted mb-4">
                    Recent Articles
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularPosts.map((post) => (
                        <BlogCard
                            key={post.id}
                            title={isVietnamese && post.title_vi ? post.title_vi : post.title}
                            excerpt={
                                isVietnamese && post.excerpt_vi ? post.excerpt_vi : post.excerpt || ""
                            }
                            slug={post.slug}
                            date={formatDate(post.published_at || post.created_at)}
                            readTime={post.read_time || "Quick read"}
                            tags={post.tags || []}
                        />
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="py-12 text-center bg-dark-card border border-dark-border rounded-2xl">
                        <p className="text-dark-muted">No posts available yet.</p>
                    </div>
                )}
            </section>
        </>
    );
}

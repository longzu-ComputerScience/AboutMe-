import { Metadata } from "next";
import BlogCard from "@/components/ui/BlogCard";
import { blogPosts } from "@/lib/mockData";
import { Search } from "lucide-react";

export const metadata: Metadata = {
    title: "Blog | LongZu",
    description: "Articles and tutorials about web development, design, and technology.",
};

export default function BlogPage() {
    const featuredPost = blogPosts.find((post) => post.featured);
    const regularPosts = blogPosts.filter((post) => !post.featured);

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
                    <BlogCard {...featuredPost} featured />
                </section>
            )}

            {/* All Posts */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-dark-muted mb-4">
                    Recent Articles
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularPosts.map((post) => (
                        <BlogCard key={post.id} {...post} />
                    ))}
                </div>
            </section>
        </>
    );
}

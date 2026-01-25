import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, Share2, Bookmark } from "lucide-react";
import { blogPosts } from "@/lib/mockData";
import { notFound } from "next/navigation";

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) return { title: "Post Not Found" };

    return {
        title: `${post.title} | LongZu Blog`,
        description: post.excerpt,
    };
}

export default function BlogPostPage({ params }: Props) {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <>
            {/* Back Button */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-dark-muted hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>
            </div>

            {/* Article Header */}
            <article className="section-container">
                <div className="max-w-4xl mx-auto">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-dark-muted mb-6">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        {post.title}
                    </h1>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10 hover:bg-primary-500/20 hover:text-primary-400 transition-colors cursor-pointer"
                            >
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mb-12">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <Bookmark className="w-4 h-4" />
                            Save
                        </button>
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        <p className="lead text-xl text-dark-text/80 mb-8">
                            {post.excerpt}
                        </p>

                        <h2>Introduction</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>

                        <h2>Getting Started</h2>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                            culpa qui officia deserunt mollit anim id est laborum.
                        </p>

                        <pre className="bg-dark-card border border-dark-border rounded-xl p-4 overflow-x-auto">
                            <code>{`// Example code
const greeting = "Hello, World!";
console.log(greeting);`}</code>
                        </pre>

                        <h2>Key Takeaways</h2>
                        <ul>
                            <li>First important point about this topic</li>
                            <li>Second key learning from the article</li>
                            <li>Third actionable insight to implement</li>
                            <li>Fourth best practice to follow</li>
                        </ul>

                        <h2>Conclusion</h2>
                        <p>
                            In conclusion, understanding these concepts will help you build better applications.
                            Keep practicing and stay curious!
                        </p>
                    </div>

                    {/* Author */}
                    <div className="mt-16 pt-8 border-t border-dark-border">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-2xl font-bold">
                                LZ
                            </div>
                            <div>
                                <p className="font-semibold">LongZu</p>
                                <p className="text-sm text-dark-muted">Full Stack Developer & Designer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}

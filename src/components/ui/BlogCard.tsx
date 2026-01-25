import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogCardProps {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    readTime: string;
    tags: string[];
    featured?: boolean;
}

export default function BlogCard({
    title,
    excerpt,
    slug,
    date,
    readTime,
    tags,
    featured = false,
}: BlogCardProps) {
    return (
        <article
            className={`group relative bg-dark-card border border-dark-border rounded-2xl p-6 card-hover ${featured ? "md:col-span-2 md:flex md:gap-6" : ""
                }`}
        >
            {/* Featured badge */}
            {featured && (
                <div className="absolute -top-3 left-6">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-primary-500 to-accent-purple text-white shadow-glow-sm">
                        Featured
                    </span>
                </div>
            )}

            <div className={`flex flex-col ${featured ? "md:flex-1" : ""}`}>
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-dark-muted mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {date}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {readTime}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors duration-200 mb-2">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-dark-muted line-clamp-2 mb-4">
                    {excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-md bg-white/5 text-dark-text/70 hover:bg-primary-500/20 hover:text-primary-400 transition-colors cursor-pointer"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Read More */}
                <Link
                    href={`/blog/${slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors group/link mt-auto"
                >
                    Read More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </article>
    );
}

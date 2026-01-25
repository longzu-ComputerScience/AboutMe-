import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Lock } from "lucide-react";

interface ProjectCardProps {
    title: string;
    description: string;
    image: string;
    tags: string[];
    demoUrl?: string;
    sourceUrl?: string;
    slug: string;
    isPaid?: boolean;
    category?: string;
}

export default function ProjectCard({
    title,
    description,
    image,
    tags,
    demoUrl,
    sourceUrl,
    slug,
    isPaid = false,
    category,
}: ProjectCardProps) {
    return (
        <div className="group relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden card-hover">
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-60" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {isPaid ? (
                        <span className="badge badge-paid flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Paid
                        </span>
                    ) : (
                        <span className="badge badge-free">Free</span>
                    )}
                    {category && (
                        <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/30">
                            {category}
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors duration-200">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm text-dark-muted line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 4).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-md bg-white/5 text-dark-text/70"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                    <Link
                        href={`/projects/${slug}`}
                        className="flex-1 py-2 text-center text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                    >
                        View Details
                    </Link>
                    {demoUrl && (
                        <a
                            href={demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/10 hover:bg-primary-500/20 hover:text-primary-400 transition-all duration-200"
                            aria-label="Demo"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                    {sourceUrl && (
                        <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                            aria-label="Source code"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

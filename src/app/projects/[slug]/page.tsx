import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import { projects } from "@/lib/mockData";
import { notFound } from "next/navigation";

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) return { title: "Project Not Found" };

    return {
        title: `${project.title} | LongZu`,
        description: project.description,
    };
}

export default function ProjectDetailPage({ params }: Props) {
    const project = projects.find((p) => p.slug === params.slug);

    if (!project) {
        notFound();
    }

    return (
        <>
            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-dark-muted hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </Link>
            </div>

            {/* Hero */}
            <section className="section-container">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-dark-border">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {project.isPaid ? (
                                <span className="badge badge-paid">Paid</span>
                            ) : (
                                <span className="badge badge-free">Free</span>
                            )}
                            {project.category && (
                                <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                    {project.category}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                            <p className="text-lg text-dark-muted">{project.description}</p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-white/10"
                                >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-glow flex items-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Live Demo
                                </a>
                            )}
                            {project.sourceUrl && (
                                <a
                                    href={project.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-outline flex items-center gap-2"
                                >
                                    <Github className="w-4 h-4" />
                                    View Source
                                </a>
                            )}
                            {project.isPaid && !project.demoUrl && (
                                <Link href="/contact" className="btn-glow flex items-center gap-2">
                                    Request Access
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Details */}
            <section className="section-container">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">About This Project</h2>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-dark-text/80">
                            This project showcases {project.title.toLowerCase()}, built with modern technologies
                            and best practices in mind. The application features a clean, intuitive interface
                            designed to provide the best user experience.
                        </p>
                        <h3 className="text-xl font-semibold mt-8 mb-4">Key Features</h3>
                        <ul className="space-y-2 text-dark-text/80">
                            <li>✨ Modern, responsive design</li>
                            <li>⚡ Optimized performance</li>
                            <li>🔒 Secure authentication</li>
                            <li>📱 Mobile-first approach</li>
                            <li>🎨 Customizable themes</li>
                        </ul>
                        <h3 className="text-xl font-semibold mt-8 mb-4">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

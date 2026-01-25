import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Sparkles, Code2, Palette, Rocket } from "lucide-react";
import TypingEffect from "@/components/ui/TypingEffect";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects, profileData } from "@/lib/mockData";

export default function HomePage() {
    const featuredProjects = projects.slice(0, 3);

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[calc(100vh-var(--header-height))] flex items-center">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float animate-delay-300" />
                </div>

                <div className="section-container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sm text-dark-text/80">Available for freelance work</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
                            Hi, I&apos;m{" "}
                            <span className="gradient-text">{profileData.name}</span>
                            <br />
                            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                                I&apos;m a{" "}
                                <TypingEffect
                                    texts={[
                                        "Full Stack Developer",
                                        "UI/UX Designer",
                                        "Problem Solver",
                                        "Tech Enthusiast",
                                    ]}
                                    className="text-primary-400"
                                />
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-dark-muted max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200">
                            {profileData.bio}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-300">
                            <Link href="/projects" className="btn-glow flex items-center gap-2">
                                View Projects
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/cv" className="btn-outline flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download CV
                            </Link>
                            <Link
                                href="/contact"
                                className="px-6 py-3 text-dark-text/80 hover:text-white transition-colors"
                            >
                                Contact Me →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
                    </div>
                </div>
            </section>

            {/* What I Do Section */}
            <section className="section-container">
                <div className="text-center mb-12">
                    <h2 className="section-title">
                        What I <span className="gradient-text">Do</span>
                    </h2>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        I specialize in building modern web applications and creating beautiful user experiences.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="glass-card p-6 text-center group hover:border-primary-500/30 transition-all duration-300">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
                            <Code2 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Web Development</h3>
                        <p className="text-sm text-dark-muted">
                            Building fast, scalable web applications with modern technologies like React, Next.js, and Node.js.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="glass-card p-6 text-center group hover:border-accent-purple/30 transition-all duration-300">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-purple to-pink-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-lg transition-shadow">
                            <Palette className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">UI/UX Design</h3>
                        <p className="text-sm text-dark-muted">
                            Crafting intuitive, beautiful interfaces that users love. Focus on accessibility and user experience.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="glass-card p-6 text-center group hover:border-emerald-500/30 transition-all duration-300">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-shadow">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Product Launch</h3>
                        <p className="text-sm text-dark-muted">
                            From idea to deployment. I help bring your products to market with best practices and optimization.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="section-container">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="section-title text-left mb-2">
                            Featured <span className="gradient-text">Projects</span>
                        </h2>
                        <p className="text-dark-muted">
                            Some of my recent work that I&apos;m proud of.
                        </p>
                    </div>
                    <Link
                        href="/projects"
                        className="hidden sm:flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProjects.map((project) => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link href="/projects" className="btn-outline inline-flex items-center gap-2">
                        View All Projects
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-container">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-500/10 via-accent-purple/10 to-pink-500/10 border border-white/10 p-8 md:p-12 lg:p-16">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/20 rounded-full blur-3xl" />

                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Let&apos;s Build Something{" "}
                            <span className="gradient-text">Amazing</span> Together
                        </h2>
                        <p className="text-dark-muted mb-8">
                            Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can work together to bring your ideas to life.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/contact" className="btn-glow inline-flex items-center justify-center gap-2">
                                Get in Touch
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/services" className="btn-outline inline-flex items-center justify-center gap-2">
                                View Services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

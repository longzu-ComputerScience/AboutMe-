import { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, Calendar } from "lucide-react";
import SkillBadge from "@/components/ui/SkillBadge";
import Timeline from "@/components/ui/Timeline";
import { profileData, skills, timeline } from "@/lib/mockData";

export const metadata: Metadata = {
    title: "About | LongZu",
    description: "Learn more about LongZu - Full Stack Developer & Designer based in Vietnam.",
};

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="section-container">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="relative">
                        <div className="relative w-full max-w-md mx-auto aspect-square">
                            {/* Background decoration */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl rotate-6 opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple to-pink-500 rounded-3xl -rotate-3 opacity-20" />

                            {/* Image container */}
                            <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/10">
                                <Image
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                                    alt={profileData.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Floating badges */}
                            <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl bg-dark-card border border-dark-border shadow-lg">
                                <p className="text-sm font-medium gradient-text">5+ Years Experience</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-primary-400 font-medium mb-2">About Me</p>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                I&apos;m <span className="gradient-text">{profileData.name}</span>
                            </h1>
                            <p className="text-xl text-dark-muted">{profileData.title}</p>
                        </div>

                        <p className="text-dark-text/80 leading-relaxed">
                            I&apos;m a passionate developer with a love for creating beautiful, functional digital experiences.
                            With expertise in modern web technologies, I help businesses and individuals bring their ideas to life.
                        </p>

                        <p className="text-dark-text/80 leading-relaxed">
                            When I&apos;m not coding, you can find me exploring new technologies, contributing to open-source projects,
                            or sharing knowledge through blog posts and tutorials.
                        </p>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                                <MapPin className="w-4 h-4 text-primary-400" />
                                <span className="text-sm">{profileData.location}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                                <Mail className="w-4 h-4 text-primary-400" />
                                <span className="text-sm">{profileData.email}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                                <Calendar className="w-4 h-4 text-primary-400" />
                                <span className="text-sm">Available for hire</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section className="section-container">
                <div className="text-center mb-12">
                    <h2 className="section-title">
                        My <span className="gradient-text">Skills</span>
                    </h2>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        Technologies and tools I work with to build amazing products.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {skills.map((skill) => (
                        <SkillBadge key={skill.name} {...skill} />
                    ))}
                </div>
            </section>

            {/* Timeline Section */}
            <section className="section-container">
                <div className="text-center mb-12">
                    <h2 className="section-title">
                        My <span className="gradient-text">Journey</span>
                    </h2>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        Education, work experience, and key achievements along the way.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Timeline items={timeline} />
                </div>
            </section>
        </>
    );
}

import { Metadata } from "next";
import Link from "next/link";
import { Download, FileText, Eye, Palette } from "lucide-react";
import { cvData } from "@/lib/mockData";

export const metadata: Metadata = {
    title: "CV | LongZu",
    description: "View and download my CV. Also check out my CV templates.",
};

export default function CVPage() {
    return (
        <>
            {/* Header */}
            <section className="section-container pb-8">
                <div className="text-center">
                    <h1 className="section-title">
                        My <span className="gradient-text">CV</span>
                    </h1>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        View my resume and download it in PDF format. Also check out my CV templates.
                    </p>
                </div>
            </section>

            {/* CV Preview & Download */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* CV Preview */}
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary-400" />
                            </div>
                            <div>
                                <h2 className="font-semibold">My Resume</h2>
                                <p className="text-sm text-dark-muted">Updated January 2024</p>
                            </div>
                        </div>

                        {/* Preview Frame */}
                        <div className="aspect-[3/4] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mb-6">
                            <div className="text-center p-8">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-dark-muted" />
                                <p className="text-dark-muted">CV Preview</p>
                                <p className="text-xs text-dark-muted mt-2">PDF format ready for download</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 btn-glow flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" />
                                Download CV
                            </button>
                            <button className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="space-y-6">
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h3 className="font-semibold mb-4">Quick Summary</h3>
                            <ul className="space-y-3 text-sm text-dark-text/80">
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                                    5+ years of experience in web development
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-accent-purple mt-1.5 flex-shrink-0" />
                                    Proficient in React, Next.js, Node.js, Python
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                                    Bachelor&apos;s in Computer Science
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                                    Multiple successful projects delivered
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                    Strong problem-solving skills
                                </li>
                            </ul>
                        </div>

                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h3 className="font-semibold mb-4">Contact Information</h3>
                            <ul className="space-y-2 text-sm text-dark-text/80">
                                <li>📧 contact@longzu.dev</li>
                                <li>📍 Vietnam</li>
                                <li>💼 Available for freelance</li>
                            </ul>
                            <Link
                                href="/contact"
                                className="mt-4 inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm"
                            >
                                Get in touch →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CV Templates */}
            <section className="section-container">
                <div className="text-center mb-12">
                    <h2 className="section-title">
                        CV <span className="gradient-text">Templates</span>
                    </h2>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        Need a professional CV? Check out my templates designed for developers and designers.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {cvData.templates.map((template) => (
                        <div
                            key={template.id}
                            className="group bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-primary-500/30 transition-colors"
                        >
                            <div className="aspect-[3/4] bg-white/5 flex items-center justify-center">
                                <div className="text-center">
                                    <Palette className="w-12 h-12 mx-auto mb-2 text-dark-muted" />
                                    <p className="text-sm text-dark-muted">{template.name}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium mb-2">{template.name}</h3>
                                <button className="w-full py-2 text-sm rounded-lg bg-white/10 hover:bg-primary-500/20 hover:text-primary-400 transition-colors">
                                    Preview Template
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

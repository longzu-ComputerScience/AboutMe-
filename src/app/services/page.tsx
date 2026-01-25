import { Metadata } from "next";
import ServiceCard from "@/components/ui/ServiceCard";
import { services } from "@/lib/mockData";
import { MessageSquare, Clock, Shield, Headphones } from "lucide-react";

export const metadata: Metadata = {
    title: "Services | LongZu",
    description: "Professional web development and design services tailored to your needs.",
};

const benefits = [
    {
        icon: MessageSquare,
        title: "Clear Communication",
        description: "Regular updates and transparent process throughout the project.",
    },
    {
        icon: Clock,
        title: "On-Time Delivery",
        description: "Committed to meeting deadlines without compromising quality.",
    },
    {
        icon: Shield,
        title: "Quality Guarantee",
        description: "Rigorous testing and attention to detail in every project.",
    },
    {
        icon: Headphones,
        title: "Ongoing Support",
        description: "Post-launch support and maintenance options available.",
    },
];

export default function ServicesPage() {
    return (
        <>
            {/* Header */}
            <section className="section-container pb-8">
                <div className="text-center">
                    <h1 className="section-title">
                        My <span className="gradient-text">Services</span>
                    </h1>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        Professional web development and design services to help you build your online presence.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {services.map((service) => (
                        <ServiceCard key={service.id} {...service} />
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="section-container">
                <div className="text-center mb-12">
                    <h2 className="section-title">
                        Why Work <span className="gradient-text">With Me</span>
                    </h2>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        I bring professionalism, creativity, and technical expertise to every project.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-primary-500/30 transition-colors text-center"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-purple/20 flex items-center justify-center">
                                <benefit.icon className="w-6 h-6 text-primary-400" />
                            </div>
                            <h3 className="font-semibold mb-2">{benefit.title}</h3>
                            <p className="text-sm text-dark-muted">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="section-container">
                <div className="text-center p-8 md:p-12 rounded-3xl bg-gradient-to-r from-primary-500/10 via-accent-purple/10 to-pink-500/10 border border-white/10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Ready to Start Your Project?
                    </h2>
                    <p className="text-dark-muted mb-6 max-w-xl mx-auto">
                        Let&apos;s discuss your requirements and find the best solution for your needs.
                    </p>
                    <a href="/contact" className="btn-glow inline-flex items-center gap-2">
                        Get a Free Quote
                    </a>
                </div>
            </section>
        </>
    );
}

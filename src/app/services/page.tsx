import { Metadata } from "next";
import ServiceCard from "@/components/ui/ServiceCard";
import { MessageSquare, Clock, Shield, Headphones } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
    title: "Services | LongZu",
    description: "Professional web development and design services tailored to your needs.",
};

export const dynamic = "force-dynamic";

interface ServiceRecord {
    id: string;
    title: string;
    title_vi: string | null;
    description: string | null;
    description_vi: string | null;
    price: string | null;
    price_note: string | null;
    features: string[] | null;
    features_vi: string[] | null;
    is_highlighted: boolean;
    is_active: boolean;
    cta_text: string | null;
    cta_text_vi: string | null;
}

export default async function ServicesPage() {
    const locale = cookies().get("locale")?.value || "vi";
    const isVietnamese = locale === "vi";
    const t = await getTranslations("servicesPage");

    const { data } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    const services = (data || []) as ServiceRecord[];
    const benefits = [
        {
            icon: MessageSquare,
            title: t("benefits.communication.title"),
            description: t("benefits.communication.description"),
        },
        {
            icon: Clock,
            title: t("benefits.delivery.title"),
            description: t("benefits.delivery.description"),
        },
        {
            icon: Shield,
            title: t("benefits.quality.title"),
            description: t("benefits.quality.description"),
        },
        {
            icon: Headphones,
            title: t("benefits.support.title"),
            description: t("benefits.support.description"),
        },
    ];

    return (
        <>
            {/* Header */}
            <section className="section-container pb-8">
                <div className="text-center">
                    <h1 className="section-title">
                        {t("title")} <span className="gradient-text">{t("titleHighlight")}</span>
                    </h1>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {services.map((service) => {
                        const title = isVietnamese && service.title_vi ? service.title_vi : service.title;
                        const description =
                            isVietnamese && service.description_vi
                                ? service.description_vi
                                : service.description || "";
                        const features =
                            isVietnamese && service.features_vi && service.features_vi.length > 0
                                ? service.features_vi
                                : service.features || [];
                        const ctaText =
                            isVietnamese && service.cta_text_vi ? service.cta_text_vi : service.cta_text;

                        return (
                        <ServiceCard
                            key={service.id}
                            title={title}
                            description={description}
                            price={service.price || "Contact"}
                            priceNote={service.price_note || undefined}
                            features={features}
                            highlighted={service.is_highlighted}
                            ctaText={ctaText || undefined}
                        />
                        );
                    })}
                </div>

                {services.length === 0 && (
                    <div className="py-12 text-center bg-dark-card border border-dark-border rounded-2xl mt-8">
                        <p className="text-dark-muted">No services available yet.</p>
                    </div>
                )}
            </section>

            {/* Benefits */}
            <section className="section-container">
                <div className="text-center mb-12">
                    <h2 className="section-title">
                        {t("whyWorkWithMe.title")} <span className="gradient-text">{t("whyWorkWithMe.titleHighlight")}</span>
                    </h2>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        {t("whyWorkWithMe.description")}
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
                        {t("cta.title")}
                    </h2>
                    <p className="text-dark-muted mb-6 max-w-xl mx-auto">
                        {t("cta.description")}
                    </p>
                    <a href="/contact" className="btn-glow inline-flex items-center gap-2">
                        {t("cta.button")}
                    </a>
                </div>
            </section>
        </>
    );
}

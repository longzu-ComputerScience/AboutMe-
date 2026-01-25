"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Mail, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import SkillBadge from "@/components/ui/SkillBadge";
import Timeline from "@/components/ui/Timeline";
import { profileData, skills, timeline } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";

interface Profile {
    id: string;
    name: string;
    name_vi: string | null;
    title: string;
    title_vi: string | null;
    bio: string | null;
    bio_vi: string | null;
    avatar_url: string | null;
    location: string | null;
    email: string | null;
    is_available_for_hire: boolean;
}

export default function AboutPage() {
    const t = useTranslations();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isVietnamese, setIsVietnamese] = useState(true);

    useEffect(() => {
        const init = async () => {
            // Check locale
            try {
                const response = await fetch("/api/locale");
                const data = await response.json();
                setIsVietnamese(data.locale === "vi");
            } catch {
                setIsVietnamese(true);
            }

            // Fetch profile from Supabase
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .limit(1)
                .single();

            if (data) {
                setProfile(data);
            }
        };
        init();
    }, []);

    // Use Supabase data if available, fallback to mockData
    const displayName = profile
        ? (isVietnamese && profile.name_vi ? profile.name_vi : profile.name)
        : profileData.name;

    const displayTitle = profile
        ? (isVietnamese && profile.title_vi ? profile.title_vi : profile.title)
        : profileData.title;

    const displayBio = profile
        ? (isVietnamese && profile.bio_vi ? profile.bio_vi : profile.bio)
        : profileData.bio;

    const displayLocation = profile?.location || profileData.location;
    const displayEmail = profile?.email || profileData.email;
    const isAvailable = profile?.is_available_for_hire ?? true;

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
                                    src={profile?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"}
                                    alt={displayName}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Floating badges */}
                            <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl bg-dark-card border border-dark-border shadow-lg">
                                <p className="text-sm font-medium gradient-text">5+ {t("about.yearsExperience")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-primary-400 font-medium mb-2">{t("about.title")}</p>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {t("about.subtitle")} <span className="gradient-text">{displayName}</span>
                            </h1>
                            <p className="text-xl text-dark-muted">{displayTitle}</p>
                        </div>

                        {displayBio && (
                            <p className="text-dark-text/80 leading-relaxed whitespace-pre-line">
                                {displayBio}
                            </p>
                        )}

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                                <MapPin className="w-4 h-4 text-primary-400" />
                                <span className="text-sm">{displayLocation}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                                <Mail className="w-4 h-4 text-primary-400" />
                                <span className="text-sm">{displayEmail}</span>
                            </div>
                            {isAvailable && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                    <Calendar className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm text-emerald-400">{t("about.availableForHire")}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section className="section-container">
                <div className="text-center mb-12">
                    <h2 className="section-title">
                        {t("skills.title")} <span className="gradient-text">{t("skills.titleHighlight")}</span>
                    </h2>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        {t("skills.description")}
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
                        {t("timeline.title")} <span className="gradient-text">{t("timeline.titleHighlight")}</span>
                    </h2>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        {t("timeline.description")}
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Timeline items={timeline} />
                </div>
            </section>
        </>
    );
}

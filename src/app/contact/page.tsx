"use client";

import { useState } from "react";
import { Send, Mail, MapPin, Phone, Github, Linkedin, Facebook, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { profileData } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
    const t = useTranslations();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Save to Supabase contacts table
            const { error: insertError } = await supabase
                .from("contacts")
                .insert({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                });

            if (insertError) {
                setError("Có lỗi xảy ra. Vui lòng thử lại!");
                console.error("Contact form error:", insertError);
                return;
            }

            setIsSubmitted(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch {
            setError("Có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Header */}
            <section className="section-container pb-8">
                <div className="text-center">
                    <h1 className="section-title">
                        {t("contact.title")} <span className="gradient-text">{t("contact.titleHighlight")}</span>
                    </h1>
                    <p className="text-dark-muted max-w-2xl mx-auto">
                        {t("contact.description")}
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 md:p-8">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                                    <h3 className="text-xl font-semibold mb-2">{t("contact.success.title")}</h3>
                                    <p className="text-dark-muted mb-6">
                                        {t("contact.success.description")}
                                    </p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                        {t("contact.success.sendAnother")}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                                                {t("contact.form.name")}
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                                                placeholder={t("contact.form.namePlaceholder")}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                            {t("contact.form.subject")}
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                                            placeholder={t("contact.form.subjectPlaceholder")}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                                            {t("contact.form.message")}
                                        </label>
                                        <textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                            placeholder={t("contact.form.messagePlaceholder")}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full btn-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                {t("contact.form.sending")}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                {t("contact.form.send")}
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h3 className="font-semibold mb-4">{t("contact.info.title")}</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-dark-muted">Email</p>
                                        <a href={`mailto:${profileData.email}`} className="hover:text-primary-400 transition-colors">
                                            {profileData.email}
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-accent-purple" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-dark-muted">{t("contact.info.location")}</p>
                                        <p>{profileData.location}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-dark-muted">{t("contact.info.availability")}</p>
                                        <p>Mon - Fri, 9:00 - 18:00</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h3 className="font-semibold mb-4">{t("contact.social.title")}</h3>
                            <div className="flex gap-3">
                                <a
                                    href={profileData.social.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                                <a
                                    href={profileData.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a
                                    href={profileData.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-primary-500/10 via-accent-purple/10 to-pink-500/10 border border-white/10 rounded-2xl p-6">
                            <h3 className="font-semibold mb-2">{t("contact.quickResponse.title")}</h3>
                            <p className="text-sm text-dark-muted">
                                {t("contact.quickResponse.description")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

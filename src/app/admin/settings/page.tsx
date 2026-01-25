"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, User, Globe, Bell, Shield, Palette } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [settings, setSettings] = useState({
        siteName: "LongZu Portfolio",
        siteDescription: "Personal portfolio showcasing projects and services",
        contactEmail: "contact@longzu.dev",
        defaultLanguage: "vi",
        enableContactForm: true,
        enableBlog: true,
        enableServices: true,
        maintenanceMode: false,
        socialGithub: "https://github.com/longzu",
        socialLinkedin: "https://linkedin.com/in/longzu",
        socialFacebook: "https://facebook.com/longzu",
    });

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
            }
        };
        checkAuth();

        // Load settings from Supabase
        const loadSettings = async () => {
            const { data } = await supabase
                .from("site_settings")
                .select("*")
                .limit(1)
                .single();

            if (data) {
                setSettings(prev => ({
                    ...prev,
                    siteName: data.site_name || prev.siteName,
                    siteDescription: data.site_description || prev.siteDescription,
                    contactEmail: data.contact_email || prev.contactEmail,
                    defaultLanguage: data.default_language || prev.defaultLanguage,
                    maintenanceMode: data.maintenance_mode || false,
                    socialGithub: data.social_links?.github || prev.socialGithub,
                    socialLinkedin: data.social_links?.linkedin || prev.socialLinkedin,
                    socialFacebook: data.social_links?.facebook || prev.socialFacebook,
                }));
            }
        };
        loadSettings();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setSettings(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { error: upsertError } = await supabase
                .from("site_settings")
                .upsert({
                    id: 1, // Single settings row
                    site_name: settings.siteName,
                    site_description: settings.siteDescription,
                    contact_email: settings.contactEmail,
                    default_language: settings.defaultLanguage,
                    maintenance_mode: settings.maintenanceMode,
                    social_links: {
                        github: settings.socialGithub,
                        linkedin: settings.socialLinkedin,
                        facebook: settings.socialFacebook,
                    },
                });

            if (upsertError) {
                setError(upsertError.message);
                return;
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="section-container">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-dark-muted">Configure your website settings</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Settings saved successfully!
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* General Settings */}
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary-400" />
                            General
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Site Description
                                </label>
                                <input
                                    type="text"
                                    name="siteDescription"
                                    value={settings.siteDescription}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={settings.contactEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Default Language
                                </label>
                                <select
                                    name="defaultLanguage"
                                    value={settings.defaultLanguage}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                >
                                    <option value="vi">Tiếng Việt</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-400" />
                            Social Links
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    GitHub
                                </label>
                                <input
                                    type="url"
                                    name="socialGithub"
                                    value={settings.socialGithub}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    placeholder="https://github.com/username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    LinkedIn
                                </label>
                                <input
                                    type="url"
                                    name="socialLinkedin"
                                    value={settings.socialLinkedin}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    name="socialFacebook"
                                    value={settings.socialFacebook}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    placeholder="https://facebook.com/username"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feature Toggles */}
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-primary-400" />
                            Features
                        </h2>

                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Enable Contact Form</span>
                                <input
                                    type="checkbox"
                                    name="enableContactForm"
                                    checked={settings.enableContactForm}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-dark-border bg-white/5 text-primary-500 focus:ring-primary-500/20"
                                />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Enable Blog</span>
                                <input
                                    type="checkbox"
                                    name="enableBlog"
                                    checked={settings.enableBlog}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-dark-border bg-white/5 text-primary-500 focus:ring-primary-500/20"
                                />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Enable Services</span>
                                <input
                                    type="checkbox"
                                    name="enableServices"
                                    checked={settings.enableServices}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-dark-border bg-white/5 text-primary-500 focus:ring-primary-500/20"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary-400" />
                            Security
                        </h2>

                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <span className="text-sm block">Maintenance Mode</span>
                                    <span className="text-xs text-dark-muted">Show maintenance page to visitors</span>
                                </div>
                                <input
                                    type="checkbox"
                                    name="maintenanceMode"
                                    checked={settings.maintenanceMode}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-dark-border bg-white/5 text-primary-500 focus:ring-primary-500/20"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-glow flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

const parseList = (value: string) =>
    value
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

export default function NewServicePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        title_vi: "",
        description: "",
        description_vi: "",
        price: "",
        price_note: "",
        features: "",
        features_vi: "",
        cta_text: "",
        cta_text_vi: "",
        is_highlighted: false,
        is_active: true,
        sort_order: "0",
    });

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
            }
        };
        checkAuth();
    }, [router]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const featuresArray = parseList(formData.features);
            const featuresViArray = parseList(formData.features_vi);

            const payload: {
                title: string;
                title_vi?: string | null;
                description?: string | null;
                description_vi?: string | null;
                price?: string | null;
                price_note?: string | null;
                features?: string[] | null;
                features_vi?: string[] | null;
                is_highlighted: boolean;
                is_active: boolean;
                sort_order: number;
                cta_text?: string;
                cta_text_vi?: string;
            } = {
                title: formData.title,
                title_vi: formData.title_vi || null,
                description: formData.description || null,
                description_vi: formData.description_vi || null,
                price: formData.price || null,
                price_note: formData.price_note || null,
                features: featuresArray.length > 0 ? featuresArray : null,
                features_vi: featuresViArray.length > 0 ? featuresViArray : null,
                is_highlighted: formData.is_highlighted,
                is_active: formData.is_active,
                sort_order: Number.isNaN(parseInt(formData.sort_order, 10))
                    ? 0
                    : parseInt(formData.sort_order, 10),
            };

            if (formData.cta_text.trim()) {
                payload.cta_text = formData.cta_text.trim();
            }
            if (formData.cta_text_vi.trim()) {
                payload.cta_text_vi = formData.cta_text_vi.trim();
            }

            const { error: insertError } = await supabase
                .from("services")
                .insert(payload);

            if (insertError) {
                setError(insertError.message);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/services");
            }, 1500);
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="section-container">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/services"
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">New Service</h1>
                    <p className="text-dark-muted">Add a new service offering</p>
                </div>
            </div>

            {success && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Service created successfully! Redirecting...
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Title (English) *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="Service title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Title (Vietnamese)
                                    </label>
                                    <input
                                        type="text"
                                        name="title_vi"
                                        value={formData.title_vi}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="Vietnamese title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Description (English)
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="Short description"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Description (Vietnamese)
                                    </label>
                                    <textarea
                                        name="description_vi"
                                        value={formData.description_vi}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="Vietnamese description"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Features</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Features (English)
                                    </label>
                                    <textarea
                                        name="features"
                                        value={formData.features}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="One per line or comma separated"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Features (Vietnamese)
                                    </label>
                                    <textarea
                                        name="features_vi"
                                        value={formData.features_vi}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="One per line or comma separated (VI)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Pricing</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Price
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="3,000,000 VND"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Price Note
                                    </label>
                                    <input
                                        type="text"
                                        name="price_note"
                                        value={formData.price_note}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="/ project"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4">CTA</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        CTA Text (English)
                                    </label>
                                    <input
                                        type="text"
                                        name="cta_text"
                                        value={formData.cta_text}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="Get Started"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        CTA Text (Vietnamese)
                                    </label>
                                    <input
                                        type="text"
                                        name="cta_text_vi"
                                        value={formData.cta_text_vi}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="Vietnamese CTA text"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Settings</h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-dark-border bg-white/5 text-primary-500 focus:ring-primary-500/20"
                                    />
                                    <span className="text-sm">Active</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_highlighted"
                                        checked={formData.is_highlighted}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-dark-border bg-white/5 text-primary-500 focus:ring-primary-500/20"
                                    />
                                    <span className="text-sm">Highlighted</span>
                                </label>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        name="sort_order"
                                        value={formData.sort_order}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-glow flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Create Service
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

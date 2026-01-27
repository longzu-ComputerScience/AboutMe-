"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Service {
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
    sort_order: number | null;
    cta_text: string | null;
    cta_text_vi: string | null;
}

const parseList = (value: string) =>
    value
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

export default function EditServicePage() {
    const router = useRouter();
    const params = useParams();
    const serviceId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
                return;
            }

            const { data, error } = await supabase
                .from("services")
                .select("*")
                .eq("id", serviceId)
                .single();

            if (error || !data) {
                setError("Service not found");
                setIsFetching(false);
                return;
            }

            const service = data as Service;
            setFormData({
                title: service.title || "",
                title_vi: service.title_vi || "",
                description: service.description || "",
                description_vi: service.description_vi || "",
                price: service.price || "",
                price_note: service.price_note || "",
                features: service.features?.join("\n") || "",
                features_vi: service.features_vi?.join("\n") || "",
                cta_text: service.cta_text || "",
                cta_text_vi: service.cta_text_vi || "",
                is_highlighted: service.is_highlighted || false,
                is_active: service.is_active ?? true,
                sort_order: service.sort_order?.toString() || "0",
            });

            setIsFetching(false);
        };

        init();
    }, [router, serviceId]);

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

            const { error: updateError } = await supabase
                .from("services")
                .update(payload)
                .eq("id", serviceId);

            if (updateError) {
                setError(updateError.message);
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

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const { error: deleteError } = await supabase
                .from("services")
                .delete()
                .eq("id", serviceId);

            if (deleteError) {
                setError(deleteError.message);
                return;
            }

            router.push("/admin/services");
        } catch {
            setError("Failed to delete service");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="section-container flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="section-container">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/services"
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Service</h1>
                        <p className="text-dark-muted">Update service details</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Service"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-2">Delete Service?</h3>
                        <p className="text-dark-muted mb-6">
                            This action cannot be undone. The service will be permanently deleted.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Service updated successfully!
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
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

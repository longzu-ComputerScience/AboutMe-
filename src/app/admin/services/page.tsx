"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Service {
    id: string;
    title: string;
    description: string | null;
    price: string | null;
    price_note: string | null;
    features: string[] | null;
    is_highlighted: boolean;
    is_active: boolean;
}

export default function AdminServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

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
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: false });

            if (!error && data) {
                setServices(data);
            }
            setIsLoading(false);
        };

        init();
    }, [router]);

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("services")
            .delete()
            .eq("id", id);

        if (!error) {
            setServices(prev => prev.filter(service => service.id !== id));
        }
        setDeleteId(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-2">Delete Service?</h3>
                        <p className="text-dark-muted mb-6">
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Services</h1>
                    <p className="text-dark-muted">Manage your service offerings</p>
                </div>
                <Link
                    href="/admin/services/new"
                    className="btn-glow inline-flex items-center gap-2 justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Add Service
                </Link>
            </div>

            {/* Services List */}
            <div className="space-y-4">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`bg-dark-card border rounded-2xl p-6 ${service.is_highlighted
                            ? "border-primary-500/50"
                            : "border-dark-border"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Drag Handle */}
                            <button className="p-2 rounded-lg hover:bg-white/10 cursor-grab">
                                <GripVertical className="w-5 h-5 text-dark-muted" />
                            </button>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold">{service.title}</h3>
                                            {service.is_highlighted && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
                                                    Popular
                                                </span>
                                            )}
                                            {!service.is_active && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-dark-muted mb-3">
                                            {service.description || "No description provided."}
                                        </p>
                                        <p className="text-xl font-bold gradient-text">
                                            {service.price || "N/A"}
                                            {service.price_note && (
                                                <span className="text-sm font-normal text-dark-muted ml-1">
                                                    {service.price_note}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/services/${service.id}`}
                                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => setDeleteId(service.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mt-4 pt-4 border-t border-dark-border">
                                    <p className="text-xs text-dark-muted mb-2">Features:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(service.features || []).map((feature, i) => (
                                            <span
                                                key={`${service.id}-${i}`}
                                                className="text-xs px-2 py-1 rounded bg-white/5 text-dark-text/70"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {services.length === 0 && (
                    <div className="py-12 text-center bg-dark-card border border-dark-border rounded-2xl">
                        <p className="text-dark-muted">No services yet. Add your first service!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

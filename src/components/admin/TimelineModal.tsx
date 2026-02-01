"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface TimelineItem {
    id?: string;
    year: string;
    title: string;
    title_vi: string | null;
    description: string | null;
    description_vi: string | null;
    organization: string | null;
    type: "work" | "education" | "achievement";
    sort_order?: number;
}

interface TimelineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: TimelineItem) => Promise<void>;
    item?: TimelineItem | null;
}

const TYPE_OPTIONS = [
    { value: "work", label: "💼 Work", color: "primary" },
    { value: "education", label: "🎓 Education", color: "emerald" },
    { value: "achievement", label: "🏆 Achievement", color: "amber" },
];

export default function TimelineModal({ isOpen, onClose, onSave, item }: TimelineModalProps) {
    const [formData, setFormData] = useState<TimelineItem>({
        year: new Date().getFullYear().toString(),
        title: "",
        title_vi: null,
        description: null,
        description_vi: null,
        organization: null,
        type: "work",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (item) {
            setFormData({
                id: item.id,
                year: item.year,
                title: item.title,
                title_vi: item.title_vi,
                description: item.description,
                description_vi: item.description_vi,
                organization: item.organization,
                type: item.type,
                sort_order: item.sort_order,
            });
        } else {
            setFormData({
                year: new Date().getFullYear().toString(),
                title: "",
                title_vi: null,
                description: null,
                description_vi: null,
                organization: null,
                type: "work",
            });
        }
        setError("");
    }, [item, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.year.trim() || !formData.title.trim()) {
            setError("Year and Title are required");
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError((err as Error).message || "Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-dark-card border border-dark-border rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between p-4 border-b border-dark-border bg-dark-card">
                    <h3 className="text-lg font-semibold">
                        {item ? "Edit Timeline Entry" : "Add Timeline Entry"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <div className="flex gap-2">
                            {TYPE_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: option.value as TimelineItem["type"] })}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.type === option.value
                                        ? option.color === "primary"
                                            ? "bg-primary-500 text-white"
                                            : option.color === "emerald"
                                                ? "bg-emerald-500 text-white"
                                                : "bg-amber-500 text-white"
                                        : "bg-white/5 border border-dark-border hover:border-primary-500/50"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Year *</label>
                        <input
                            type="text"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            placeholder="e.g., 2024"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Title EN */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Title (English) *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Senior Developer"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Title VI */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Title (Vietnamese)</label>
                        <input
                            type="text"
                            value={formData.title_vi || ""}
                            onChange={(e) => setFormData({ ...formData, title_vi: e.target.value || null })}
                            placeholder="e.g., Lập trình viên cao cấp"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Organization */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Organization</label>
                        <input
                            type="text"
                            value={formData.organization || ""}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value || null })}
                            placeholder="e.g., Tech Company"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Description EN */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description (English)</label>
                        <textarea
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                            rows={2}
                            placeholder="Brief description..."
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Description VI */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description (Vietnamese)</label>
                        <textarea
                            value={formData.description_vi || ""}
                            onChange={(e) => setFormData({ ...formData, description_vi: e.target.value || null })}
                            rows={2}
                            placeholder="Mô tả ngắn..."
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-dark-border hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 transition-colors font-medium disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

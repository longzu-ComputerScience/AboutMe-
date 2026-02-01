"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Skill {
    id?: string;
    name: string;
    icon: string;
    level: "expert" | "advanced" | "intermediate";
    category: string;
    sort_order?: number;
}

interface SkillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (skill: Skill) => Promise<void>;
    skill?: Skill | null;
}

const LEVEL_OPTIONS = [
    { value: "expert", label: "Expert" },
    { value: "advanced", label: "Advanced" },
    { value: "intermediate", label: "Intermediate" },
];

const CATEGORY_OPTIONS = [
    "Frontend",
    "Backend",
    "Language",
    "Database",
    "DevOps",
    "Cloud",
    "Design",
    "Tools",
    "Other",
];

const COMMON_ICONS = ["⚛️", "📘", "🟢", "🐍", "🐘", "🎨", "🐳", "📦", "🎯", "☁️", "🔥", "⚡", "🚀", "💻", "🛠️", "🧪", "📱", "🌐"];

export default function SkillModal({ isOpen, onClose, onSave, skill }: SkillModalProps) {
    const [formData, setFormData] = useState<Skill>({
        name: "",
        icon: "💻",
        level: "intermediate",
        category: "Other",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (skill) {
            setFormData({
                id: skill.id,
                name: skill.name,
                icon: skill.icon,
                level: skill.level,
                category: skill.category,
                sort_order: skill.sort_order,
            });
        } else {
            setFormData({
                name: "",
                icon: "💻",
                level: "intermediate",
                category: "Other",
            });
        }
        setError("");
    }, [skill, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError("Name is required");
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError((err as Error).message || "Failed to save skill");
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
            <div className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-dark-border">
                    <h3 className="text-lg font-semibold">
                        {skill ? "Edit Skill" : "Add Skill"}
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

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Skill Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., React / Next.js"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Icon */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Icon
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {COMMON_ICONS.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon })}
                                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${formData.icon === icon
                                        ? "bg-primary-500/20 border-2 border-primary-500"
                                        : "bg-white/5 border border-dark-border hover:border-primary-500/50"
                                        }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            placeholder="Or enter custom emoji"
                            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all text-sm"
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Proficiency Level
                        </label>
                        <div className="flex gap-2">
                            {LEVEL_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, level: option.value as Skill["level"] })}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.level === option.value
                                        ? "bg-primary-500 text-white"
                                        : "bg-white/5 border border-dark-border hover:border-primary-500/50"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                        >
                            {CATEGORY_OPTIONS.map((cat) => (
                                <option key={cat} value={cat} className="bg-dark-card">
                                    {cat}
                                </option>
                            ))}
                        </select>
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

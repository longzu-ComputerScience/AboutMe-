"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Image as ImageIcon, Link as LinkIcon, Tag, DollarSign, Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewProjectPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [useUrlInput, setUseUrlInput] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        title_vi: "",
        slug: "",
        description: "",
        description_vi: "",
        content: "",
        content_vi: "",
        image_url: "",
        demo_url: "",
        source_url: "",
        category: "Web App",
        tags: "",
        is_paid: false,
        price: "",
        is_featured: false,
        is_published: true,
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
    }, [router]);

    // Auto-generate slug from title
    useEffect(() => {
        if (formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title]);

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            // Create preview
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `project-new-${Date.now()}.${fileExt}`;
            const filePath = `projects/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                setError(uploadError.message);
                setImagePreview(null);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            // Update form data
            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            setImagePreview(publicUrl);

        } catch {
            setError('Failed to upload image');
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    // Remove image
    const handleRemoveImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image_url: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Parse tags string to array
            const tagsArray = formData.tags
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const { error: insertError } = await supabase
                .from("projects")
                .insert({
                    title: formData.title,
                    title_vi: formData.title_vi || null,
                    slug: formData.slug,
                    description: formData.description,
                    description_vi: formData.description_vi || null,
                    content: formData.content || null,
                    content_vi: formData.content_vi || null,
                    image_url: formData.image_url || null,
                    demo_url: formData.demo_url || null,
                    source_url: formData.source_url || null,
                    category: formData.category,
                    tags: tagsArray.length > 0 ? tagsArray : null,
                    is_paid: formData.is_paid,
                    price: formData.is_paid && formData.price ? parseFloat(formData.price) : null,
                    is_featured: formData.is_featured,
                    is_published: formData.is_published,
                });

            if (insertError) {
                setError(insertError.message);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/projects");
            }, 1500);
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="section-container">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/projects"
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">New Project</h1>
                    <p className="text-dark-muted">Add a new project to your portfolio</p>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Project created successfully! Redirecting...
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                            <div className="space-y-4">
                                {/* Title EN */}
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
                                        placeholder="My Awesome Project"
                                    />
                                </div>

                                {/* Title VI */}
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
                                        placeholder="Dự án tuyệt vời"
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="my-awesome-project"
                                    />
                                    <p className="text-xs text-dark-muted mt-1">URL-friendly identifier</p>
                                </div>

                                {/* Description EN */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Description (English) *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="A brief description of your project..."
                                    />
                                </div>

                                {/* Description VI */}
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
                                        placeholder="Mô tả ngắn về dự án..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project Image */}
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Project Image
                            </h2>

                            <div className="space-y-4">
                                {/* Upload / URL Toggle */}
                                <div className="flex gap-2 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setUseUrlInput(false)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${!useUrlInput ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                                    >
                                        <Upload className="w-4 h-4 inline mr-1" />
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUseUrlInput(true)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${useUrlInput ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                                    >
                                        <LinkIcon className="w-4 h-4 inline mr-1" />
                                        URL
                                    </button>
                                </div>

                                {!useUrlInput ? (
                                    <>
                                        {/* Image Preview */}
                                        {imagePreview && (
                                            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-white/5">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Project preview"
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                                                    title="Remove image"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Upload Area */}
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-dark-border rounded-xl p-8 text-center cursor-pointer hover:border-primary-500/50 hover:bg-white/5 transition-all"
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            {isUploading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                                                    <span className="text-sm text-dark-muted">Uploading...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="w-8 h-8 text-dark-muted" />
                                                    <span className="text-sm text-dark-muted">
                                                        Click to upload image
                                                    </span>
                                                    <span className="text-xs text-dark-muted">
                                                        Max 5MB, JPG/PNG/GIF
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Image URL
                                        </label>
                                        <input
                                            type="url"
                                            name="image_url"
                                            value={formData.image_url}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setImagePreview(e.target.value || null);
                                            }}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <LinkIcon className="w-5 h-5" />
                                Links
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Demo URL
                                    </label>
                                    <input
                                        type="url"
                                        name="demo_url"
                                        value={formData.demo_url}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="https://demo.example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Source Code URL
                                    </label>
                                    <input
                                        type="url"
                                        name="source_url"
                                        value={formData.source_url}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="https://github.com/username/repo"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Settings */}
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Publish</h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_published"
                                        checked={formData.is_published}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-dark-border bg-white/5 text-primary-500 focus:ring-primary-500/20"
                                    />
                                    <span className="text-sm">Published</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-dark-border bg-white/5 text-primary-500 focus:ring-primary-500/20"
                                    />
                                    <span className="text-sm">Featured</span>
                                </label>
                            </div>
                        </div>

                        {/* Category & Tags */}
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Category & Tags
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    >
                                        <option value="Web App">Web App</option>
                                        <option value="Tool">Tool</option>
                                        <option value="Template">Template</option>
                                        <option value="Mobile App">Mobile App</option>
                                        <option value="API">API</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="React, Next.js, TailwindCSS"
                                    />
                                    <p className="text-xs text-dark-muted mt-1">Comma separated</p>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Pricing
                            </h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_paid"
                                        checked={formData.is_paid}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-dark-border bg-white/5 text-primary-500 focus:ring-primary-500/20"
                                    />
                                    <span className="text-sm">Paid Project</span>
                                </label>

                                {formData.is_paid && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Price (VND)
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            placeholder="100000"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
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
                                    Create Project
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

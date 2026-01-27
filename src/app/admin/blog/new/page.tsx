"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Link as LinkIcon,
    Tag,
    Clock,
    Upload,
    X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewBlogPostPage() {
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
        excerpt: "",
        excerpt_vi: "",
        content: "",
        content_vi: "",
        cover_image_url: "",
        tags: "",
        read_time: "",
        is_featured: false,
        is_published: true,
        published_at: "",
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

    useEffect(() => {
        if (formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        setIsUploading(true);
        setError("");

        try {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            const fileExt = file.name.split(".").pop();
            const fileName = `blog-new-${Date.now()}.${fileExt}`;
            const filePath = `blog/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) {
                setError(uploadError.message);
                setImagePreview(null);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from("images")
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, cover_image_url: publicUrl }));
            setImagePreview(publicUrl);
        } catch {
            setError("Failed to upload image");
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, cover_image_url: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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
            const tagsArray = formData.tags
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const publishedAt = formData.is_published
                ? formData.published_at
                    ? new Date(formData.published_at).toISOString()
                    : new Date().toISOString()
                : null;

            const { error: insertError } = await supabase
                .from("blog_posts")
                .insert({
                    title: formData.title,
                    title_vi: formData.title_vi || null,
                    slug: formData.slug,
                    excerpt: formData.excerpt,
                    excerpt_vi: formData.excerpt_vi || null,
                    content: formData.content || null,
                    content_vi: formData.content_vi || null,
                    cover_image_url: formData.cover_image_url || null,
                    tags: tagsArray.length > 0 ? tagsArray : null,
                    read_time: formData.read_time || null,
                    is_featured: formData.is_featured,
                    is_published: formData.is_published,
                    published_at: publishedAt,
                });

            if (insertError) {
                setError(insertError.message);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/blog");
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
                    href="/admin/blog"
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">New Blog Post</h1>
                    <p className="text-dark-muted">Create a new article</p>
                </div>
            </div>

            {success && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Post created successfully! Redirecting...
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
                                        placeholder="Your post title"
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
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="your-post-title"
                                    />
                                    <p className="text-xs text-dark-muted mt-1">URL-friendly identifier</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Excerpt (English) *
                                    </label>
                                    <textarea
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="Short summary of the post"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Excerpt (Vietnamese)
                                    </label>
                                    <textarea
                                        name="excerpt_vi"
                                        value={formData.excerpt_vi}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="Vietnamese excerpt"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Content</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Content (English)
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        rows={10}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="Write your post content here..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Content (Vietnamese)
                                    </label>
                                    <textarea
                                        name="content_vi"
                                        value={formData.content_vi}
                                        onChange={handleChange}
                                        rows={10}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        placeholder="Vietnamese content"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Cover Image
                            </h2>

                            <div className="space-y-4">
                                <div className="flex gap-2 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setUseUrlInput(false)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${!useUrlInput
                                                ? "bg-primary-500 text-white"
                                                : "bg-white/10 hover:bg-white/20"
                                            }`}
                                    >
                                        <Upload className="w-4 h-4 inline mr-1" />
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUseUrlInput(true)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${useUrlInput
                                                ? "bg-primary-500 text-white"
                                                : "bg-white/10 hover:bg-white/20"
                                            }`}
                                    >
                                        <LinkIcon className="w-4 h-4 inline mr-1" />
                                        URL
                                    </button>
                                </div>

                                {!useUrlInput ? (
                                    <>
                                        {imagePreview && (
                                            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-white/5">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Cover preview"
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
                                            name="cover_image_url"
                                            value={formData.cover_image_url}
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
                    </div>

                    <div className="space-y-6">
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

                                {formData.is_published && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Published At
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="published_at"
                                            value={formData.published_at}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        />
                                        <p className="text-xs text-dark-muted mt-1">
                                            Leave empty to use current time
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Tags & Reading Time
                            </h2>

                            <div className="space-y-4">
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
                                        placeholder="React, Next.js, Tips"
                                    />
                                    <p className="text-xs text-dark-muted mt-1">Comma separated</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Read Time
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                                        <input
                                            type="text"
                                            name="read_time"
                                            value={formData.read_time}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            placeholder="5 min read"
                                        />
                                    </div>
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
                                    Create Post
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

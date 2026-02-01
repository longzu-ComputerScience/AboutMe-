"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Upload, User, MapPin, Briefcase, X, Pencil, Trash2, Plus, GraduationCap, Trophy, Clock } from "lucide-react";
import { profileData } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import SkillModal from "@/components/admin/SkillModal";
import TimelineModal from "@/components/admin/TimelineModal";

interface Profile {
    id: string;
    name: string;
    name_vi: string | null;
    title: string;
    title_vi: string | null;
    bio: string | null;
    bio_vi: string | null;
    email: string | null;
    location: string | null;
    avatar_url: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    locket_url: string | null;
    tiktok_url: string | null;
}

interface Skill {
    id?: string;
    name: string;
    icon: string;
    level: "expert" | "advanced" | "intermediate";
    category: string;
    sort_order?: number;
}

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

export default function AdminProfilePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState({
        id: "",
        name: profileData.name,
        name_vi: "",
        title: profileData.title,
        title_vi: "",
        bio: profileData.bio,
        bio_vi: "",
        email: profileData.email,
        location: profileData.location,
        avatar_url: "",
        github_url: profileData.social.github,
        linkedin_url: profileData.social.linkedin,
        facebook_url: profileData.social.facebook,
        instagram_url: profileData.social.instagram,
        locket_url: profileData.social.locket,
        tiktok_url: profileData.social.tiktok,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Skills state
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

    // Timeline state
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
    const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);

    const getStorageInfo = (url: string) => {
        try {
            const parsedUrl = new URL(url);
            const marker = "/storage/v1/object/public/";
            const markerIndex = parsedUrl.pathname.indexOf(marker);
            if (markerIndex === -1) return null;
            const fullPath = parsedUrl.pathname.slice(markerIndex + marker.length);
            const [bucket, ...rest] = fullPath.split("/");
            if (!bucket || rest.length === 0) return null;
            return { bucket, path: rest.join("/") };
        } catch {
            return null;
        }
    };

    const deleteAvatarFromStorage = async (url: string) => {
        const info = getStorageInfo(url);
        if (!info) return;

        const { error: deleteError } = await supabase.storage
            .from(info.bucket)
            .remove([info.path]);

        if (deleteError) {
            throw deleteError;
        }
    };

    // Check auth and fetch data
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
                return;
            }

            // Fetch profile
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .limit(1)
                .single();

            if (!profileError && profileData) {
                setProfile({
                    id: profileData.id,
                    name: profileData.name || "",
                    name_vi: profileData.name_vi || "",
                    title: profileData.title || "",
                    title_vi: profileData.title_vi || "",
                    bio: profileData.bio || "",
                    bio_vi: profileData.bio_vi || "",
                    email: profileData.email || "",
                    location: profileData.location || "",
                    avatar_url: profileData.avatar_url || "",
                    github_url: profileData.github_url || "",
                    linkedin_url: profileData.linkedin_url || "",
                    facebook_url: profileData.facebook_url || "",
                    instagram_url: profileData.instagram_url || "",
                    locket_url: profileData.locket_url || "",
                    tiktok_url: profileData.tiktok_url || "",
                });
                if (profileData.avatar_url) {
                    setAvatarPreview(profileData.avatar_url);
                }
            }

            // Fetch skills
            const { data: skillsData } = await supabase
                .from("skills")
                .select("*")
                .order("sort_order", { ascending: true });

            if (skillsData) {
                setSkills(skillsData);
            }

            // Fetch timeline
            const { data: timelineData } = await supabase
                .from("timeline")
                .select("*")
                .order("sort_order", { ascending: true });

            if (timelineData) {
                setTimeline(timelineData);
            }

            setIsLoading(false);
        };
        init();
    }, [router]);

    // Handle avatar upload
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);

            const fileExt = file.name.split('.').pop();
            const fileName = `avatar-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                setError(uploadError.message);
                setAvatarPreview(profile.avatar_url || null);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            if (profile.avatar_url && profile.avatar_url !== publicUrl) {
                try {
                    await deleteAvatarFromStorage(profile.avatar_url);
                } catch (deleteError) {
                    setError((deleteError as Error).message || "Failed to delete old avatar");
                }
            }

            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            setAvatarPreview(publicUrl);

        } catch {
            setError('Failed to upload image');
            setAvatarPreview(profile.avatar_url || null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (profile.avatar_url) {
            try {
                await deleteAvatarFromStorage(profile.avatar_url);
            } catch (deleteError) {
                setError((deleteError as Error).message || "Failed to delete avatar");
            }
        }

        setAvatarPreview(null);
        setProfile(prev => ({ ...prev, avatar_url: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');

        try {
            if (profile.id) {
                const { error: updateError } = await supabase
                    .from("profiles")
                    .update({
                        name: profile.name,
                        name_vi: profile.name_vi || null,
                        title: profile.title,
                        title_vi: profile.title_vi || null,
                        bio: profile.bio || null,
                        bio_vi: profile.bio_vi || null,
                        email: profile.email || null,
                        location: profile.location || null,
                        avatar_url: profile.avatar_url || null,
                        github_url: profile.github_url || null,
                        linkedin_url: profile.linkedin_url || null,
                        facebook_url: profile.facebook_url || null,
                        instagram_url: profile.instagram_url || null,
                        locket_url: profile.locket_url || null,
                        tiktok_url: profile.tiktok_url || null,
                    })
                    .eq("id", profile.id);

                if (updateError) {
                    setError(updateError.message);
                    return;
                }
            } else {
                const { data, error: insertError } = await supabase
                    .from("profiles")
                    .insert({
                        name: profile.name,
                        name_vi: profile.name_vi || null,
                        title: profile.title,
                        title_vi: profile.title_vi || null,
                        bio: profile.bio || null,
                        bio_vi: profile.bio_vi || null,
                        email: profile.email || null,
                        location: profile.location || null,
                        avatar_url: profile.avatar_url || null,
                        github_url: profile.github_url || null,
                        linkedin_url: profile.linkedin_url || null,
                        facebook_url: profile.facebook_url || null,
                        instagram_url: profile.instagram_url || null,
                        locket_url: profile.locket_url || null,
                        tiktok_url: profile.tiktok_url || null,
                    })
                    .select()
                    .single();

                if (insertError) {
                    setError(insertError.message);
                    return;
                }

                if (data) {
                    setProfile(prev => ({ ...prev, id: data.id }));
                }
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError("Có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setIsSaving(false);
        }
    };

    // Skills CRUD
    const handleSaveSkill = async (skill: Skill) => {
        if (skill.id) {
            // Update existing skill
            const { error } = await supabase
                .from("skills")
                .update({
                    name: skill.name,
                    icon: skill.icon,
                    level: skill.level,
                    category: skill.category,
                })
                .eq("id", skill.id);

            if (error) throw error;

            setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, ...skill } : s));
        } else {
            // Insert new skill
            const maxSortOrder = skills.length > 0 ? Math.max(...skills.map(s => s.sort_order || 0)) : 0;
            const { data, error } = await supabase
                .from("skills")
                .insert({
                    name: skill.name,
                    icon: skill.icon,
                    level: skill.level,
                    category: skill.category,
                    sort_order: maxSortOrder + 1,
                })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setSkills(prev => [...prev, data]);
            }
        }
        setEditingSkill(null);
    };

    const handleDeleteSkill = async (id: string) => {
        if (!confirm("Are you sure you want to delete this skill?")) return;

        const { error } = await supabase
            .from("skills")
            .delete()
            .eq("id", id);

        if (error) {
            setError(error.message);
            return;
        }

        setSkills(prev => prev.filter(s => s.id !== id));
    };

    // Timeline CRUD
    const handleSaveTimeline = async (item: TimelineItem) => {
        if (item.id) {
            // Update existing timeline item
            const { error } = await supabase
                .from("timeline")
                .update({
                    year: item.year,
                    title: item.title,
                    title_vi: item.title_vi,
                    description: item.description,
                    description_vi: item.description_vi,
                    organization: item.organization,
                    type: item.type,
                })
                .eq("id", item.id);

            if (error) throw error;

            setTimeline(prev => prev.map(t => t.id === item.id ? { ...t, ...item } : t));
        } else {
            // Insert new timeline item
            const maxSortOrder = timeline.length > 0 ? Math.max(...timeline.map(t => t.sort_order || 0)) : 0;
            const { data, error } = await supabase
                .from("timeline")
                .insert({
                    year: item.year,
                    title: item.title,
                    title_vi: item.title_vi,
                    description: item.description,
                    description_vi: item.description_vi,
                    organization: item.organization,
                    type: item.type,
                    sort_order: maxSortOrder + 1,
                })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setTimeline(prev => [...prev, data]);
            }
        }
        setEditingTimeline(null);
    };

    const handleDeleteTimeline = async (id: string) => {
        if (!confirm("Are you sure you want to delete this timeline entry?")) return;

        const { error } = await supabase
            .from("timeline")
            .delete()
            .eq("id", id);

        if (error) {
            setError(error.message);
            return;
        }

        setTimeline(prev => prev.filter(t => t.id !== id));
    };

    const getTimelineIcon = (type: string) => {
        switch (type) {
            case "work": return <Briefcase className="w-4 h-4" />;
            case "education": return <GraduationCap className="w-4 h-4" />;
            case "achievement": return <Trophy className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getTimelineColor = (type: string) => {
        switch (type) {
            case "work": return "bg-primary-500";
            case "education": return "bg-emerald-500";
            case "achievement": return "bg-amber-500";
            default: return "bg-gray-500";
        }
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-dark-muted">Manage your personal information</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-glow inline-flex items-center gap-2 justify-center disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

            {/* Success Message */}
            {success && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Profile saved successfully!
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Profile Photo</h3>
                    <div className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            {avatarPreview ? (
                                <>
                                    <Image
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        fill
                                        className="rounded-2xl object-cover"
                                        sizes="128px"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveAvatar}
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                                        title="Remove photo"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-4xl font-bold">
                                    {profile.name.charAt(0)}
                                </div>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm disabled:opacity-50"
                        >
                            <Upload className="w-4 h-4" />
                            {isUploading ? 'Uploading...' : 'Upload Photo'}
                        </button>
                        <p className="text-xs text-dark-muted mt-2">
                            Recommended: 400x400px, Max 5MB
                        </p>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Basic Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Name (English)
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Name (Vietnamese)
                            </label>
                            <input
                                type="text"
                                value={profile.name_vi}
                                onChange={(e) => setProfile({ ...profile, name_vi: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <Briefcase className="w-4 h-4 inline mr-2" />
                                Title (English)
                            </label>
                            <input
                                type="text"
                                value={profile.title}
                                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <Briefcase className="w-4 h-4 inline mr-2" />
                                Title (Vietnamese)
                            </label>
                            <input
                                type="text"
                                value={profile.title_vi}
                                onChange={(e) => setProfile({ ...profile, title_vi: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Location
                            </label>
                            <input
                                type="text"
                                value={profile.location}
                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-2">Bio (English)</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all resize-none"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-2">Bio (Vietnamese)</label>
                            <textarea
                                value={profile.bio_vi}
                                onChange={(e) => setProfile({ ...profile, bio_vi: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Skills ({skills.length})</h3>
                    <button
                        onClick={() => {
                            setEditingSkill(null);
                            setIsSkillModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Skill
                    </button>
                </div>
                {skills.length === 0 ? (
                    <p className="text-dark-muted text-center py-8">No skills added yet. Click &quot;Add Skill&quot; to get started.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {skills.map((skill) => (
                            <div
                                key={skill.id}
                                className="group flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-dark-border hover:border-primary-500/30 transition-all"
                            >
                                <span className="text-xl">{skill.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{skill.name}</p>
                                    <p className="text-xs text-dark-muted capitalize">{skill.level}</p>
                                </div>
                                <div className="hidden group-hover:flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            setEditingSkill(skill);
                                            setIsSkillModalOpen(true);
                                        }}
                                        className="p-1 rounded hover:bg-white/10 text-dark-muted hover:text-white transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => skill.id && handleDeleteSkill(skill.id)}
                                        className="p-1 rounded hover:bg-red-500/20 text-dark-muted hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Timeline Section */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Timeline / Hành trình ({timeline.length})</h3>
                    <button
                        onClick={() => {
                            setEditingTimeline(null);
                            setIsTimelineModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Entry
                    </button>
                </div>
                {timeline.length === 0 ? (
                    <p className="text-dark-muted text-center py-8">No timeline entries yet. Click &quot;Add Entry&quot; to get started.</p>
                ) : (
                    <div className="space-y-3">
                        {timeline.map((item) => (
                            <div
                                key={item.id}
                                className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-dark-border hover:border-primary-500/30 transition-all"
                            >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${getTimelineColor(item.type)} flex items-center justify-center text-white`}>
                                    {getTimelineIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">{item.year}</span>
                                        <span className="text-xs text-dark-muted capitalize">{item.type}</span>
                                    </div>
                                    <p className="font-medium">{item.title}</p>
                                    {item.organization && (
                                        <p className="text-sm text-dark-muted">{item.organization}</p>
                                    )}
                                    {item.description && (
                                        <p className="text-sm text-dark-muted mt-1 line-clamp-2">{item.description}</p>
                                    )}
                                </div>
                                <div className="hidden group-hover:flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            setEditingTimeline(item);
                                            setIsTimelineModalOpen(true);
                                        }}
                                        className="p-2 rounded-lg hover:bg-white/10 text-dark-muted hover:text-white transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => item.id && handleDeleteTimeline(item.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-dark-muted hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Social Links */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Social Links</h3>
                <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Facebook</label>
                            <input
                                type="url"
                                value={profile.facebook_url}
                                onChange={(e) => setProfile({ ...profile, facebook_url: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Instagram</label>
                            <input
                                type="url"
                                value={profile.instagram_url}
                                onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Locket</label>
                            <input
                                type="url"
                                value={profile.locket_url}
                                onChange={(e) => setProfile({ ...profile, locket_url: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">TikTok</label>
                            <input
                                type="url"
                                value={profile.tiktok_url}
                                onChange={(e) => setProfile({ ...profile, tiktok_url: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">GitHub</label>
                            <input
                                type="url"
                                value={profile.github_url}
                                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">LinkedIn</label>
                            <input
                                type="url"
                                value={profile.linkedin_url}
                                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Skill Modal */}
            <SkillModal
                isOpen={isSkillModalOpen}
                onClose={() => {
                    setIsSkillModalOpen(false);
                    setEditingSkill(null);
                }}
                onSave={handleSaveSkill}
                skill={editingSkill}
            />

            {/* Timeline Modal */}
            <TimelineModal
                isOpen={isTimelineModalOpen}
                onClose={() => {
                    setIsTimelineModalOpen(false);
                    setEditingTimeline(null);
                }}
                onSave={handleSaveTimeline}
                item={editingTimeline}
            />
        </div>
    );
}

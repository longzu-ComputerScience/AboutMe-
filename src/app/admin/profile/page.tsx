"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload, User, Mail, MapPin, Briefcase } from "lucide-react";
import { profileData, skills } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";

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
    github_url: string | null;
    linkedin_url: string | null;
    facebook_url: string | null;
}

export default function AdminProfilePage() {
    const router = useRouter();
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
        github_url: profileData.social.github,
        linkedin_url: profileData.social.linkedin,
        facebook_url: profileData.social.facebook,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Check auth and fetch profile
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
                return;
            }

            // Fetch profile from Supabase (first one)
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .limit(1)
                .single();

            if (!error && data) {
                setProfile({
                    id: data.id,
                    name: data.name || "",
                    name_vi: data.name_vi || "",
                    title: data.title || "",
                    title_vi: data.title_vi || "",
                    bio: data.bio || "",
                    bio_vi: data.bio_vi || "",
                    email: data.email || "",
                    location: data.location || "",
                    github_url: data.github_url || "",
                    linkedin_url: data.linkedin_url || "",
                    facebook_url: data.facebook_url || "",
                });
            }
            setIsLoading(false);
        };
        init();
    }, [router]);

    const handleSave = async () => {
        setIsSaving(true);
        setError("");

        try {
            if (profile.id) {
                // Update existing profile
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
                        github_url: profile.github_url || null,
                        linkedin_url: profile.linkedin_url || null,
                        facebook_url: profile.facebook_url || null,
                    })
                    .eq("id", profile.id);

                if (updateError) {
                    setError(updateError.message);
                    return;
                }
            } else {
                // Insert new profile
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
                        github_url: profile.github_url || null,
                        linkedin_url: profile.linkedin_url || null,
                        facebook_url: profile.facebook_url || null,
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
                        <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-4xl font-bold">
                            {profile.name.charAt(0)}
                        </div>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm">
                            <Upload className="w-4 h-4" />
                            Upload Photo
                        </button>
                        <p className="text-xs text-dark-muted mt-2">
                            Recommended: 400x400px
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
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
                    <h3 className="font-semibold">Skills</h3>
                    <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                        + Add Skill
                    </button>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {skills.map((skill) => (
                        <div
                            key={skill.name}
                            className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-dark-border"
                        >
                            <span className="text-xl">{skill.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{skill.name}</p>
                                <p className="text-xs text-dark-muted capitalize">{skill.level}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Social Links</h3>
                <div className="grid sm:grid-cols-3 gap-4">
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
                        <label className="block text-sm font-medium mb-2">Facebook</label>
                        <input
                            type="url"
                            value={profile.facebook_url}
                            onChange={(e) => setProfile({ ...profile, facebook_url: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

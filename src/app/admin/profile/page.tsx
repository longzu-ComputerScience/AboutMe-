"use client";

import { useState } from "react";
import { Save, Upload, User, Mail, MapPin, Briefcase } from "lucide-react";
import { profileData, skills } from "@/lib/mockData";

export default function AdminProfilePage() {
    const [profile, setProfile] = useState(profileData);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

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
                                Name
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
                                <Briefcase className="w-4 h-4 inline mr-2" />
                                Title
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
                            <label className="block text-sm font-medium mb-2">Bio</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                rows={4}
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
                            value={profile.social.github}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    social: { ...profile.social, github: e.target.value },
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">LinkedIn</label>
                        <input
                            type="url"
                            value={profile.social.linkedin}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    social: { ...profile.social, linkedin: e.target.value },
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Facebook</label>
                        <input
                            type="url"
                            value={profile.social.facebook}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    social: { ...profile.social, facebook: e.target.value },
                                })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-dark-border focus:border-primary-500/50 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

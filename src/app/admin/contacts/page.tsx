"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Clock, Check, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Contact {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    is_read: boolean;
    replied_at: string | null;
    created_at: string;
}

export default function AdminContactsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    // Check auth and fetch contacts
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
                return;
            }

            fetchContacts();
        };
        init();
    }, [router]);

    const fetchContacts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("contacts")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setContacts(data);
        }
        setIsLoading(false);
    };

    const markAsRead = async (id: string) => {
        await supabase
            .from("contacts")
            .update({ is_read: true })
            .eq("id", id);

        setContacts(prev => prev.map(c =>
            c.id === id ? { ...c, is_read: true } : c
        ));
    };

    const deleteContact = async (id: string) => {
        if (!confirm("Xóa tin nhắn này?")) return;

        await supabase
            .from("contacts")
            .delete()
            .eq("id", id);

        setContacts(prev => prev.filter(c => c.id !== id));
        if (selectedContact?.id === id) {
            setSelectedContact(null);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const unreadCount = contacts.filter(c => !c.is_read).length;

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
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Mail className="w-6 h-6" />
                        Tin nhắn liên hệ
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-sm bg-primary-500 rounded-full">
                                {unreadCount} mới
                            </span>
                        )}
                    </h1>
                    <p className="text-dark-muted">Xem và quản lý tin nhắn từ người dùng</p>
                </div>
                <button
                    onClick={fetchContacts}
                    className="btn-outline inline-flex items-center gap-2 justify-center"
                >
                    <RefreshCw className="w-4 h-4" />
                    Làm mới
                </button>
            </div>

            {contacts.length === 0 ? (
                <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-dark-muted" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có tin nhắn</h3>
                    <p className="text-dark-muted">
                        Khi có người gửi liên hệ, tin nhắn sẽ hiển thị ở đây.
                    </p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Contacts List */}
                    <div className="lg:col-span-2 space-y-2">
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => {
                                    setSelectedContact(contact);
                                    if (!contact.is_read) {
                                        markAsRead(contact.id);
                                    }
                                }}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedContact?.id === contact.id
                                        ? "bg-primary-500/10 border-primary-500/30"
                                        : "bg-dark-card border-dark-border hover:border-primary-500/20"
                                    } ${!contact.is_read ? "border-l-4 border-l-primary-500" : ""}`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-medium truncate ${!contact.is_read ? "text-white" : "text-dark-text/80"}`}>
                                                {contact.name}
                                            </p>
                                            {!contact.is_read && (
                                                <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm text-dark-muted truncate">{contact.email}</p>
                                        <p className="text-sm text-dark-text/70 truncate mt-1">
                                            {contact.subject || "(Không có tiêu đề)"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-dark-muted flex-shrink-0">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(contact.created_at).split(",")[0]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Detail */}
                    <div className="lg:col-span-3">
                        {selectedContact ? (
                            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-semibold">{selectedContact.name}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <a
                                                href={`mailto:${selectedContact.email}`}
                                                className="text-primary-400 hover:underline flex items-center gap-1"
                                            >
                                                {selectedContact.email}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                            <span className="text-dark-muted text-sm">
                                                {formatDate(selectedContact.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => deleteContact(selectedContact.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {selectedContact.subject && (
                                    <div className="mb-4">
                                        <p className="text-sm text-dark-muted mb-1">Chủ đề</p>
                                        <p className="font-medium">{selectedContact.subject}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-dark-muted mb-2">Nội dung</p>
                                    <div className="p-4 rounded-xl bg-white/5 whitespace-pre-wrap">
                                        {selectedContact.message}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <a
                                        href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Liên hệ từ website"}`}
                                        className="btn-glow inline-flex items-center gap-2"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Phản hồi
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
                                <Mail className="w-12 h-12 mx-auto mb-4 text-dark-muted" />
                                <p className="text-dark-muted">
                                    Chọn một tin nhắn để xem chi tiết
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

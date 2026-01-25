"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    Briefcase,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";

const sidebarLinks = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
    { href: "/admin/blog", icon: FileText, label: "Blog Posts" },
    { href: "/admin/services", icon: Briefcase, label: "Services" },
    { href: "/admin/profile", icon: User, label: "Profile" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Don't show sidebar on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-[calc(100vh-var(--header-height))] flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-dark-border transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
                style={{ top: "var(--header-height)" }}
            >
                <div className="h-full flex flex-col p-4">
                    {/* Close button (mobile) */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 mt-8 lg:mt-0">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                            : "hover:bg-white/5 text-dark-text/70 hover:text-white"
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span className="font-medium">{link.label}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="pt-4 border-t border-dark-border">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Back to Site</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center gap-4 p-4 border-b border-dark-border">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-white/10"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1 className="font-semibold">Admin Panel</h1>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
}

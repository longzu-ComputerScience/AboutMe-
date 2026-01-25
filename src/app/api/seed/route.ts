import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for seeding (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const mockProjects = [
    {
        title: "E-Commerce Platform",
        slug: "ecommerce-platform",
        description: "A full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.",
        description_vi: "Nền tảng thương mại điện tử đầy đủ tính năng với tích hợp thanh toán, quản lý kho và bảng điều khiển admin.",
        image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
        tags: ["Next.js", "Stripe", "PostgreSQL", "TailwindCSS"],
        demo_url: "https://demo.example.com",
        source_url: "https://github.com/longzu/ecommerce",
        is_paid: false,
        category: "Web App",
        is_published: true,
        is_featured: true,
    },
    {
        title: "DKHP Tool",
        slug: "dkhp-tool",
        description: "Automated course registration tool for university students with smart scheduling.",
        description_vi: "Công cụ đăng ký học phần tự động cho sinh viên đại học với lịch học thông minh.",
        image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
        tags: ["Python", "Selenium", "React", "API"],
        is_paid: true,
        price: 200000,
        category: "Tool",
        is_published: true,
        is_featured: true,
    },
    {
        title: "Portfolio Template",
        slug: "portfolio-template",
        description: "Modern, responsive portfolio template for developers and designers.",
        description_vi: "Template portfolio hiện đại, responsive cho lập trình viên và nhà thiết kế.",
        image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        tags: ["Next.js", "TailwindCSS", "Framer Motion"],
        demo_url: "https://template.example.com",
        source_url: "https://github.com/longzu/portfolio-template",
        is_paid: false,
        category: "Template",
        is_published: true,
        is_featured: false,
    },
    {
        title: "Task Management App",
        slug: "task-management",
        description: "Collaborative task management with real-time updates and team features.",
        description_vi: "Ứng dụng quản lý công việc cộng tác với cập nhật thời gian thực và tính năng nhóm.",
        image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
        tags: ["React", "Node.js", "Socket.io", "MongoDB"],
        demo_url: "https://tasks.example.com",
        is_paid: false,
        category: "Web App",
        is_published: true,
        is_featured: false,
    },
    {
        title: "AI Content Generator",
        slug: "ai-content-generator",
        description: "AI-powered content generation tool for marketing and social media.",
        description_vi: "Công cụ tạo nội dung bằng AI cho marketing và mạng xã hội.",
        image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        tags: ["Python", "OpenAI", "FastAPI", "React"],
        is_paid: true,
        price: 500000,
        category: "AI Tool",
        is_published: true,
        is_featured: true,
    },
    {
        title: "Weather Dashboard",
        slug: "weather-dashboard",
        description: "Beautiful weather dashboard with forecasts and location-based data.",
        description_vi: "Dashboard thời tiết đẹp mắt với dự báo và dữ liệu dựa trên vị trí.",
        image_url: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80",
        tags: ["React", "API", "Charts", "Geolocation"],
        demo_url: "https://weather.example.com",
        source_url: "https://github.com/longzu/weather",
        is_paid: false,
        category: "Mini App",
        is_published: true,
        is_featured: false,
    },
];

export async function POST() {
    try {
        // Check if service role key exists
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { error: "SUPABASE_SERVICE_ROLE_KEY not configured" },
                { status: 500 }
            );
        }

        // Check if projects already exist
        const { data: existingProjects } = await supabaseAdmin
            .from("projects")
            .select("id")
            .limit(1);

        if (existingProjects && existingProjects.length > 0) {
            return NextResponse.json(
                { message: "Projects already exist. Skipping seed.", count: existingProjects.length },
                { status: 200 }
            );
        }

        // Insert mock projects
        const { data, error } = await supabaseAdmin
            .from("projects")
            .insert(mockProjects)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Successfully seeded projects!",
            count: data?.length || 0,
            projects: data,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to seed projects: " + (error as Error).message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Seed API - POST to this endpoint to import mock projects to Supabase",
        note: "This will only run once if projects table is empty",
    });
}

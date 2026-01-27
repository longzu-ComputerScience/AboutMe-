import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
    profileData,
    skills,
    timeline,
    projects,
    blogPosts,
    services,
    cvData,
} from "@/lib/mockData";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const parsePublishedAt = (value?: string | null) => {
    if (!value) return null;
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return null;
    return new Date(parsed).toISOString();
};

const mapProjects = () =>
    projects.map((project, index) => ({
        title: project.title,
        slug: project.slug,
        description: project.description,
        description_vi: null,
        content: null,
        content_vi: null,
        image_url: project.image || null,
        demo_url: project.demoUrl || null,
        source_url: project.sourceUrl || null,
        category: project.category || null,
        tags: project.tags && project.tags.length > 0 ? project.tags : null,
        is_paid: Boolean(project.isPaid),
        price: null,
        is_featured: false,
        is_published: true,
        sort_order: index + 1,
    }));

const mapBlogPosts = () =>
    blogPosts.map((post) => ({
        title: post.title,
        title_vi: null,
        slug: post.slug,
        excerpt: post.excerpt,
        excerpt_vi: null,
        content: post.content || null,
        content_vi: null,
        cover_image_url: null,
        tags: post.tags && post.tags.length > 0 ? post.tags : null,
        read_time: post.readTime || null,
        is_featured: Boolean(post.featured),
        is_published: true,
        published_at: parsePublishedAt(post.date),
    }));

const mapServices = () =>
    services.map((service, index) => ({
        title: service.title,
        title_vi: null,
        description: service.description || null,
        description_vi: null,
        price: service.price || null,
        price_note: service.priceNote || null,
        features: service.features && service.features.length > 0 ? service.features : null,
        features_vi: null,
        is_highlighted: Boolean(service.highlighted),
        is_active: true,
        sort_order: index + 1,
    }));

const mapProfile = () => ({
    name: profileData.name,
    name_vi: null,
    title: profileData.title,
    title_vi: null,
    bio: profileData.bio || null,
    bio_vi: null,
    avatar_url: profileData.avatar || null,
    location: profileData.location || null,
    email: profileData.email || null,
    phone: null,
    github_url: profileData.social?.github || null,
    linkedin_url: profileData.social?.linkedin || null,
    facebook_url: profileData.social?.facebook || null,
    instagram_url: profileData.social?.instagram || null,
    locket_url: profileData.social?.locket || null,
    tiktok_url: profileData.social?.tiktok || null,
    twitter_url: null,
    cv_url: cvData?.pdfUrl || null,
    is_available_for_hire: true,
});

const mapSkills = () =>
    skills.map((skill, index) => ({
        name: skill.name,
        icon: skill.icon || null,
        level: skill.level,
        category: skill.category,
        sort_order: index + 1,
    }));

const mapTimeline = () =>
    timeline.map((item, index) => ({
        year: item.year,
        title: item.title,
        title_vi: null,
        description: item.description || null,
        description_vi: null,
        organization: item.organization || null,
        type: item.type,
        sort_order: index + 1,
    }));

const mapCvTemplates = () =>
    (cvData?.templates || []).map((template, index) => ({
        name: template.name,
        preview_url: template.preview || null,
        download_url: null,
        is_free: true,
        sort_order: index + 1,
    }));

const tableHasRows = async (table: string) => {
    const { data, error } = await supabaseAdmin.from(table).select("id").limit(1);
    if (error) {
        throw error;
    }
    return Boolean(data && data.length > 0);
};

export async function POST() {
    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { error: "SUPABASE_SERVICE_ROLE_KEY not configured" },
                { status: 500 }
            );
        }

        const results: Record<
            string,
            { inserted: number; skipped: boolean; error?: string }
        > = {};

        const seedTable = async (
            table: string,
            rows: Record<string, unknown>[]
        ) => {
            if (await tableHasRows(table)) {
                results[table] = { inserted: 0, skipped: true };
                return;
            }

            if (rows.length === 0) {
                results[table] = { inserted: 0, skipped: true };
                return;
            }

            const { data, error } = await supabaseAdmin
                .from(table)
                .insert(rows)
                .select("id");

            if (error) {
                results[table] = { inserted: 0, skipped: false, error: error.message };
                return;
            }

            results[table] = { inserted: data?.length || 0, skipped: false };
        };

        await seedTable("profiles", [mapProfile()]);
        await seedTable("skills", mapSkills());
        await seedTable("timeline", mapTimeline());
        await seedTable("projects", mapProjects());
        await seedTable("blog_posts", mapBlogPosts());
        await seedTable("services", mapServices());
        await seedTable("cv_templates", mapCvTemplates());

        return NextResponse.json({
            message: "Seed complete",
            results,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to seed: " + (error as Error).message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Seed API - POST to this endpoint to import mock data to Supabase",
        note: "Each table is only seeded when it is empty",
    });
}

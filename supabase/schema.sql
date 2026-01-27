-- =====================================================
-- ABOUTME PORTFOLIO - SUPABASE DATABASE SCHEMA
-- =====================================================
-- Chạy SQL này trong Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_vi VARCHAR(100), -- Vietnamese version
    title VARCHAR(200) NOT NULL,
    title_vi VARCHAR(200),
    bio TEXT,
    bio_vi TEXT,
    avatar_url TEXT,
    location VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    github_url TEXT,
    linkedin_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    locket_url TEXT,
    tiktok_url TEXT,
    twitter_url TEXT,
    cv_url TEXT,
    is_available_for_hire BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. SKILLS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50), -- emoji or icon name
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    category VARCHAR(50), -- Frontend, Backend, Database, etc.
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. TIMELINE TABLE (Education, Work, Achievements)
-- =====================================================
CREATE TABLE IF NOT EXISTS timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    title_vi VARCHAR(200),
    description TEXT,
    description_vi TEXT,
    organization VARCHAR(200),
    type VARCHAR(20) CHECK (type IN ('education', 'work', 'achievement')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    title_vi VARCHAR(200),
    description TEXT,
    description_vi TEXT,
    content TEXT, -- Full markdown content
    content_vi TEXT,
    image_url TEXT,
    demo_url TEXT,
    source_url TEXT,
    category VARCHAR(50), -- Web App, Tool, Template, etc.
    tags TEXT[], -- Array of tags
    is_paid BOOLEAN DEFAULT false,
    price DECIMAL(10, 2),
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    title_vi VARCHAR(300),
    excerpt TEXT,
    excerpt_vi TEXT,
    content TEXT, -- Markdown content
    content_vi TEXT,
    cover_image_url TEXT,
    tags TEXT[],
    read_time VARCHAR(20), -- "5 min read"
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    title_vi VARCHAR(200),
    description TEXT,
    description_vi TEXT,
    price VARCHAR(50), -- "3.000.000đ"
    price_note VARCHAR(50), -- "/ project"
    features TEXT[], -- Array of features
    features_vi TEXT[],
    is_highlighted BOOLEAN DEFAULT false,
    cta_text VARCHAR(50) DEFAULT 'Get Started',
    cta_text_vi VARCHAR(50) DEFAULT 'Bắt đầu',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. CV TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cv_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    preview_url TEXT,
    download_url TEXT,
    is_free BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. CONTACTS / LEADS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(300),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. SITE SETTINGS TABLE (for SEO, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    value_vi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ POLICIES (for website visitors)
-- =====================================================

-- Profiles: Public can read
CREATE POLICY "Public can read profiles" ON profiles
    FOR SELECT USING (true);

-- Skills: Public can read
CREATE POLICY "Public can read skills" ON skills
    FOR SELECT USING (true);

-- Timeline: Public can read
CREATE POLICY "Public can read timeline" ON timeline
    FOR SELECT USING (true);

-- Projects: Public can read published only
CREATE POLICY "Public can read published projects" ON projects
    FOR SELECT USING (is_published = true);

-- Blog Posts: Public can read published only
CREATE POLICY "Public can read published posts" ON blog_posts
    FOR SELECT USING (is_published = true);

-- Services: Public can read active only
CREATE POLICY "Public can read active services" ON services
    FOR SELECT USING (is_active = true);

-- CV Templates: Public can read
CREATE POLICY "Public can read cv_templates" ON cv_templates
    FOR SELECT USING (true);

-- Site Settings: Public can read
CREATE POLICY "Public can read site_settings" ON site_settings
    FOR SELECT USING (true);

-- Contacts: Public can INSERT (submit contact form)
CREATE POLICY "Public can submit contacts" ON contacts
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- ADMIN POLICIES (authenticated users)
-- =====================================================

-- Create admin policies for all CRUD operations
CREATE POLICY "Admin full access profiles" ON profiles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access skills" ON skills
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access timeline" ON timeline
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access blog_posts" ON blog_posts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access services" ON services
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access cv_templates" ON cv_templates
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access contacts" ON contacts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access site_settings" ON site_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_timeline_type ON timeline(type);

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- STORAGE BUCKET SETUP (Run this separately in Dashboard or here)
-- =====================================================

-- Create storage bucket for images (avatars, project images)
-- NOTE: Run this in Supabase Dashboard > SQL Editor
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'images',
    'images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for images bucket
-- Public can view all images
CREATE POLICY "Public can view images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

-- Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Authenticated users can update their images
CREATE POLICY "Authenticated users can update images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Authenticated users can delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
    FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- =====================================================
-- SAMPLE DATA (Optional - uncomment to insert)
-- =====================================================

-- Insert sample profile
INSERT INTO profiles (name, name_vi, title, title_vi, bio, bio_vi, email, location, is_available_for_hire)
VALUES (
    'LongZu',
    'LongZu',
    'Full Stack Developer & Designer',
    'Lập trình viên Full Stack & Thiết kế',
    'Passionate developer with expertise in building modern web applications.',
    'Lập trình viên đam mê với chuyên môn xây dựng ứng dụng web hiện đại.',
    'contact@longzu.dev',
    'Vietnam',
    true
);

-- Insert sample skills
INSERT INTO skills (name, icon, level, category, sort_order) VALUES
    ('React / Next.js', '⚛️', 'expert', 'Frontend', 1),
    ('TypeScript', '📘', 'advanced', 'Language', 2),
    ('Node.js', '🟢', 'advanced', 'Backend', 3),
    ('Python', '🐍', 'intermediate', 'Language', 4),
    ('PostgreSQL', '🐘', 'advanced', 'Database', 5),
    ('TailwindCSS', '🎨', 'expert', 'Styling', 6);

-- Insert sample timeline
INSERT INTO timeline (year, title, title_vi, description, description_vi, organization, type, sort_order) VALUES
    ('2024', 'Senior Developer', 'Lập trình viên Senior', 'Leading development of enterprise applications.', 'Dẫn dắt phát triển ứng dụng doanh nghiệp.', 'Tech Company', 'work', 1),
    ('2022', 'Bachelor in CS', 'Cử nhân CNTT', 'Graduated with honors.', 'Tốt nghiệp loại giỏi.', 'University of Technology', 'education', 2);

-- Insert sample services
INSERT INTO services (title, title_vi, description, description_vi, price, price_note, features, features_vi, is_highlighted, sort_order) VALUES
    ('Landing Page', 'Trang đích', 'Perfect for showcasing your product.', 'Hoàn hảo để giới thiệu sản phẩm.', '3.000.000đ', '/ project', ARRAY['Responsive design', 'SEO optimized', '5-7 days delivery'], ARRAY['Thiết kế responsive', 'Tối ưu SEO', 'Giao hàng 5-7 ngày'], false, 1),
    ('Business Website', 'Website doanh nghiệp', 'Complete multi-page website.', 'Website đa trang hoàn chỉnh.', '8.000.000đ', '/ project', ARRAY['Up to 5 pages', 'CMS integration', '2 weeks delivery'], ARRAY['Tối đa 5 trang', 'Tích hợp CMS', 'Giao hàng 2 tuần'], true, 2);

COMMIT;

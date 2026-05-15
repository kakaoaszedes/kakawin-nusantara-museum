DROP TABLE IF EXISTS pameran CASCADE;
DROP TABLE IF EXISTS timeline CASCADE;
DROP TABLE IF EXISTS syair CASCADE;
DROP TABLE IF EXISTS budaya CASCADE;
DROP TABLE IF EXISTS tokoh CASCADE;
DROP TABLE IF EXISTS kerajaan CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;

-- =========================
-- 1. KERAJAAN (KINGDOMS)
-- =========================
CREATE TABLE IF NOT EXISTS kerajaan (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  period TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 2. TOKOH (FIGURES)
-- =========================
CREATE TABLE IF NOT EXISTS tokoh (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  period TEXT,
  kerajaan_id INTEGER REFERENCES kerajaan(id) ON DELETE SET NULL,
  biography TEXT,
  influence TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 3. BUDAYA (COLLECTIONS)
-- =========================
CREATE TABLE IF NOT EXISTS budaya (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 4. SYAIR (MANUSCRIPTS)
-- =========================
CREATE TABLE IF NOT EXISTS syair (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  content TEXT,
  period TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 5. TIMELINE
-- =========================
CREATE TABLE IF NOT EXISTS timeline (
  id SERIAL PRIMARY KEY,
  year TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  related_id INTEGER,
  related_type TEXT,
  kerajaan_id INTEGER REFERENCES kerajaan(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 6. PAMERAN (EXHIBITIONS)
-- =========================
CREATE TABLE IF NOT EXISTS pameran (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 7. GALLERY
-- =========================
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- ENABLE RLS
-- =========================
ALTER TABLE kerajaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokoh ENABLE ROW LEVEL SECURITY;
ALTER TABLE budaya ENABLE ROW LEVEL SECURITY;
ALTER TABLE syair ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE pameran ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- =========================
-- POLICIES KERAJAAN
-- =========================
CREATE POLICY "public read kerajaan"
ON kerajaan
FOR SELECT
USING (true);

CREATE POLICY "public insert kerajaan"
ON kerajaan
FOR INSERT
WITH CHECK (true);

CREATE POLICY "public update kerajaan"
ON kerajaan
FOR UPDATE
USING (true);

CREATE POLICY "public delete kerajaan"
ON kerajaan
FOR DELETE
USING (true);

-- =========================
-- POLICIES TOKOH
-- =========================
CREATE POLICY "public read tokoh"
ON tokoh
FOR SELECT
USING (true);

CREATE POLICY "public insert tokoh"
ON tokoh
FOR INSERT
WITH CHECK (true);

CREATE POLICY "public update tokoh"
ON tokoh
FOR UPDATE
USING (true);

CREATE POLICY "public delete tokoh"
ON tokoh
FOR DELETE
USING (true);

-- =========================
-- POLICIES BUDAYA
-- =========================
CREATE POLICY "public read budaya"
ON budaya
FOR SELECT
USING (true);

CREATE POLICY "public insert budaya"
ON budaya
FOR INSERT
WITH CHECK (true);

CREATE POLICY "public update budaya"
ON budaya
FOR UPDATE
USING (true);

CREATE POLICY "public delete budaya"
ON budaya
FOR DELETE
USING (true);

-- =========================
-- POLICIES SYAIR
-- =========================
CREATE POLICY "public read syair"
ON syair
FOR SELECT
USING (true);

CREATE POLICY "public insert syair"
ON syair
FOR INSERT
WITH CHECK (true);

CREATE POLICY "public update syair"
ON syair
FOR UPDATE
USING (true);

CREATE POLICY "public delete syair"
ON syair
FOR DELETE
USING (true);

-- =========================
-- POLICIES TIMELINE
-- =========================
CREATE POLICY "public read timeline"
ON timeline
FOR SELECT
USING (true);

CREATE POLICY "public insert timeline"
ON timeline
FOR INSERT
WITH CHECK (true);

CREATE POLICY "public update timeline"
ON timeline
FOR UPDATE
USING (true);

CREATE POLICY "public delete timeline"
ON timeline
FOR DELETE
USING (true);

-- =========================
-- POLICIES PAMERAN
-- =========================
CREATE POLICY "public read pameran"
ON pameran
FOR SELECT
USING (true);

CREATE POLICY "public insert pameran"
ON pameran
FOR INSERT
WITH CHECK (true);

CREATE POLICY "public update pameran"
ON pameran
FOR UPDATE
USING (true);

CREATE POLICY "public delete pameran"
ON pameran
FOR DELETE
USING (true);

-- =========================
-- POLICIES GALLERY
-- =========================
CREATE POLICY "public read gallery"
ON gallery
FOR SELECT
USING (true);

CREATE POLICY "public insert gallery"
ON gallery
FOR INSERT
WITH CHECK (true);

CREATE POLICY "public update gallery"
ON gallery
FOR UPDATE
USING (true);

CREATE POLICY "public delete gallery"
ON gallery
FOR DELETE
USING (true);

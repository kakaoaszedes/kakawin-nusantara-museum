-- Create collections table in Supabase
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  "imageUrl" TEXT,
  category TEXT,
  region TEXT,
  origin TEXT,
  "kingdomId" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create figures table
CREATE TABLE IF NOT EXISTS figures (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  biography TEXT,
  influence TEXT,
  period TEXT,
  "imageUrl" TEXT,
  "kingdomId" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create kingdoms table
CREATE TABLE IF NOT EXISTS kingdoms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  period TEXT,
  region TEXT,
  description TEXT,
  capitals TEXT[],
  "imageUrl" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exhibitions table
CREATE TABLE IF NOT EXISTS exhibitions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  "startDate" TEXT,
  "endDate" TEXT,
  "imageUrl" TEXT,
  "isActive" BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  "imageUrl" TEXT NOT NULL,
  title TEXT,
  category TEXT,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create manuscripts table
CREATE TABLE IF NOT EXISTS manuscripts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  "kingdomId" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create timeline table
CREATE TABLE IF NOT EXISTS timeline (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  year TEXT,
  description TEXT,
  "kingdomId" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON collections
FOR ALL USING (auth.role() = 'authenticated');

-- Create policy to allow all operations for anon users (for development)
CREATE POLICY "Allow all operations for anon users" ON collections
FOR ALL USING (true);

-- Create timeline table
CREATE TABLE IF NOT EXISTS timeline (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  year TEXT,
  description TEXT,
  "kingdomId" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE figures ENABLE ROW LEVEL SECURITY;
ALTER TABLE kingdoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users on collections" ON collections
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on figures" ON figures
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on kingdoms" ON kingdoms
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on exhibitions" ON exhibitions
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on gallery" ON gallery
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on manuscripts" ON manuscripts
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on timeline" ON timeline
FOR ALL USING (auth.role() = 'authenticated');

-- Create policies to allow all operations for anon users (for development)
CREATE POLICY "Allow all operations for anon users on collections" ON collections FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users on figures" ON figures FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users on kingdoms" ON kingdoms FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users on exhibitions" ON exhibitions FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users on gallery" ON gallery FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users on manuscripts" ON manuscripts FOR ALL USING (true);
CREATE POLICY "Allow all operations for anon users on timeline" ON timeline FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_figures_updated_at
    BEFORE UPDATE ON figures
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kingdoms_updated_at
    BEFORE UPDATE ON kingdoms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exhibitions_updated_at
    BEFORE UPDATE ON exhibitions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at
    BEFORE UPDATE ON gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manuscripts_updated_at
    BEFORE UPDATE ON manuscripts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeline_updated_at
    BEFORE UPDATE ON timeline
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
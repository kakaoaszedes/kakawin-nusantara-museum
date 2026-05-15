import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Dynamic import for ES modules
    const { supabase } = await import('./src/lib/supabase.ts');

    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('contents')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('Database connection failed:', testError);
      return;
    }

    console.log('Database connected successfully');

    // Check if collections table exists
    const { data: collectionsData, error: collectionsError } = await supabase
      .from('contents')
      .select('*')
      .limit(1);

    if (collectionsError && collectionsError.code === 'PGRST116') {
      console.log('Collections table does not exist');
      console.log('Please run this SQL in Supabase dashboard:');
      console.log(`
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
      `);
    } else if (collectionsError) {
      console.error('Error checking collections table:', collectionsError);
    } else {
      console.log('Collections table exists');

      // Show existing data
      const { data: allCollections, error: fetchError } = await supabase
        .from('contents')
        .select('*')
        .limit(10);

      if (fetchError) {
        console.error('Error fetching collections:', fetchError);
      } else {
        console.log('Current collections data:', allCollections);
      }
    }

  } catch (error) {
    console.error('Setup error:', error);
  }
}

setupDatabase();
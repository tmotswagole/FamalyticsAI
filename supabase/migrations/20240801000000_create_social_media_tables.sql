-- Create social media accounts table
CREATE TABLE IF NOT EXISTS social_media_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  platform TEXT NOT NULL,
  name TEXT NOT NULL,
  username TEXT,
  profile_url TEXT,
  credentials TEXT NOT NULL, -- Encrypted JSON with access tokens, etc.
  followers INTEGER,
  following INTEGER,
  posts_count INTEGER,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  profile_image TEXT,
  last_synced TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create social media posts table
CREATE TABLE IF NOT EXISTS social_media_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES social_media_accounts(id),
  organization_id UUID REFERENCES organizations(id),
  platform TEXT NOT NULL,
  post_id TEXT NOT NULL,
  post_url TEXT,
  post_date TIMESTAMP WITH TIME ZONE,
  content TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  views INTEGER,
  impressions INTEGER,
  reach INTEGER,
  engagement FLOAT,
  engagement_rate FLOAT,
  sentiment_score FLOAT,
  sentiment_label TEXT,
  keywords JSONB,
  media_urls JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(platform, post_id)
);

-- Enable row level security
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for social_media_accounts
DROP POLICY IF EXISTS "Users can view social media accounts in their organizations" ON social_media_accounts;
CREATE POLICY "Users can view social media accounts in their organizations"
  ON social_media_accounts
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can insert social media accounts for their organizations" ON social_media_accounts;
CREATE POLICY "Admins can insert social media accounts for their organizations"
  ON social_media_accounts
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid() AND role IN ('CLIENTADMIN')
    )
  );

DROP POLICY IF EXISTS "Admins can update social media accounts in their organizations" ON social_media_accounts;
CREATE POLICY "Admins can update social media accounts in their organizations"
  ON social_media_accounts
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid() AND role IN ('CLIENTADMIN')
    )
  );

DROP POLICY IF EXISTS "Admins can delete social media accounts in their organizations" ON social_media_accounts;
CREATE POLICY "Admins can delete social media accounts in their organizations"
  ON social_media_accounts
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid() AND role IN ('CLIENTADMIN')
    )
  );

-- Create policies for social_media_posts
DROP POLICY IF EXISTS "Users can view social media posts in their organizations" ON social_media_posts;
CREATE POLICY "Users can view social media posts in their organizations"
  ON social_media_posts
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can insert social media posts" ON social_media_posts;
CREATE POLICY "System can insert social media posts"
  ON social_media_posts
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "System can update social media posts" ON social_media_posts;
CREATE POLICY "System can update social media posts"
  ON social_media_posts
  FOR UPDATE
  USING (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE social_media_accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE social_media_posts;
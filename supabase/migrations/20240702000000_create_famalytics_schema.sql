-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  settings JSONB DEFAULT '{}'::jsonb
);

-- User organizations relationship table
CREATE TABLE IF NOT EXISTS user_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  role TEXT NOT NULL, -- 'SYSADMIN', 'CLIENTADMIN', 'OBSERVER'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  invited_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, organization_id)
);

-- Feedback entries table
CREATE TABLE IF NOT EXISTS feedback_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  text_content TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  feedback_date TIMESTAMP WITH TIME ZONE,
  sentiment_score NUMERIC,
  sentiment_label TEXT,
  themes JSONB,
  keywords JSONB,
  metadata JSONB,
  processed BOOLEAN DEFAULT false
);

-- Themes table
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_system_generated BOOLEAN DEFAULT false
);

-- Feedback themes relationship table
CREATE TABLE IF NOT EXISTS feedback_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id UUID REFERENCES feedback_entries(id),
  theme_id UUID REFERENCES themes(id),
  confidence_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Alert configurations table
CREATE TABLE IF NOT EXISTS alert_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  theme_id UUID REFERENCES themes(id),
  sentiment_threshold NUMERIC,
  volume_threshold INTEGER,
  is_active BOOLEAN DEFAULT true,
  notification_channel TEXT[], -- ['email', 'in_app']
  frequency TEXT DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Alert recipients table
CREATE TABLE IF NOT EXISTS alert_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_configuration_id UUID REFERENCES alert_configurations(id),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Alert history table
CREATE TABLE IF NOT EXISTS alert_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_configuration_id UUID REFERENCES alert_configurations(id),
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  trigger_reason TEXT,
  trigger_data JSONB,
  notification_sent BOOLEAN DEFAULT false,
  notification_sent_at TIMESTAMP WITH TIME ZONE
);

-- Trend reports table
CREATE TABLE IF NOT EXISTS trend_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  report_date DATE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- In-app notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'alert', 'system', 'info'
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create function to calculate average sentiment score
CREATE OR REPLACE FUNCTION get_average_sentiment_score(start_date TIMESTAMP, end_date TIMESTAMP, org_id UUID)
RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT AVG(sentiment_score) FROM feedback_entries 
          WHERE created_at >= start_date AND created_at <= end_date
          AND organization_id = org_id);
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Organizations policies
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (id IN (
    SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Client admins can update their organizations" ON organizations;
CREATE POLICY "Client admins can update their organizations"
  ON organizations FOR UPDATE
  USING (id IN (
    SELECT organization_id FROM user_organizations 
    WHERE user_id = auth.uid() AND role = 'CLIENTADMIN'
  ));

-- User organizations policies
DROP POLICY IF EXISTS "Users can view their user_organizations" ON user_organizations;
CREATE POLICY "Users can view their user_organizations"
  ON user_organizations FOR SELECT
  USING (user_id = auth.uid() OR organization_id IN (
    SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Client admins can manage user_organizations" ON user_organizations;
CREATE POLICY "Client admins can manage user_organizations"
  ON user_organizations FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_organizations 
    WHERE user_id = auth.uid() AND role = 'CLIENTADMIN'
  ));

-- Feedback entries policies
DROP POLICY IF EXISTS "Users can view their organization's feedback" ON feedback_entries;
CREATE POLICY "Users can view their organization's feedback"
  ON feedback_entries FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Client admins can manage feedback" ON feedback_entries;
CREATE POLICY "Client admins can manage feedback"
  ON feedback_entries FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_organizations 
    WHERE user_id = auth.uid() AND role IN ('CLIENTADMIN', 'SYSADMIN')
  ));

-- Themes policies
DROP POLICY IF EXISTS "Users can view their organization's themes" ON themes;
CREATE POLICY "Users can view their organization's themes"
  ON themes FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Client admins can manage themes" ON themes;
CREATE POLICY "Client admins can manage themes"
  ON themes FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM user_organizations 
    WHERE user_id = auth.uid() AND role IN ('CLIENTADMIN', 'SYSADMIN')
  ));

-- Similar policies for other tables...

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE feedback_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE alert_history;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Create default system themes
INSERT INTO themes (name, description, is_system_generated) VALUES
('Product Quality', 'Feedback related to the quality of products', true),
('Customer Service', 'Feedback about customer service experiences', true),
('Delivery', 'Feedback about delivery times and experiences', true),
('Website/App', 'Feedback about website or app functionality', true),
('Pricing', 'Feedback related to pricing and value', true);

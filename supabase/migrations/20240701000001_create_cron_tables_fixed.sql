-- Create table for cron job logs
CREATE TABLE IF NOT EXISTS cron_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_name TEXT NOT NULL,
  status TEXT NOT NULL,
  details JSONB,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for email logs
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  type TEXT NOT NULL,
  reference_period BIGINT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for analytics reports
CREATE TABLE IF NOT EXISTS analytics_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_date DATE NOT NULL,
  report_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for sentiment analysis requests
CREATE TABLE IF NOT EXISTS sentiment_analysis_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  text_content TEXT NOT NULL,
  source TEXT,
  sentiment_score NUMERIC,
  sentiment_label TEXT,
  themes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create function to calculate average sentiment score
CREATE OR REPLACE FUNCTION get_average_sentiment_score(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS NUMERIC AS $$
BEGIN
  RETURN (SELECT AVG(sentiment_score) FROM sentiment_analysis_requests 
          WHERE created_at >= start_date AND created_at <= end_date);
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE cron_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentiment_analysis_requests ENABLE ROW LEVEL SECURITY;

-- Add policies for cron_logs (admin only)
DROP POLICY IF EXISTS "Admin can view cron logs" ON cron_logs;
CREATE POLICY "Admin can view cron logs"
  ON cron_logs FOR SELECT
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE id IN (SELECT user_id FROM users WHERE subscription = 'admin')));

-- Add policies for email_logs
DROP POLICY IF EXISTS "Users can view their own email logs" ON email_logs;
CREATE POLICY "Users can view their own email logs"
  ON email_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Add policies for analytics_reports (admin only)
DROP POLICY IF EXISTS "Admin can view analytics reports" ON analytics_reports;
CREATE POLICY "Admin can view analytics reports"
  ON analytics_reports FOR SELECT
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE id IN (SELECT user_id FROM users WHERE subscription = 'admin')));

-- Add policies for sentiment_analysis_requests
DROP POLICY IF EXISTS "Users can view their own sentiment analysis requests" ON sentiment_analysis_requests;
CREATE POLICY "Users can view their own sentiment analysis requests"
  ON sentiment_analysis_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE sentiment_analysis_requests;

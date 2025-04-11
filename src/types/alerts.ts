export type AlertConfig = {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  theme_id: string;
  sentiment_threshold: number;
  volume_threshold: number;
  is_active: boolean;
  notification_channel: string[];
  frequency: string;
  created_at: string;
};

export type AlertHistory = {
  id: string;
  alert_configuration_id: string;
  triggered_at: string;
  trigger_reason: string;
  trigger_data: any;
  notification_sent: boolean;
  notification_sent_at: string;
};

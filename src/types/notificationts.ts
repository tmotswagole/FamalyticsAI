export type Notification = {
  id: string;
  user_id: string;
  organization_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  data: any;
  created_at: string;
};

export type NotificationPreference = {
  email: boolean;
  browser: boolean;
  push: boolean;
};

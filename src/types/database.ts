export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      alert_configurations: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          theme_id: string | null;
          sentiment_threshold: number | null;
          volume_threshold: number | null;
          is_active: boolean;
          notification_channel: string[] | null;
          frequency: string;
          created_at: string;
          created_by: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          theme_id?: string | null;
          sentiment_threshold?: number | null;
          volume_threshold?: number | null;
          is_active?: boolean;
          notification_channel?: string[] | null;
          frequency?: string;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          description?: string | null;
          theme_id?: string | null;
          sentiment_threshold?: number | null;
          volume_threshold?: number | null;
          is_active?: boolean;
          notification_channel?: string[] | null;
          frequency?: string;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string | null;
        };
      };
      alert_history: {
        Row: {
          id: string;
          alert_configuration_id: string;
          triggered_at: string;
          trigger_reason: string | null;
          trigger_data: Json | null;
          notification_sent: boolean;
          notification_sent_at: string | null;
        };
        Insert: {
          id?: string;
          alert_configuration_id: string;
          triggered_at?: string;
          trigger_reason?: string | null;
          trigger_data?: Json | null;
          notification_sent?: boolean;
          notification_sent_at?: string | null;
        };
        Update: {
          id?: string;
          alert_configuration_id?: string;
          triggered_at?: string;
          trigger_reason?: string | null;
          trigger_data?: Json | null;
          notification_sent?: boolean;
          notification_sent_at?: string | null;
        };
      };
      alert_recipients: {
        Row: {
          id: string;
          alert_configuration_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          alert_configuration_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          alert_configuration_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      api_keys: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          key: string;
          is_active: boolean;
          created_at: string;
          created_by: string | null;
          last_used_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          key: string;
          is_active?: boolean;
          created_at?: string;
          created_by?: string | null;
          last_used_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          key?: string;
          is_active?: boolean;
          created_at?: string;
          created_by?: string | null;
          last_used_at?: string | null;
        };
      };
      feedback_entries: {
        Row: {
          id: string;
          organization_id: string;
          text_content: string;
          source: string | null;
          created_at: string;
          feedback_date: string | null;
          sentiment_score: number | null;
          sentiment_label: string | null;
          themes: Json | null;
          keywords: Json | null;
          metadata: Json | null;
          processed: boolean;
        };
        Insert: {
          id?: string;
          organization_id: string;
          text_content: string;
          source?: string | null;
          created_at?: string;
          feedback_date?: string | null;
          sentiment_score?: number | null;
          sentiment_label?: string | null;
          themes?: Json | null;
          keywords?: Json | null;
          metadata?: Json | null;
          processed?: boolean;
        };
        Update: {
          id?: string;
          organization_id?: string;
          text_content?: string;
          source?: string | null;
          created_at?: string;
          feedback_date?: string | null;
          sentiment_score?: number | null;
          sentiment_label?: string | null;
          themes?: Json | null;
          keywords?: Json | null;
          metadata?: Json | null;
          processed?: boolean;
        };
      };
      feedback_themes: {
        Row: {
          id: string;
          feedback_id: string;
          theme_id: string;
          confidence_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          feedback_id: string;
          theme_id: string;
          confidence_score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          feedback_id?: string;
          theme_id?: string;
          confidence_score?: number | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          title: string;
          message: string;
          type: string;
          is_read?: boolean;
          data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          organization_id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          data?: Json | null;
          created_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          subscription_tier: string | null;
          subscription_status: string | null;
          stripe_customer_id: string | null;
          settings: Json | null;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          subscription_tier?: string | null;
          subscription_status?: string | null;
          stripe_customer_id?: string | null;
          settings?: Json | null;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          subscription_tier?: string | null;
          subscription_status?: string | null;
          stripe_customer_id?: string | null;
          settings?: Json | null;
        };
      };
      themes: {
        Row: {
          id: string;
          organization_id: string | null;
          name: string;
          description: string | null;
          created_at: string;
          is_system_generated: boolean;
        };
        Insert: {
          id?: string;
          organization_id?: string | null;
          name: string;
          description?: string | null;
          created_at?: string;
          is_system_generated?: boolean;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          name?: string;
          description?: string | null;
          created_at?: string;
          is_system_generated?: boolean;
        };
      };
      trend_reports: {
        Row: {
          id: string;
          organization_id: string;
          report_date: string;
          data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          report_date: string;
          data: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          report_date?: string;
          data?: Json;
          created_at?: string;
        };
      };
      user_organizations: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          role: string;
          created_at: string;
          invited_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          role: string;
          created_at?: string;
          invited_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          organization_id?: string;
          role?: string;
          created_at?: string;
          invited_by?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          avatar_url: string | null;
          created_at: string;
          credits: string | null;
          email: string | null;
          full_name: string | null;
          image: string | null;
          name: string | null;
          subscription: string | null;
          token_identifier: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          id: string;
          avatar_url?: string | null;
          created_at?: string;
          credits?: string | null;
          email?: string | null;
          full_name?: string | null;
          image?: string | null;
          name?: string | null;
          subscription?: string | null;
          token_identifier: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          avatar_url?: string | null;
          created_at?: string;
          credits?: string | null;
          email?: string | null;
          full_name?: string | null;
          image?: string | null;
          name?: string | null;
          subscription?: string | null;
          token_identifier?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_average_sentiment_score: {
        Args: {
          start_date: string;
          end_date: string;
          org_id: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}


export interface SubscriptionTier {
  id: string;
  name: string;
  user_type: 'student' | 'owner';
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: Record<string, boolean>;
  limits: Record<string, number>;
  is_active: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  status: 'active' | 'cancelled' | 'expired';
  started_at: string;
  expires_at?: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  tier?: SubscriptionTier;
}

export interface FeatureConfig {
  id: string;
  feature_key: string;
  display_name: string;
  description: string;
  category: 'search' | 'booking' | 'analytics' | 'communication' | 'ai' | 'export';
  user_type: 'student' | 'owner' | 'both';
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformFeatures {
  // Student Features
  student_features: {
    basic_search: boolean;
    advanced_filters: boolean;
    unlimited_search_results: boolean;
    ai_hostel_matching: boolean;
    roommate_recommendations: boolean;
    priority_booking: boolean;
    future_semester_booking: boolean;
    rent_financing_access: boolean;
    property_alerts: boolean;
    virtual_tours: boolean;
    saved_properties_unlimited: boolean;
    booking_history: boolean;
    payment_tracking: boolean;
    premium_support: boolean;
    mobile_app_access: boolean;
    offline_property_viewing: boolean;
  };
  
  // Owner Features
  owner_features: {
    basic_property_listing: boolean;
    unlimited_property_listings: boolean;
    advanced_analytics: boolean;
    occupancy_real_time_tracking: boolean;
    revenue_analytics: boolean;
    export_data_csv: boolean;
    export_data_excel: boolean;
    export_financial_reports: boolean;
    tenant_communication_tools: boolean;
    automated_notifications: boolean;
    booking_management: boolean;
    pricing_optimization_suggestions: boolean;
    marketing_boost: boolean;
    priority_listing_placement: boolean;
    multi_property_management: boolean;
    staff_account_management: boolean;
    api_access: boolean;
    white_label_options: boolean;
  };
}

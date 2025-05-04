// types.ts
export interface EventData {
    name: string;
    user_id: string;
    meta_key: string[];
    meta_value: string[];
    campaign_id?: string;
    adset_id?: string;
    ad_id?: string;
    utm_source?: string;
    landing_page_id?: string;
  }
  
  export interface UserMetadata {
    campaign_id: string;
    adset_id: string;
    ad_id: string;
    utm_source: string;
    landing_page_id: string;
  }
  
  export interface SignupDetail {
    user_id: string;
    email: string;
    phone: string;
    campaign_id: string;
    adset_id: string;
    ad_id: string;
    utm_source: string;
    landing_page_id: string;
  }
  
  export interface MetricItem {
    [key: string]: string | number;
    guests: number;
    signups: number;
    total_users: number;
    conversion_rate: string;
  }
  
  export interface TopKResults {
    byGuests: MetricItem[];
    bySignups: MetricItem[];
  }
  
  export interface AnalyticsResults {
    detailedSignups: SignupDetail[];
    campaign: MetricItem[];
    adset: MetricItem[];
    ad: MetricItem[];
    landing_page: MetricItem[];
    guests: number;
    signups: number;
    conversionRate: string;
  }
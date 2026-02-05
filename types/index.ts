// Database types
export interface Profile {
  id: string;
  email: string | null;
  brand_voice: string | null;
  example_posts: string[];
  credits: number;
  plan: 'free' | 'creator' | 'pro';
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface RepurposeOutputs {
  twitter_thread: string[];
  linkedin_post: string;
  instagram_caption: string;
  tiktok_script: string;
  newsletter_blurb: string;
}

export interface Repurpose {
  id: string;
  user_id: string;
  source_url: string;
  source_title: string | null;
  source_content: string | null;
  outputs: RepurposeOutputs;
  created_at: string;
}

// API types
export interface ExtractResponse {
  title: string;
  content: string;
  excerpt: string;
  word_count: number;
}

export interface RepurposeRequest {
  url: string;
  platforms?: ('twitter' | 'linkedin' | 'instagram' | 'tiktok' | 'newsletter')[];
}

export interface RepurposeResponse {
  id: string;
  source_url: string;
  source_title: string;
  outputs: RepurposeOutputs;
  credits_remaining: number;
}

export interface CreditsResponse {
  credits: number;
  plan: string;
}

export interface SettingsUpdate {
  brand_voice?: string;
  example_posts?: string[];
}

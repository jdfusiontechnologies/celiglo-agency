export type CustomerType = 'residential' | 'commercial';

export type RequestStatus =
  | 'Request Received'
  | 'Processing'
  | 'In Progress'
  | 'Awaiting Customer Action'
  | 'Ready for Collection or Delivery'
  | 'Collected or Delivered'
  | 'Completed'
  | 'Cancelled';

export type UserRole = 'customer' | 'staff' | 'admin' | 'super_admin';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  mfa_enabled: boolean;
  department?: string;
  password?: string;
  created_at: string;
  last_login?: string;
}

export interface StatusHistoryEntry {
  id: string;
  from_status: RequestStatus | 'Initial';
  to_status: RequestStatus;
  timestamp: string;
  staff_id: string;
  staff_name: string;
  notes: string;
  proof_reference?: string;
}

export interface CollectionRequest {
  id: string;
  reference_code: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_type: CustomerType;
  service_id: string;
  service_name: string;
  waste_type: string;
  collection_address: string;
  service_area_id?: string;
  service_area_name?: string;
  preferred_date: string;
  estimated_quantity: string;
  instructions?: string;
  status: RequestStatus;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  internal_notes?: string;
  status_history: StatusHistoryEntry[];
  completion_notified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  summary: string;
  image_path: string;
  is_active: boolean;
  category: 'residential' | 'commercial' | 'specialized';
  features: string[];
}

export interface ServiceArea {
  id: string;
  area_name: string;
  county: string;
  is_active: boolean;
  notes?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export interface StaffMember {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  completed_tasks_count?: number;
  active_tasks_count?: number;
}

export interface NotificationLog {
  id: string;
  request_id: string;
  reference_code: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_email?: string;
  channel: 'sms' | 'email';
  provider: 'africas_talking' | 'standard_email';
  status: 'queued' | 'accepted' | 'delivered' | 'failed';
  trigger_status: RequestStatus;
  message_content: string;
  error_reason?: string;
  cost_kes: number;
  delivery_attempts: number;
  sent_at: string;
  delivered_at?: string;
}

export interface SmsProviderConfig {
  provider_name: string;
  is_enabled: boolean;
  mode: 'sandbox' | 'production';
  username: string;
  api_key_masked: string;
  sender_id: string;
  rate_per_sms_kes: number;
  monthly_sms_limit: number;
  current_month_sent: number;
  account_balance_kes: number;
  auto_notify_on_complete: boolean;
  auto_notify_on_ready: boolean;
  email_notifications_enabled: boolean;
  email_provider?: string;
  email_api_key?: string;
  smtp_host?: string;
  smtp_from_email?: string;
  webhook_callback_url?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole | 'system';
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  before_value?: string;
  after_value?: string;
  ip_address: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export interface SecurityEvent {
  id: string;
  event_type: 'failed_login' | 'mfa_failure' | 'lockout' | 'unauthorized_access' | 'privilege_escalation' | 'token_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address: string;
  user_email?: string;
  details: string;
  timestamp: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
}

export interface SiteSettings {
  company_name: string;
  official_slogan: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp_number: string;
  email_primary: string;
  email_support: string;
  physical_address: string;
  service_hours: string;
  booking_disclaimer: string;
  // Logo customization
  logo_mode: 'svg_emblem' | 'custom_image';
  custom_logo_url: string;
  logo_symbol: 'recycling_arrows' | 'eco_leaf' | 'modern_clean';
  // Editable homepage parts
  hero_headline: string;
  hero_subtitle: string;
  company_intro_headline: string;
  company_intro_text: string;
  benefits: BenefitItem[];
  testimonials: TestimonialItem[];
}

export type FirewallProtectionMode = 'standard' | 'strict' | 'lockdown';

export interface FirewallConfig {
  is_enabled: boolean;
  protection_mode: FirewallProtectionMode;
  block_sql_injection: boolean;
  block_xss: boolean;
  block_unauthorized_tampering: boolean;
  block_data_exfiltration: boolean;
  rate_limit_rpm: number;
  banned_ips: string[];
  whitelisted_ips: string[];
  total_threats_blocked: number;
  last_attack_timestamp?: string;
}

export interface IntrusionEvent {
  id: string;
  timestamp: string;
  attacker_ip: string;
  attack_type:
    | 'SQL_INJECTION'
    | 'XSS_ATTACK'
    | 'DATA_EXFILTRATION_PROBE'
    | 'ADMIN_TAMPER_ATTEMPT'
    | 'BRUTE_FORCE_PROBE'
    | 'PATH_TRAVERSAL';
  severity: 'low' | 'medium' | 'high' | 'critical';
  target_endpoint: string;
  detected_payload: string;
  action_taken: 'BLOCKED' | 'IP_BANNED' | 'CHALLENGED' | 'SANITIZED';
  user_agent?: string;
  country_code?: string;
}

export interface EnvVariableItem {
  id: string;
  key: string;
  value: string;
  category: 'email' | 'database' | 'sms' | 'security' | 'custom';
  description: string;
  is_secret: boolean;
  updated_at: string;
}


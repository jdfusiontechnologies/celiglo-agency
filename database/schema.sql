-- ============================================================================
-- CELIGLO AGENCY LIMITED — DATABASE SCHEMA (UPGRADED ENTERPRISE SPECIFICATION)
-- Database: celiglo_agency
-- Slogan: DON'T MIX IT, SORT IT, TAKA NI PESA.
-- Primary Market: Kenya
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `celiglo_agency`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `celiglo_agency`;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Table 1: users (Unified RBAC: Super Admin, Admin, Staff, Customer)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_uid` VARCHAR(64) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'staff', 'admin', 'super_admin') NOT NULL DEFAULT 'customer',
  `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  `mfa_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `department` VARCHAR(100) NULL,
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role_status` (`role`, `status`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 2: customers (Extended Customer Metadata & Privacy Boundaries)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(191) NULL,
  `customer_type` ENUM('residential', 'commercial') NOT NULL DEFAULT 'residential',
  `default_address` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_customers_phone` (`phone`),
  INDEX `idx_customers_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 3: services (Service Catalogue)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `category` ENUM('residential', 'commercial', 'specialized') NOT NULL DEFAULT 'residential',
  `summary` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `image_path` VARCHAR(255) NULL,
  `features_json` JSON NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_services_active` (`is_active`),
  INDEX `idx_services_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 4: service_areas (Operational Jurisdictions in Kenya)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `service_areas`;
CREATE TABLE `service_areas` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `area_name` VARCHAR(120) NOT NULL,
  `county` VARCHAR(100) NOT NULL DEFAULT 'Nairobi',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `notes` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_areas_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 5: staff (Field Operatives, Drivers & Logistics Crew)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(191) NULL,
  `role` VARCHAR(100) NOT NULL DEFAULT 'Field Operative',
  `status` ENUM('active', 'inactive', 'on_leave') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_staff_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 6: collection_requests (Core Requests System with 8 Configurable Statuses)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `collection_requests`;
CREATE TABLE `collection_requests` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `reference_code` VARCHAR(30) NOT NULL UNIQUE,
  `customer_id` INT UNSIGNED NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `customer_email` VARCHAR(191) NULL,
  `customer_type` ENUM('residential', 'commercial') NOT NULL DEFAULT 'residential',
  `service_id` INT UNSIGNED NOT NULL,
  `service_area_id` INT UNSIGNED NULL,
  `waste_type` VARCHAR(255) NOT NULL,
  `collection_address` TEXT NOT NULL,
  `preferred_date` DATE NOT NULL,
  `estimated_quantity` VARCHAR(150) NOT NULL,
  `instructions` TEXT NULL,
  `status` ENUM(
    'Request Received',
    'Processing',
    'In Progress',
    'Awaiting Customer Action',
    'Ready for Collection or Delivery',
    'Collected or Delivered',
    'Completed',
    'Cancelled'
  ) NOT NULL DEFAULT 'Request Received',
  `assigned_staff_id` INT UNSIGNED NULL,
  `internal_notes` TEXT NULL,
  `proof_reference` VARCHAR(150) NULL,
  `completion_notified` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`service_area_id`) REFERENCES `service_areas`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assigned_staff_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL,
  INDEX `idx_requests_ref` (`reference_code`),
  INDEX `idx_requests_status` (`status`),
  INDEX `idx_requests_date` (`preferred_date`),
  INDEX `idx_requests_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 7: request_status_history (Tamper-Resistant Progress Audit Trail)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `request_status_history`;
CREATE TABLE `request_status_history` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `collection_request_id` INT UNSIGNED NOT NULL,
  `from_status` VARCHAR(50) NOT NULL,
  `to_status` VARCHAR(50) NOT NULL,
  `staff_user_id` INT UNSIGNED NULL,
  `staff_name` VARCHAR(150) NOT NULL,
  `notes` TEXT NULL,
  `proof_reference` VARCHAR(150) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`collection_request_id`) REFERENCES `collection_requests`(`id`) ON DELETE CASCADE,
  INDEX `idx_status_hist_request` (`collection_request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 8: notification_logs (Africa's Talking SMS & Email Dispatches)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `notification_logs`;
CREATE TABLE `notification_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `notification_uid` VARCHAR(64) NOT NULL UNIQUE,
  `request_id` INT UNSIGNED NULL,
  `reference_code` VARCHAR(30) NOT NULL,
  `recipient_name` VARCHAR(150) NOT NULL,
  `recipient_phone` VARCHAR(30) NOT NULL,
  `recipient_email` VARCHAR(191) NULL,
  `channel` ENUM('sms', 'email') NOT NULL DEFAULT 'sms',
  `provider` ENUM('africas_talking', 'standard_email') NOT NULL DEFAULT 'africas_talking',
  `status` ENUM('queued', 'accepted', 'delivered', 'failed') NOT NULL DEFAULT 'queued',
  `trigger_status` VARCHAR(50) NOT NULL,
  `message_content` TEXT NOT NULL,
  `cost_kes` DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
  `delivery_attempts` INT UNSIGNED NOT NULL DEFAULT 1,
  `error_reason` VARCHAR(255) NULL,
  `sent_at` DATETIME NOT NULL,
  `delivered_at` DATETIME NULL,
  INDEX `idx_notif_ref` (`reference_code`),
  INDEX `idx_notif_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 9: audit_logs (Regulatory Compliance & Executive Oversight)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `user_role` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(80) NOT NULL,
  `entity_id` VARCHAR(80) NOT NULL,
  `details` TEXT NULL,
  `before_value` TEXT NULL,
  `after_value` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `severity` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'low',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_entity` (`entity_type`, `entity_id`),
  INDEX `idx_audit_severity` (`severity`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 10: security_events (Cybersecurity & Intrusion Detection)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `security_events`;
CREATE TABLE `security_events` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `event_type` ENUM('failed_login', 'mfa_failure', 'lockout', 'unauthorized_access', 'privilege_escalation', 'token_anomaly') NOT NULL,
  `severity` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
  `ip_address` VARCHAR(45) NOT NULL,
  `user_email` VARCHAR(191) NULL,
  `details` TEXT NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_sec_event_type` (`event_type`),
  INDEX `idx_sec_ip` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 11: contact_messages (Website Enquiries)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('unread', 'read', 'replied', 'archived') NOT NULL DEFAULT 'unread',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_messages_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 12: site_settings (Dynamic Configuration & Branding)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED ENTERPRISE INITIAL DATA
-- ============================================================================

-- Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('company_name', 'Celiglo Agency Limited'),
('official_slogan', 'DON\'T MIX IT, SORT IT, TAKA NI PESA.'),
('primary_phone', '+254 700 000 000'),
('secondary_phone', '+254 722 000 000'),
('whatsapp_number', '+254700000000'),
('primary_email', 'info@celiglo.co.ke'),
('support_email', 'operations@celiglo.co.ke'),
('physical_address', 'Nairobi Operational Hub, Kenya'),
('operating_hours', 'Monday – Saturday: 6:30 AM – 6:00 PM'),
('booking_disclaimer', 'Please note: Submitting a request is not a confirmed booking until authorized Celiglo Agency staff approve and schedule it.');

-- Initial Users (All 4 Roles Seeded)
INSERT INTO `users` (`user_uid`, `name`, `email`, `phone`, `password_hash`, `role`, `status`, `mfa_enabled`, `department`) VALUES
('usr-super', 'Celiglo Executive Director', 'owner@celiglo.co.ke', '+254 700 000 001', '$2y$12$K1q2pA3qWkZ/z0b0KxV4cO4yP2F7tFfC7c4V0.E4G3pU0a6xK9P3G', 'super_admin', 'active', 1, 'Executive Board'),
('usr-admin', 'Lead Administrator', 'admin@celiglo.co.ke', '+254 700 000 002', '$2y$12$K1q2pA3qWkZ/z0b0KxV4cO4yP2F7tFfC7c4V0.E4G3pU0a6xK9P3G', 'admin', 'active', 0, 'Central Operations'),
('usr-staff1', 'Evans Mutua', 'driver.evans@celiglo.co.ke', '+254 711 234 567', '$2y$12$K1q2pA3qWkZ/z0b0KxV4cO4yP2F7tFfC7c4V0.E4G3pU0a6xK9P3G', 'staff', 'active', 0, 'Fleet Logistics'),
('usr-cust1', 'David Kamau', 'david.kamau@example.com', '+254 712 345 678', '$2y$12$K1q2pA3qWkZ/z0b0KxV4cO4yP2F7tFfC7c4V0.E4G3pU0a6xK9P3G', 'customer', 'active', 0, 'Client');

-- Initial Service Areas (Kenya)
INSERT INTO `service_areas` (`area_name`, `county`, `is_active`, `notes`) VALUES
('Westlands & Parklands', 'Nairobi', 1, 'Daily residential and commercial pickups'),
('Kilimani, Kileleshwa & Lavington', 'Nairobi', 1, 'Daily high-density estate routes'),
('Karen, Langata & Rongai Corridor', 'Nairobi', 1, 'Bulk waste and scheduled estate pickups'),
('Nairobi CBD & Upper Hill', 'Nairobi', 1, 'Commercial office towers and institutions'),
('Industrial Area & Enterprise Road', 'Nairobi', 1, 'Heavy recycling, bulk, and baled materials'),
('Ruiru & Kiambu Road', 'Kiambu', 1, 'Gated communities and residential clusters'),
('Thika Town & Environs', 'Kiambu', 1, 'Commercial & industrial collection'),
('Syokimau & Athi River', 'Machakos', 1, 'Depots and residential neighborhoods');

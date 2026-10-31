-- ============================================================================
-- CELIGLO AGENCY LIMITED — POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Slogan: DON'T MIX IT, SORT IT, TAKA NI PESA.
-- Compatible with: Aiven PostgreSQL, Neon Tech, Supabase, Render, AWS RDS
-- Target Market: Kenya (Nairobi Hub & Counties)
-- ============================================================================

-- Clean slate (optional drop if re-running)
DROP TABLE IF EXISTS security_events CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS notification_logs CASCADE;
DROP TABLE IF EXISTS request_status_history CASCADE;
DROP TABLE IF EXISTS collection_requests CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS service_areas CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------------------------
-- Table 1: users (Unified RBAC)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_uid VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('customer', 'staff', 'admin', 'super_admin')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  department VARCHAR(100),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_status ON users(role, status);

-- ----------------------------------------------------------------------------
-- Table 2: customers
-- ----------------------------------------------------------------------------
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(191),
  customer_type VARCHAR(20) NOT NULL DEFAULT 'residential' CHECK (customer_type IN ('residential', 'commercial')),
  default_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

-- ----------------------------------------------------------------------------
-- Table 3: services
-- ----------------------------------------------------------------------------
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(30) NOT NULL DEFAULT 'residential' CHECK (category IN ('residential', 'commercial', 'specialized')),
  summary VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_path VARCHAR(255),
  features_json JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Table 4: service_areas
-- ----------------------------------------------------------------------------
CREATE TABLE service_areas (
  id SERIAL PRIMARY KEY,
  area_name VARCHAR(120) NOT NULL,
  county VARCHAR(100) NOT NULL DEFAULT 'Nairobi',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notes VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Table 5: staff
-- ----------------------------------------------------------------------------
CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(191),
  role_designation VARCHAR(60) NOT NULL,
  vehicle_assigned VARCHAR(80),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Table 6: collection_requests
-- ----------------------------------------------------------------------------
CREATE TABLE collection_requests (
  id SERIAL PRIMARY KEY,
  reference_code VARCHAR(32) NOT NULL UNIQUE,
  customer_id INT REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  customer_email VARCHAR(191),
  service_id INT REFERENCES services(id) ON DELETE RESTRICT,
  service_name VARCHAR(150) NOT NULL,
  waste_type VARCHAR(200) NOT NULL,
  collection_address TEXT NOT NULL,
  service_area_id INT REFERENCES service_areas(id) ON DELETE RESTRICT,
  preferred_date DATE,
  estimated_quantity VARCHAR(100),
  instructions TEXT,
  status VARCHAR(40) NOT NULL DEFAULT 'Request Received' CHECK (status IN (
    'Request Received',
    'Under Review',
    'Scheduled',
    'Vehicle Assigned',
    'Awaiting Customer Action',
    'Ready for Collection or Delivery',
    'Collected or Delivered',
    'Completed',
    'Cancelled'
  )),
  assigned_staff_id INT REFERENCES staff(id) ON DELETE SET NULL,
  assigned_staff_name VARCHAR(150),
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_col_requests_ref ON collection_requests(reference_code);
CREATE INDEX idx_col_requests_status ON collection_requests(status);
CREATE INDEX idx_col_requests_phone ON collection_requests(customer_phone);

-- ----------------------------------------------------------------------------
-- Table 7: request_status_history
-- ----------------------------------------------------------------------------
CREATE TABLE request_status_history (
  id SERIAL PRIMARY KEY,
  request_id INT NOT NULL REFERENCES collection_requests(id) ON DELETE CASCADE,
  from_status VARCHAR(40) NOT NULL,
  to_status VARCHAR(40) NOT NULL,
  note TEXT,
  staff_name VARCHAR(150),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Table 8: notification_logs (Automated Completed Email / SMS)
-- ----------------------------------------------------------------------------
CREATE TABLE notification_logs (
  id SERIAL PRIMARY KEY,
  request_id INT REFERENCES collection_requests(id) ON DELETE SET NULL,
  reference_code VARCHAR(32) NOT NULL,
  recipient_name VARCHAR(150) NOT NULL,
  recipient_phone VARCHAR(30),
  recipient_email VARCHAR(191),
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp')),
  provider VARCHAR(40) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'delivered' CHECK (status IN ('delivered', 'sent', 'failed', 'queued')),
  trigger_status VARCHAR(40) NOT NULL DEFAULT 'Completed',
  message_content TEXT NOT NULL,
  cost_kes NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_ref ON notification_logs(reference_code);

-- ----------------------------------------------------------------------------
-- Table 9: site_settings
-- ----------------------------------------------------------------------------
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- SEED INITIAL DATA (With Joshua Mwenda as Super Admin & Official Slogan)
-- ----------------------------------------------------------------------------

INSERT INTO site_settings (setting_key, setting_value) VALUES
('company_name', 'Celiglo Agency Limited'),
('official_slogan', 'DON''T MIX IT, SORT IT, TAKA NI PESA.'),
('primary_email', 'jdfusiontechnologies@gmail.com'),
('admin_email', 'joshuamwenda36@gmail.com'),
('primary_phone', '+254 700 000 000'),
('physical_address', 'Nairobi Operational Hub, Kenya');

-- Seed Users
INSERT INTO users (user_uid, name, email, phone, password_hash, role, status) VALUES
('usr-joshua', 'Joshua Mwenda', 'joshuamwenda36@gmail.com', '+254700000000', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'super_admin', 'active'),
('usr-faith', 'Faith Wanjiku', 'operations@celiglo.co.ke', '+254711223344', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'admin', 'active'),
('usr-peter', 'Peter Otieno', 'dispatch@celiglo.co.ke', '+254722334455', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'staff', 'active');

-- Seed Services
INSERT INTO services (name, slug, category, summary, description, is_active) VALUES
('Residential Waste Collection', 'residential-waste', 'residential', 'Scheduled weekly door-to-door bin collection and segregation for estates and apartments.', 'Consistent, hygienic collection schedules designed for suburban residential neighborhoods and apartment estates.', TRUE),
('Commercial & Office Waste', 'commercial-waste', 'commercial', 'Professional compliance collection and sanitary containment for corporate towers and retail premises.', 'Full-spectrum commercial solid waste logistics with NEMA-compliant manifest documentation.', TRUE),
('Recycling & Waste Sorting', 'recycling-sorting', 'specialized', 'Material recovery, baling, and segregation following our motto: DON''T MIX IT, SORT IT, TAKA NI PESA.', 'Sorting converts waste from an environmental burden into real value. We collect segregated paper, plastics, and scrap metals.', TRUE),
('Construction Debris & Bulky Waste', 'construction-bulky', 'specialized', 'Heavy-duty roll-on haulage for construction rubble, remodeling discards, and bulk wood.', 'Specialized skip bins and flatbed tippers for contractors and facility developers.', TRUE);

-- Seed Service Areas
INSERT INTO service_areas (area_name, county, is_active) VALUES
('Westlands, Parklands & Spring Valley', 'Nairobi', TRUE),
('Kilimani, Kileleshwa & Lavington', 'Nairobi', TRUE),
('Karen, Langata & Ngong Road Corridor', 'Nairobi', TRUE),
('Industrial Area & Enterprise Road', 'Nairobi', TRUE),
('CBD, Upper Hill & Community Area', 'Nairobi', TRUE);

-- Seed Staff
INSERT INTO staff (user_id, full_name, phone, role_designation, vehicle_assigned) VALUES
(3, 'Peter Otieno', '+254722334455', 'Lead Driver / Route Captain', 'Isuzu NPR Truck (KDA 482B)');

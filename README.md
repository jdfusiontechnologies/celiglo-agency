# Celiglo Agency Limited — Waste Management Platform

> **Official Company Slogan:** `"Don't Mix It, Sort It, Taka Ni Pesa."`  
> **Brand Palette:** Green (`#16803C`), Black (`#111111`), White (`#FFFFFF`), Yellow (`#FFD42A`)  
> **Target Market:** Kenya (Households, Commercial Businesses, Institutions, Property Managers)

---

## Table of Contents
1. [Overview & Architecture](#1-overview--architecture)
2. [Local Development with XAMPP](#2-local-development-with-xampp)
3. [MySQL Database Setup & Schema](#3-mysql-database-setup--schema)
4. [Deployment to Free / Shared Hosting](#4-deployment-to-free--shared-hosting)
5. [GitHub Repository Setup](#5-github-repository-setup)
6. [Security & Administration](#6-security--administration)
7. [Database Backup & Restoration](#7-database-backup--restoration)
8. [Company Placeholders Checklist](#8-company-placeholders-checklist)

---

## 1. Overview & Architecture

Celiglo Agency Limited provides corporate waste management, waste collection, recycling, and environmental services in Kenya. The platform consists of:
- **Public Website:** Home, About, Services, Request Collection, Contact, Recycling Education ("Don't Mix It, Sort It, Taka Ni Pesa."), Privacy Policy, and Terms of Service.
- **Collection Request Engine:** Form with Kenyan phone formatting, validation, reference code generation (`CEL-YYYY-XXXX`), and live status tracking (`Pending → Confirmed → Scheduled → Collected → Completed`).
- **Protected Administration Portal:** Operations metrics, request triage, service management, coverage areas configuration, internal staff assignment, and audit logs.
- **Database Engine:** MySQL with 10 relational tables in `database/schema.sql` (InnoDB, utf8mb4, indexed keys).

---

## 2. Local Development with XAMPP

1. **Install XAMPP:**
   - Download XAMPP for Windows/macOS/Linux from [Apache Friends](https://www.apachefriends.org/).
   - Ensure Apache and MySQL components are selected.

2. **Clone / Copy the Project:**
   - Move or clone this repository into your XAMPP web root:
     - Windows: `C:\xampp\htdocs\celiglo-agency\`
     - macOS: `/Applications/XAMPP/xamppfiles/htdocs/celiglo-agency/`
     - Linux: `/opt/lampp/htdocs/celiglo-agency/`

3. **Start Apache & MySQL:**
   - Launch the XAMPP Control Panel.
   - Click **Start** for both Apache and MySQL.

4. **Import Database:**
   - Open your browser and navigate to `http://localhost/phpmyadmin/`.
   - Click **New** in the left sidebar and enter database name: `celiglo_agency`.
   - Collation: `utf8mb4_unicode_ci` -> Click **Create**.
   - With `celiglo_agency` selected, go to the **Import** tab.
   - Choose `database/schema.sql` from this repository.
   - Click **Import** at the bottom.

5. **Configure Database Connection:**
   - Copy `php-source/config/database.example.php` to `php-source/config/database.php`.
   - In XAMPP, default credentials are:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_PORT', '3306');
     define('DB_NAME', 'celiglo_agency');
     define('DB_USER', 'root');
     define('DB_PASS', ''); // empty by default in XAMPP
     ```

6. **Access Application:**
   - Public Website: `http://localhost/celiglo-agency/`
   - Admin Login: `http://localhost/celiglo-agency/admin/login.php`
   - Default administrative login: `admin@celiglo.co.ke`

---

## 3. MySQL Database Setup & Schema

The complete relational schema is located at `database/schema.sql`. It establishes 10 normalized tables:
- `users`: Administrator and dispatch staff accounts with bcrypt password hashes.
- `customers`: Customer profiles with phone indexes.
- `services`: Dynamic service catalogue with active/inactive toggles.
- `collection_requests`: Primary requests table with unique reference codes, statuses, and foreign keys.
- `contact_messages`: Inbound customer inquiries.
- `service_areas`: Coverage zones (Nairobi, Kiambu, Machakos, etc.).
- `staff`: Field crews, drivers, and recovery officers.
- `assignments`: Work orders connecting requests to staff.
- `audit_logs`: Timestamped action tracking for accountability.
- `site_settings`: Editable key-value store for contact information and slogan.

---

## 4. Deployment to Free / Shared Hosting

### Option A: Free PHP + MySQL Hosts (e.g., InfinityFree / 000webhost / Freehostia)
1. Register for an account on the free hosting provider.
2. In the hosting control panel (cPanel / VistaPanel), open **MySQL Databases**.
3. Create a database `celiglo_agency` and create a database user with a strong password.
4. Open **phpMyAdmin** in the hosting control panel and import `database/schema.sql`.
5. Open the **File Manager** or connect via FTP (e.g., FileZilla).
6. Upload the contents of `php-source/` (or the root files) into `htdocs/` or `public_html/`.
7. Edit `config/database.php` with the database hostname, username, and password provided by the host.

### Option B: Cloud Database (Aiven / Neon / Supabase) + PHP Web Service (Render / Railway)
1. Provision a free MySQL database on Aiven or Railway.
2. Run the queries from `database/schema.sql` using a tool like DBeaver or MySQL Workbench.
3. Deploy the PHP repository to Render/Railway web service.
4. Set environment variables for `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASS`.

---

## 5. GitHub Repository Setup

1. Initialize repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Celiglo Agency Limited corporate platform"
   ```
2. Create repository on GitHub: `https://github.com/your-username/celiglo-agency`.
3. Add remote and push:
   ```bash
   git remote add origin https://github.com/your-username/celiglo-agency.git
   git branch -M main
   git push -u origin main
   ```
4. Note: Ensure `config/database.php` containing real database passwords is included in `.gitignore`.

---

## 6. Security & Administration

- **Password Hashing:** Passwords must always use PHP's `password_hash($pwd, PASSWORD_BCRYPT)`.
- **CSRF Tokens:** All form submissions are protected by one-time session tokens.
- **Prepared Statements:** All SQL queries use PDO with bound parameters to eliminate SQL injection.
- **Input Sanitization:** User strings are filtered and HTML escaped (`htmlspecialchars`) before output.
- **Session Protection:** Session cookies are set to `HttpOnly` and `SameSite=Lax`.

---

## 7. Database Backup & Restoration

### Backup (Export):
Run in the terminal on the server or XAMPP command prompt:
```bash
mysqldump -u celiglo_user -p celiglo_agency > celiglo_agency_backup_$(date +%Y%m%d).sql
```

### Restoration (Import):
```bash
mysql -u celiglo_user -p celiglo_agency < celiglo_agency_backup_20261023.sql
```

---

## 8. Company Placeholders Checklist

Before launching to live production, update these confirmed details in the Admin Settings panel:
1. **Primary Phone & WhatsApp:** Replace `+254 700 000 000` with the official operational phone lines.
2. **Physical Office Address:** Replace placeholder with the confirmed registered depot or office in Nairobi.
3. **Confirmed Service Areas:** Review the list of active sub-counties in `admin/service-areas.php` and activate only regions where collection trucks are operational.
4. **Approved Testimonials:** Populate genuine client reviews from confirmed commercial and residential property managers.
5. **Preserved Slogan:** Remember that `"Don't Mix It, Sort It, Taka Ni Pesa."` must remain unaltered.
# celiglo-agency

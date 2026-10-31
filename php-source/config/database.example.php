<?php
/**
 * Celiglo Agency Limited — Database Configuration
 * Copy this file to database.php and configure your MySQL credentials.
 * Slogan: DONT MIX IT, SORT IT, TAKA NI PESA.
 */

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'celiglo_agency');
define('DB_USER', 'celiglo_user');
define('DB_PASS', 'YOUR_STRONG_PASSWORD_HERE');
define('DB_CHARSET', 'utf8mb4');

// Site URL configuration
define('APP_NAME', 'Celiglo Agency Limited');
define('APP_URL', 'http://localhost/celiglo-agency');
define('OFFICIAL_SLOGAN', 'DONT MIX IT, SORT IT, TAKA NI PESA.');

// Establish PDO Connection
function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Safe production error logging without leaking credentials
            error_log("Database connection error: " . $e->getMessage());
            die("Service is momentarily unavailable. Please check back shortly.");
        }
    }
    return $pdo;
}

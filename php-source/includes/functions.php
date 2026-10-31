<?php
/**
 * Celiglo Agency Limited — Shared Helper Functions
 * Slogan: DONT MIX IT, SORT IT, TAKA NI PESA.
 */

require_once __DIR__ . '/../config/database.example.php';

function sanitizeInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function generateReferenceCode($pdo) {
    do {
        $num = mt_rand(1000, 9999);
        $code = 'CEL-' . date('Y') . '-' . $num;
        $stmt = $pdo->prepare("SELECT id FROM collection_requests WHERE reference_code = ? LIMIT 1");
        $stmt->execute([$code]);
    } while ($stmt->fetch());
    return $code;
}

function logAuditAction($pdo, $userId, $action, $entityType, $entityId, $details) {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $stmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $action, $entityType, $entityId, $details, $ip]);
    } catch (Exception $e) {
        error_log("Audit log failure: " . $e->getMessage());
    }
}

function getSiteSettings($pdo) {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
    $settings = [];
    while ($row = $stmt->fetch()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    return $settings;
}

function getActiveServices($pdo) {
    $stmt = $pdo->query("SELECT * FROM services WHERE is_active = 1 ORDER BY id ASC");
    return $stmt->fetchAll();
}

function getActiveServiceAreas($pdo) {
    $stmt = $pdo->query("SELECT * FROM service_areas WHERE is_active = 1 ORDER BY county ASC, area_name ASC");
    return $stmt->fetchAll();
}

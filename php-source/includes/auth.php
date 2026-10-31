<?php
/**
 * Celiglo Agency Limited — Authentication & Session Enforcement
 */

if (session_status() === PHP_SESSION_NONE) {
    // Configure secure session cookie
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        ini_set('session.cookie_secure', 1);
    }
    session_start();
}

function requireAdminAuth() {
    if (empty($_SESSION['admin_user_id']) || empty($_SESSION['admin_user_email'])) {
        header('Location: login.php?msg=session_required');
        exit;
    }
}

function verifyPassword($plainPassword, $hash) {
    return password_verify($plainPassword, $hash);
}

function hashPassword($plainPassword) {
    return password_hash($plainPassword, PASSWORD_BCRYPT, ['cost' => 12]);
}

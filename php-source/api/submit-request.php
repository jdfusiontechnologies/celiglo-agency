<?php
/**
 * Celiglo Agency Limited — Collection Request API Submission Endpoint
 * Official Slogan: "Dont mix iT,sort it,taka ni pesa"
 */

header('Content-Type: application/json');
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

// Read raw JSON or POST formData
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

// Verify CSRF if submitted from web session
if (isset($input['csrf_token']) && !verifyCsrfToken($input['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Invalid or expired security token. Please refresh and try again.']);
    exit;
}

// Validation
$fullName = sanitizeInput($input['full_name'] ?? '');
$phone = sanitizeInput($input['phone'] ?? '');
$email = sanitizeInput($input['email'] ?? '');
$customerType = in_array($input['customer_type'] ?? '', ['residential', 'commercial']) ? $input['customer_type'] : 'residential';
$serviceId = intval($input['service_id'] ?? 0);
$serviceAreaId = !empty($input['service_area_id']) ? intval($input['service_area_id']) : null;
$wasteType = sanitizeInput($input['waste_type'] ?? '');
$collectionAddress = sanitizeInput($input['collection_address'] ?? '');
$preferredDate = sanitizeInput($input['preferred_date'] ?? '');
$estimatedQuantity = sanitizeInput($input['estimated_quantity'] ?? '');
$instructions = sanitizeInput($input['instructions'] ?? '');
$consent = !empty($input['consent']);

$errors = [];
if (strlen($fullName) < 3) $errors[] = "Full name is required (min 3 characters).";
if (empty($phone) || !preg_match('/^[0-9+ ]{9,20}$/', $phone)) $errors[] = "A valid phone number is required (e.g. +254 700 000 000).";
if ($serviceId <= 0) $errors[] = "Please select a requested waste management service.";
if (empty($wasteType)) $errors[] = "Please specify the waste category.";
if (strlen($collectionAddress) < 5) $errors[] = "Please provide an accurate collection address or landmark.";
if (empty($preferredDate)) $errors[] = "Please pick a preferred collection date.";
if (empty($estimatedQuantity)) $errors[] = "Please specify the estimated quantity or load size.";
if (!$consent) $errors[] = "You must agree to the booking and privacy notice.";

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    $pdo = getDbConnection();
    $pdo->beginTransaction();

    // 1. Find or create customer
    $stmt = $pdo->prepare("SELECT id FROM customers WHERE phone = ? LIMIT 1");
    $stmt->execute([$phone]);
    $existing = $stmt->fetch();

    if ($existing) {
        $customerId = $existing['id'];
        $stmt = $pdo->prepare("UPDATE customers SET full_name = ?, email = ?, customer_type = ? WHERE id = ?");
        $stmt->execute([$fullName, $email ?: null, $customerType, $customerId]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO customers (full_name, phone, email, customer_type) VALUES (?, ?, ?, ?)");
        $stmt->execute([$fullName, $phone, $email ?: null, $customerType]);
        $customerId = $pdo->lastInsertId();
    }

    // 2. Generate unique reference code
    $refCode = generateReferenceCode($pdo);

    // 3. Insert collection request
    $stmt = $pdo->prepare("
        INSERT INTO collection_requests 
        (reference_code, customer_id, service_id, service_area_id, waste_type, collection_address, preferred_date, estimated_quantity, instructions, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    ");
    $stmt->execute([
        $refCode,
        $customerId,
        $serviceId,
        $serviceAreaId,
        $wasteType,
        $collectionAddress,
        $preferredDate,
        $estimatedQuantity,
        $instructions
    ]);

    // 4. Record audit log
    logAuditAction(
        $pdo,
        null,
        'NEW_COLLECTION_REQUEST',
        'COLLECTION_REQUEST',
        $refCode,
        "Request logged for {$fullName} ({$phone}) - Waste: {$wasteType}"
    );

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'reference_code' => $refCode,
        'message' => 'Request successfully submitted. Please note: Submitting a request is not a confirmed booking until authorized Celiglo Agency staff approve and schedule it.'
    ]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Failed to submit request: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'An internal database error occurred. Your request was not saved.']);
}

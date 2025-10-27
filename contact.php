<?php
/**
 * GAEVENTS Contact Form Handler
 * Hardened with validation, sanitization, honeypot, and security headers
 * 
 * Configuration
 */
define('TO_EMAIL', 'info@gaeventsprod.com');
define('COMPANY', 'GAEVENTS PRODUCTION LLC');
define('HONEYPOT_FIELD', 'website'); // Honeypot field name
define('TOKEN_LENGTH', 32);

/**
 * Security Headers
 */
function setSecurityHeaders() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}

/**
 * Validate Email Address
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Sanitize String Input
 */
function sanitizeInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    
    // Prevent header injection
    $dangerous = ["\r", "\n", "%0a", "%0d", "Content-Type:", "bcc:", "cc:"];
    $input = str_replace($dangerous, '', $input);
    
    return $input;
}

/**
 * Validate and Clean Phone Number
 */
function sanitizePhone($phone) {
    $phone = preg_replace('/[^0-9\-\+\s\(\)]/', '', $phone);
    return sanitizeInput($phone);
}

/**
 * Check Honeypot
 */
function checkHoneypot($data) {
    return empty($data[HONEYPOT_FIELD]) || $data[HONEYPOT_FIELD] === '';
}

/**
 * Validate Required Fields
 */
function validateRequired($data) {
    $required = ['name', 'email', 'message'];
    $errors = [];
    
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $errors[] = ucfirst($field) . ' is required.';
        }
    }
    
    return $errors;
}

/**
 * Validate Email Format
 */
function validateEmail($email) {
    if (!isValidEmail($email)) {
        return 'Invalid email format.';
    }
    return null;
}

/**
 * Prepare Email
 */
function prepareEmail($data) {
    $name = sanitizeInput($data['name'] ?? '');
    $company = sanitizeInput($data['company'] ?? '');
    $email = sanitizeInput($data['email'] ?? '');
    $phone = sanitizePhone($data['phone'] ?? '');
    $eventType = sanitizeInput($data['event_type'] ?? '');
    $budget = sanitizeInput($data['budget'] ?? '');
    $message = sanitizeInput($data['message'] ?? '');
    
    $subject = "New Contact Form Submission from " . $name;
    
    $body = "Contact Form Submission\n";
    $body .= "========================\n\n";
    $body .= "Name: " . $name . "\n";
    $body .= "Company: " . $company . "\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Phone: " . $phone . "\n";
    $body .= "Event Type: " . $eventType . "\n";
    $body .= "Budget: " . $budget . "\n\n";
    $body .= "Message:\n" . $message . "\n";
    
    $headers = "From: " . $name . " <" . $email . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    return [
        'to' => TO_EMAIL,
        'subject' => $subject,
        'body' => $body,
        'headers' => $headers
    ];
}

/**
 * Main Handler
 */
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    setSecurityHeaders();
    
    $errors = [];
    
    // Check honeypot
    if (!checkHoneypot($_POST)) {
        header('Location: contact.html?error=invalid');
        exit;
    }
    
    // Validate required fields
    $errors = array_merge($errors, validateRequired($_POST));
    
    // Validate email
    if (!empty($_POST['email'])) {
        $emailError = validateEmail($_POST['email']);
        if ($emailError) {
            $errors[] = $emailError;
        }
    }
    
    // Check for potential spam
    $message = $_POST['message'] ?? '';
    $suspiciousPatterns = [
        '/http[s]?:\/\//i',  // Multiple URLs
        '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i',  // Multiple emails
    ];
    
    $urlCount = preg_match_all('/http[s]?:\/\//i', $message);
    $emailCount = preg_match_all('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i', $message);
    
    if ($urlCount > 2 || $emailCount > 2) {
        $errors[] = 'Message contains suspicious content.';
    }
    
    if (!empty($errors)) {
        header('Location: contact.html?error=validation');
        exit;
    }
    
    // Prepare email
    $emailData = prepareEmail($_POST);
    
    // Send email
    $success = mail(
        $emailData['to'],
        $emailData['subject'],
        $emailData['body'],
        $emailData['headers']
    );
    
    if ($success) {
        // Redirect to thank you page
        header('Location: thank-you.html');
        exit;
    } else {
        // Error sending email
        header('Location: contact.html?error=server');
        exit;
    }
} else {
    // Invalid request method
    setSecurityHeaders();
    header('Location: contact.html?error=invalid');
    exit;
}
?>

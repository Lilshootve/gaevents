<?php
// Simple email handler for contact form submissions.
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Change this to your desired destination email address
    $to      = "info@gaeventsprod.com";
    $subject = "New Contact Form Submission";

    // Collect and sanitize form fields
    $name     = strip_tags($_POST['name'] ?? '');
    $company  = strip_tags($_POST['company'] ?? '');
    $email    = strip_tags($_POST['email'] ?? '');
    $phone    = strip_tags($_POST['phone'] ?? '');
    $event    = strip_tags($_POST['event_type'] ?? '');
    $budget   = strip_tags($_POST['budget'] ?? '');
    $message  = strip_tags($_POST['message'] ?? '');

    $body = "Name: $name\n";
    $body .= "Company: $company\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phone\n";
    $body .= "Event Type: $event\n";
    $body .= "Budget: $budget\n\n";
    $body .= "Message:\n$message\n";

    $headers = "From: "$name" <".$email.">\r\n";
    $headers .= "Reply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        // Redirect to thank-you page on success
        header('Location: thank-you.html');
        exit;
    } else {
        echo "There was a problem sending your message. Please try again later.";
    }
} else {
    echo "Invalid request.";
}
?>

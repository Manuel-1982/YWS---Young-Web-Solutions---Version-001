<?php
/**
 * Young Web Solutions (YWS) — Direktes E-Mail-Versandskript für Webhosting (IONOS, ALL-INKL, Strato, Hetzner etc.)
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Nur POST-Anfragen erlaubt.']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!is_array($data)) {
    $data = $_POST;
}

$name    = trim(strip_tags($data['name'] ?? ''));
$email   = trim(strip_tags($data['email'] ?? ''));
$package = trim(strip_tags($data['package'] ?? 'Keine Auswahl'));
$website = trim(strip_tags($data['website'] ?? 'Keine Angabe'));
$message = trim(strip_tags($data['message'] ?? 'Keine Nachricht'));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Bitte Name und gültige E-Mail-Adresse angeben.']);
    exit;
}

$recipient = 'manuel.jung@online.de';
$subject   = '=?UTF-8?B?' . base64_encode("Neue Website-Anfrage ($package) von $name") . '?=';

$body = "Neue Projektanfrage über Young Web Solutions:\r\n"
      . "--------------------------------------------\r\n"
      . "Name: $name\r\n"
      . "E-Mail: $email\r\n"
      . "Gewünschtes Paket: $package\r\n"
      . "Aktuelle Website: $website\r\n\r\n"
      . "Nachricht:\r\n"
      . "$message\r\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Young Web Solutions <' . $recipient . '>',
    'Reply-To: ' . $email
];

$sent = @mail($recipient, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server-Mailversand nicht verfügbar.']);
}


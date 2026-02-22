<?php
// checkout.php
header('Content-Type: application/json');

// 1. Konfigurasi (Ganti dengan Key Anda)
$midtransServerKey = "YOUR_MIDTRANS_SERVER_KEY";
$hostingerApiToken = "YOUR_HOSTINGER_API_TOKEN";

$input = json_decode(file_get_contents('php://input'), true);
$plan = $input['plan'];

// Logic sederhana penentuan harga
$price = 25000;
$orderId = "HOSTING-" . time();

// 2. Kirim ke Midtrans untuk dapatkan Snap Token
$auth = base64_encode($midtransServerKey . ":");
$payload = [
    'transaction_details' => [
        'order_id' => $orderId,
        'gross_amount' => $price,
    ],
    'customer_details' => [
        'first_name' => "User",
        'email' => "user@example.com"
    ]
];

$ch = curl_init("https://app.sandbox.midtrans.com/snap/v1/transactions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Basic $auth", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
$data = json_decode($response, true);

// 3. (Opsional) Logic Create Panel Hostinger 
// Biasanya diletakkan di file webhook_handler.php setelah pembayaran sukses dikonfirmasi Midtrans
/*
    $ch_hostinger = curl_init("https://api.hostinger.com/v1/billing/orders");
    curl_setopt($ch_hostinger, CURLOPT_HTTPHEADER, ["Authorization: Bearer $hostingerApiToken"]);
    // ... logic pembuatan panel otomatis ...
*/

echo json_encode(['snap_token' => $data['token']]);
?>

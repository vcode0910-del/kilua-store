<?php
include 'config.php';
if(!isset($_SESSION['user'])) { echo "<script>alert('Login Dulu!'); window.location='login.php';</script>"; exit(); }

$id = $_POST['id'];
$user = $_SESSION['user'];

$res = mysqli_query($conn, "SELECT * FROM products WHERE id='$id'");
$p = mysqli_fetch_assoc($res);

// 1. Catat Transaksi
$p_name = $p['name']; $p_price = $p['price'];
mysqli_query($conn, "INSERT INTO orders (order_id, username, product_name, amount) VALUES ('INV-".time()."', '$user', '$p_name', '$p_price')");

// 2. Tembak API Pterodactyl
$payload = [
    "name" => "Server-" . $user,
    "user" => 1,
    "egg" => (int)$p['egg_id'],
    "docker_image" => "ghcr.io/pterodactyl/yolks:java_17",
    "startup" => "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
    "limits" => ["memory" => (int)$p['ram'], "swap" => 0, "disk" => (int)$p['disk'], "io" => 500, "cpu" => (int)$p['cpu']],
    "feature_limits" => ["databases" => 1, "allocations" => 1, "backups" => 1],
    "deploy" => ["locations" => [(int)$p['location_id']], "dedicated_ip" => false, "port_range" => []]
];

$ch = curl_init($ptero_url . "/api/application/servers");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $ptero_api", "Content-Type: application/json", "Accept: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
curl_close($ch);

echo "<script>alert('Pembayaran Berhasil & Server Dibuat!'); window.location='index.php';</script>";
?>

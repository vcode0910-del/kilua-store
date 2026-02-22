<?php 
include 'config.php';
if($_SESSION['role'] != 'admin') { header("Location: index.php"); exit(); }

if(isset($_POST['add_product'])) {
    $n = $_POST['n']; $p = $_POST['p']; $c = $_POST['c']; 
    $r = $_POST['r']; $d = $_POST['d']; $e = $_POST['e']; $l = $_POST['l'];
    mysqli_query($conn, "INSERT INTO products VALUES (NULL, '$n', '$p', '$c', '$r', '$d', '$e', '$l')");
}
?>
<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
    <div class="container">
        <h2>Admin Dashboard - Killua Store</h2>
        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:30px; margin-top:30px;">
            <div class="card">
                <h3>Tambah Produk</h3>
                <form method="POST">
                    <input type="text" name="n" placeholder="Nama Produk" required>
                    <input type="number" name="p" placeholder="Harga">
                    <input type="number" name="c" placeholder="CPU %">
                    <input type="number" name="r" placeholder="RAM MB">
                    <input type="number" name="d" placeholder="Disk MB">
                    <input type="number" name="e" placeholder="Egg ID">
                    <input type="number" name="l" placeholder="Location ID">
                    <button type="submit" name="add_product" class="btn-buy">Simpan ke phpMyAdmin</button>
                </form>
            </div>
            <div>
                <h3>Riwayat Transaksi</h3>
                <table>
                    <tr><th>User</th><th>Produk</th><th>Status</th><th>Waktu</th></tr>
                    <?php
                    $orders = mysqli_query($conn, "SELECT * FROM orders ORDER BY id DESC");
                    while($o = mysqli_fetch_assoc($orders)) echo "<tr><td>{$o['username']}</td><td>{$o['product_name']}</td><td><span style='color:#00ff00'>{$o['status']}</span></td><td>{$o['created_at']}</td></tr>";
                    ?>
                </table>
            </div>
        </div>
    </div>
</body>
</html>

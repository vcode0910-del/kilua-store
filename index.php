<?php include 'config.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <title>Killua Store</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="logo">Killua <span>Store</span></div>
        <div class="nav-links">
            <a href="index.php">Home</a>
            <?php if(!isset($_SESSION['user'])): ?>
                <a href="login.php">Login</a>
                <a href="register.php" style="background:var(--primary); padding:8px 15px; border-radius:5px;">Daftar</a>
            <?php else: ?>
                <?php if($_SESSION['role'] == 'admin') echo '<a href="admin.php">Admin Panel</a>'; ?>
                <a href="logout.php">Logout (<?= $_SESSION['user'] ?>)</a>
            <?php endif; ?>
        </div>
    </nav>

    <div class="hero" data-aos="zoom-in">
        <h1>Killua Store</h1>
        <p>Pterodactyl Panel & Cloud Hosting Otomatis</p>
    </div>

    <div class="container">
        <div class="grid-products">
            <?php
            $res = mysqli_query($conn, "SELECT * FROM products");
            while($p = mysqli_fetch_assoc($res)):
            ?>
            <div class="card" data-aos="fade-up">
                <h3><?= $p['name'] ?></h3>
                <h2 style="color:var(--primary); margin: 15px 0;">Rp <?= number_format($p['price']) ?></h2>
                <p>CPU: <?= $p['cpu'] ?>% | RAM: <?= $p['ram'] ?>MB | Disk: <?= $p['disk'] ?>MB</p>
                <form action="order.php" method="POST">
                    <input type="hidden" name="id" value="<?= $p['id'] ?>">
                    <button type="submit" class="btn-buy">Beli Sekarang</button>
                </form>
            </div>
            <?php endwhile; ?>
        </div>
    </div>

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>AOS.init();</script>
</body>
</html>

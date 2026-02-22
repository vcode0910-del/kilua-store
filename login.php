<?php include 'config.php';
if(isset($_POST['login'])) {
    $u = $_POST['u']; $p = $_POST['p'];
    $res = mysqli_query($conn, "SELECT * FROM users WHERE username='$u'");
    $user = mysqli_fetch_assoc($res);
    if($user && password_verify($p, $user['password'])) {
        $_SESSION['user'] = $u; $_SESSION['role'] = $user['role'];
        header("Location: index.php");
    } else { echo "<script>alert('Gagal!');</script>"; }
}
?>
<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
    <div class="form-box">
        <h2>Login Killua</h2>
        <form method="POST">
            <input type="text" name="u" placeholder="Username" required>
            <input type="password" name="p" placeholder="Password" required>
            <button type="submit" name="login" class="btn-buy">Masuk</button>
        </form>
    </div>
</body>
</html>

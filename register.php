<?php include 'config.php';
if(isset($_POST['reg'])) {
    $u = $_POST['u']; $p = password_hash($_POST['p'], PASSWORD_DEFAULT);
    $r = $_POST['r'];
    mysqli_query($conn, "INSERT INTO users (username, password, role) VALUES ('$u', '$p', '$r')");
    header("Location: login.php");
}
?>
<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
    <div class="form-box">
        <h2>Daftar Akun</h2>
        <form method="POST">
            <input type="text" name="u" placeholder="Username" required>
            <input type="password" name="p" placeholder="Password" required>
            <select name="r">
                <option value="user">User</option>
                <option value="reseller">Reseller</option>
            </select>
            <button type="submit" name="reg" class="btn-buy">Daftar</button>
        </form>
    </div>
</body>
</html>

<?php
session_start();
//if user is already logged in he should not be able to stay on login page
if(isset($_SESSION['username'])){
    header("Location: dashboard");
    exit();
}
$error_messsage = '';

if(isset($_SESSION['error_message'])){
    $error_messsage = $_SESSION['error_message'];
}

?>
<!DOCTYPE html>
<html>
<meta charset="UTF-8">
<link rel="stylesheet" href="index_style.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">

<head>
    <title>Pagina de autentificare</title>
</head>

<body>
    <div class="login-form"> 
        <form method="post" action="login_check.php">
            <div style="text-align: center;padding-top:20px;padding-bottom:30px;font-weight: 500;font-size:25px;font-family: 'Roboto', sans-serif;">
                Login
            </div>
            <div style="padding-bottom: 10px;">
                <span class="error"><?php echo $error_messsage ?></span>
            </div>
            <div style="display: grid;columns: 1; row-gap: 13px; padding-bottom:10px">
                <div>
                    <input type="text" class="login_input" name="username" placeholder="Username">
                </div>
                <div>
                    <input type="password" class="login_input" name ="password" placeholder="Password" required>
                </div>

            </div>
            <div class="buttons">
                <button class="button" onclick>Login</button>
                <a href="/register" class="button">Sign Up</a>
            </div>
        </form>
    </div>
</body>

<?php

if(isset($_SESSION['error_message'])){
    unset($_SESSION['error_message']);
}
?>
</html>
<?php
session_start();

$error_messsage = '';

if(isset($_SESSION['error_message'])){
    $error_messsage = $_SESSION['error_message'];
}

?>


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
        <form method="post" action="register_check.php">
            <div style="text-align: center;padding-top:20px;padding-bottom:30px;font-weight: 500;font-size:25px;font-family: 'Roboto', sans-serif;">
                Register
            </div>
            <div style="padding-bottom: 10px;">
                <span class="error"><?php echo $error_messsage ?></span>
            </div>
            <div style="display: grid;columns: 1; row-gap: 13px;">
                <div>
                    <input type="text" name="username" class="login_input" placeholder="Username">
                </div>
                <div>
                    <input type="email" name="email" class="login_input" placeholder="Email">
                </div>
                <div>
                    <input type="password" name="password" class="login_input" placeholder="Password" required>
                </div>
                <div>
                    <input type="password" name="conf_password" class="login_input" placeholder="Confirm Password" required>
                </div>
            </div>
            <div class="buttons">
                <button class="button">Sign Up</button>
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
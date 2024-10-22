<?php
//if user is already logged in he should not be able to stay on login page
if(isset($_SESSION)){
    header("Location: dashboard.html");
    exit();
}

?>
<!DOCTYPE html>
<html>
<meta charset="UTF-8">
<link rel="stylesheet" href="index_style.css">

<head>
    <title>Pagina de autentificare</title>
</head>

<body>
    <div class="login-form">
        <form method="post" action="login_check.php">
            <div style="display: grid;columns: 1; row-gap: 10px;">
                <div style="display: grid; columns: 1;">
                    <label>Username</label>
                    <input type="text" class="login_input" id="loginname" placeholder="Enter your username">
                </div>
                <div style="display: grid; columns: 1;">
                    <label>Password</label>
                    <input type="password" class="login_input" placeholder="Enter your password" required>
                </div>

            </div>
            <div>
                <button class="button" onclick>Login</button>
                <a href="register.html" class="button">Sign Up</a>
            </div>
        </form>
    </div>
</body>


</html>
<?php
session_start();

if(empty($_SESSION['username'])){
    header("Location: login");
    exit();
}


?>


<!DOCTYPE html>
<html lang="en">
<link rel="stylesheet" href="dashboard_style.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
</head>
<body>
    
        <div class="header">
            <div class="api-key">

              <span>API Key: <?php echo $_SESSION['APIKEY']; ?></span>
            </div>
            <div style="flex: 3;text-align: center;">
                This is your Dashboard
            </div>
            <div class="logout-button">
               <a href="logout.php" class="logout-button">Log out</button>
            </div>
        </div>
    
</body>
</html>
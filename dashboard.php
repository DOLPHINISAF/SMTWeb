<?php
session_start();

if(empty($_SESSION['username'])){
    header("Location: login");
    exit();
}

$ApiKey = '';

if(isset($_SESSION['APIKEY'])){
    $ApiKey = $_SESSION['APIKEY'];
}
?>
<script>
    const API_KEY = <?php echo json_encode($ApiKey); ?>;
</script>

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
              <span>API Key: <?php echo $ApiKey; ?></span>
            </div>
            <div class="dashboard-title">
                Dashboard
            </div>
            <div class="logout">
               <a href="logout.php" class="logout-button">Log out</a>
            </div>
        </div>
        
        <div class="interact-panel">
            <div class="option-panel">
                <div class="option-buttons" id="monitor-button" onclick="GetMonitorData(this)">
                    Monitor
                </div>
                <div class="option-buttons"  id="action-button" onclick="GetActions(this)">
                    Actions
                </div>
            </div>
               
            <div class="data-panel">
                <table id="live-data-table">
                    <thead class="table-rows">
                        <th class="name-column">Name</th>
                        <th class="description-column">Description</th>
                        <th class="value-column">Value</th>
                        <th class="unit-column">Unit</th>
                    </thead>

                    <tbody id="live-data-table-body">
                    </tbody>
                    
                </table>
                <table id="action-table">
                    <thead class="table-rows">
                        <th class="name-column">Name</th>
                        <th class="description-column">Description</th>
                        <th class="action-button-column">Activate</th>
                    </thead>

                    <tbody id="action-table-body">
                    </tbody>

                    
                </table>
            </div>
        </div>

        <script src="script.js">
            
        </script>
             
</body>
</html>
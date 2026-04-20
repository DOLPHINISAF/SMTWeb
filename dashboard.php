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

            <div id="api-key-div" class="api-key-div-style">
                <span class="api-key">Your API Key: <span id="api-key-text">************************************************</span></span>
                <button onclick="toggleApiKey()" class="api-btn">👁️</button>
                <button onclick="copyApiKey()" class="api-btn">📋</button>
            </div>
            <div class="dashboard-title">
                Dashboard
            </div>
            <div class="logout">
               <a href="logout.php" class="logout-button">Log out</a>
            </div>
            
            <div id="toast" class="toast"></div>
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
                        <th class="edit-column">Edit</th>
                    </thead>

                    <tbody id="live-data-table-body">
                        <tr id="dataInsertRow" class="table-rows">
                            <td class="name-column"><input id ="parameter-name-input" placeholder="Name" class = "placeholder"></td>
                            <td class="description-column"><input id ="parameter-description-input" placeholder="Description" class = "placeholder"></td>
                            <td class="value-column"></td>
                            <td class="unit-column"><input id ="parameter-unit-input" placeholder="Unit" class = "placeholder"></td>
                            <td class="edit-column"><button class = "action-run-button"onclick="SaveUserItem('parameter')">Add parameter</button></td>
                        </tr>
                    </tbody>
                    
                </table>
                <table id="action-table">
                    <thead class="table-rows">
                        <th class="name-column">Name</th>
                        <th class="description-column">Description</th>
                        <th class="action-status-column">Status</th>
                        <th class="action-button-column">Activate</th>
                        <th class="edit-column">Edit</th>
                    </thead>

                    <tbody id="action-table-body">
                        <tr id="actionInsertRow" class="table-rows">
                            <td class="name-column"><input id ="action-name-input" placeholder="Action Name" class = "placeholder"></td>
                            <td class="description-column"><input id ="action-description-input" placeholder="Description" class = "placeholder"></td>
                            <td class="action-status-column"></td>
                            <td class="action-button-column"></td>
                            <td class="edit-column"><button class = "action-run-button"  onclick="SaveUserItem('action')">Add action</button></td>
                        </tr>
                    </tbody>

                    
                </table>
            </div>
        </div>

        <script src="script.js"></script>
</body>
</html>
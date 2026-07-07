<?php
session_start();

if(empty($_SESSION['username'])){
    header("Location: login");
    exit();
}


if(isset($_SESSION['USER_ID'])){
    $user_id = $_SESSION['USER_ID'];
    $server_name = "localhost";
    $db_username = "webscript";
    $db_password = "webscriptroot1";
    $db_name = "servermonitortool";
    $conn = new mysqli($server_name, $db_username, $db_password, $db_name);

    if ($conn->connect_error) {
        die("DB connection failed");
    }

    $sql_message = $conn->prepare("SELECT api_key FROM users WHERE id = ?");
    $sql_message->bind_param("i", $user_id);

    $sql_message->execute();

    $result = $sql_message->get_result();
    
    $row = mysqli_fetch_assoc($result);
    $ApiKey = $row['api_key'] ?? '';
}



?>
<script>
    let API_KEY = <?php echo json_encode($ApiKey); ?>;

</script>

<!DOCTYPE html>
<html lang="en">
<link rel="stylesheet" href="css/dashboard_style.css">
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

                <span class="api-key">Key: <span id="api-key-text" onclick="copyApiKey()">************************************************</span></span>
                
                <div class="api-buttons">
                    <button title="Toggle Visibility" onclick="toggleApiKey()" class="api-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg>
                    </button>

                    <button title="Copy to clipboard" onclick="copyApiKey()" class="api-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                        </svg>
                    </button>

                    <button title="Generate New Key" onclick="GenerateNewApiKey()" class="api-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                            <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                        </svg>
                </button>
                </div>
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

        <script src="js/script.js"></script>
        <script src="js/UI.js"></script>
</body>
</html>
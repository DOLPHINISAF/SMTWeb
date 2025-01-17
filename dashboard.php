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
               
            <div>
                <table id="live-data-table">
                    <tr class="table-rows">
                        <th>Name</th>
                        <th>Description</th>
                        <th>Value</th>
                        <th>Status</th>
                    </tr>

                    
                </table>
                <table id="action-table">
                    <tr class="table-rows">
                        <th>Name</th>
                        <th>Description</th>
                        <th><button>
                        </button></th>
                    </tr>

                    
                </table>
            </div>
        </div>

        <script>

                UNSELECTED_BGCOLOR = "red";
                SELECTED_BGCOLOR = "white"
                function GetMonitorData(elem){
                    document.getElementById("action-button").style.backgroundColor = UNSELECTED_BGCOLOR;
                    elem.style.backgroundColor  = SELECTED_BGCOLOR;
                    document.getElementById("live-data-table").style.display = "block";
                    document.getElementById("action-table").style.display = "none";
                    
                }
                function GetActions(elem){
                    document.getElementById("monitor-button").style.backgroundColor = UNSELECTED_BGCOLOR;
                    elem.style.backgroundColor  = SELECTED_BGCOLOR;
                    document.getElementById("live-data-table").style.display = "none";
                    document.getElementById("action-table").style.display = "block";
                    
                }

                //we call it to default the selection
                GetMonitorData(document.getElementById("monitor-button"));
                

                const ws = new WebSocket('ws://localhost:1337');

                ws.addEventListener("open", () =>{
                    APIKEY = `<?php echo $ApiKey ?>`;
                    authdata = `{
                                    "type":"auth",
                                    "APIKey": "${APIKEY}"
                                }`;
                    ws.send(authdata);
                })
                ws.addEventListener("message", (message)=>{
                    msgjson = JSON.parse(message.data);

                    if(msgjson.type){
                        if(msgjson.type === "data"){
                            dataID = msgjson.dataID;
                            dataElement = document.getElementById(`.${dataID}`);

                            document.getElementById(`${dataID}-value`).innerHTML = msgjson.value;
                            if(msgjson.status){
                                document.getElementById(`${dataID}-status`).innerHTML = msgjson.status;
                            }
                        }
                        else if(msgjson.type === "add"){

                            let dataID = msgjson.dataID;
                            let description = msgjson.description;
                            let status = "OK";
                            let value = "NULL";

                            document.getElementById("live-data-table").innerHTML=
                                `<tr id="${dataID}" class="table-rows">
                                    <th>${dataID}</th>
                                    <th>${description}</th>
                                    <th id = "${dataID}-value">${value}</th>
                                    <th id = "${dataID}-status">${status}</th>
                                </tr>`;
                        
                        }
                        
                   }
                });


            </script>
             
</body>
</html>
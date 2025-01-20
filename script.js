
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


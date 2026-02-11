
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

function ActivateAction(action_name){

    msgjson = {
        type:"action",
        actionID:action_name
    }

    ws.send(JSON.stringify(msgjson));
}

//we call it to default the selection
GetMonitorData(document.getElementById("monitor-button"));


const ws = new WebSocket('ws://localhost:1337');

//used to announce server that user is online and can receive data
ws.addEventListener("open", () =>{
    //we get the api key
    APIKEY = `<?php echo $ApiKey ?>`;

    //we make the string json with needed data
        authdata = {
        type:"auth",
        APIKey:APIKEY,
        source:"client"
    }
    ws.send(JSON.stringify(authdata));
})

ws.addEventListener("message", (message)=>{
    msgjson = JSON.parse(message.data);

    if(msgjson.type){
        if(msgjson.type === "data"){
            nameID = msgjson.nameID;
            dataElement = document.getElementById(`.${nameID}`);

            document.getElementById(`${nameID}-value`).innerHTML = msgjson.value;
        }
        else if(msgjson.type === "add"){

            let nameID = msgjson.nameID;
            let description = msgjson.description;
            let unit = msgjson.unit;
            let value = "NULL";

            document.getElementById("live-data-table").innerHTML=
                `<tr id="${nameID}" class="table-rows">
                    <th>${nameID}</th>
                    <th>${description}</th>
                    <th id = "${nameID}-value">${value}</th>
                    <th>${unit}</th>
                </tr>`;
        
        }
        
    }
});


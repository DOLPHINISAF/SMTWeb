
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

function ActivateAction(actionID){

    msgjson = {
        type:"run_action",
        actionID:actionID,
        APIKey: API_KEY
    }

    try{
    ws.send(JSON.stringify(msgjson));
        console.log(`Sent ActivateAction to server, action: ${actionID}`)
    }
    catch (error) {
        console.log(`Failed to use websocket to send json.\nError: ${error}`)
    }
    
}

//we call it to default the selection
GetMonitorData(document.getElementById("monitor-button"));

//websocket path to backend server
const ws = new WebSocket('ws://dolphinsibiu.ddns.net:1337');

//used to announce server that user is online and can receive data
ws.addEventListener("open", () =>{
    console.log(API_KEY)
    //we make the string json with needed data
        authdata = {
        type:"auth",
        APIKey:API_KEY,
        source:"client"
    }
    ws.send(JSON.stringify(authdata));

    console.log("Connected websocket to backend server.")
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


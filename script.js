
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
    console.log("Received Json")
    if(msgjson.type){
        if(msgjson.type === "data"){
            //if the live data row doesn't exist we just add it to the table
            if(typeof nameID == "undefined"){
                AddLiveDataRow(msgjson)
            }
            nameID = msgjson.nameID;
            dataElement = document.getElementById(`.${nameID}`);

            document.getElementById(`${nameID}-value`).innerHTML = msgjson.value;
        }
        else if(msgjson.type === "add"){
            AddLiveDataRow(msgjson)
        }

    }
});

function AddLiveDataRow(msgjson){
            let nameID = msgjson.nameID;
            let description = msgjson.description;
            let unit = msgjson.unit;
            let value = "NULL";

    document.getElementById("live-data-table-body").innerHTML +=
                `<tr id="${nameID}" class="table-rows">
            <th class="name-column">${nameID}</th>
            <th class="description-column">${description}</th>
            <th id = "${nameID}-value" class="value-column">${value}</th>
            <th class="unit-column">${unit}</th>
        </tr>`;
}
function AddActionRow(msgjson){
    let actionID = msgjson.actionID
    let actionDescription = msgjson.actionDescription

    document.getElementById("action-table-body").innerHTML +=
        `<tr id="${actionID}" class="table-rows">
            <th class="name-column">${actionID}</th>
            <th class="description-column">${actionDescription}</th>
            <th class="action-button-column"><button onclick="ActivateAction('${actionID}')">Run</button></th>
                </tr>`;
}

function AddAction(actionName, actionDescription = "Uninitialised Description"){
    actionjson = {
        actionID: actionName,
        actionDescription, actionDescription
    }

    AddActionRow(actionjson)
}
function AddExample(){
    examplejson = {}

    //We add a test live data with all the parameters filled in

    examplejson = {
        nameID: 'Test_Name',
        description: "Test_Description",
        unit: 'Test_Unit',
        value: "NULL"
    }
    AddLiveDataRow(examplejson);


    //we add a test action with needed parameters

    examplejson = {
        actionID: 'Test_Action_Name',
        actionDescription: 'Test_Action_Description',
    }

    AddActionRow(examplejson);

}

AddExample()
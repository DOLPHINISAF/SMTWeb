
UNSELECTED_BGCOLOR = "#28b498";
SELECTED_BGCOLOR = "#F2F2F2"

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

let visible = false;

function toggleApiKey() {
    const el = document.getElementById("api-key-text");

    if (visible) {
        el.innerHTML = "****************************************";
    } else {
        el.innerHTML = API_KEY;
    }

    visible = !visible;
}
function copyApiKey() {
    const el = document.getElementById("api-key-text");

    navigator.clipboard.writeText(API_KEY);

    // Optional feedback
    showToast("API key copied!")
}
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
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
//GetActions(document.getElementById("action-button"));
GetMonitorData(document.getElementById("monitor-button"));
//GetActions(document.getElementById("action-button"));

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

    GetUserConfig();

    GetUserConfig();
})

ws.addEventListener("message", (message)=>{
    console.log("Received Json")
    
    msgjson = JSON.parse(message.data);
    console.log(msgjson)
    if(msgjson.type){
        if(msgjson.type === "data"){
            
            
            //if the live data row doesn't exist we just add it to the table
            if(document.getElementById(`${msgjson.nameID}-value`) === null){
                AddLiveDataRow(msgjson)
            }
            
            nameID = msgjson.nameID;
            dataElement = document.getElementById(`.${nameID}`);

            document.getElementById(`${nameID}-value`).innerHTML = msgjson.data;
        }
        else if(msgjson.type === "add"){
            AddLiveDataRow(msgjson)
        }
        else if(msgjson.type === "user-config"){

            console.log(msgjson)
            if(msgjson.parameters.length > 0){

                msgjson.parameters.forEach(parameter => {
                    AddLiveDataRow(parameter);
                });
            }
            if(msgjson.actions.length > 0){

                msgjson.actions.forEach(action => {
                    AddActionRow(action);
                });
            }
        }
        else if(msgjson.type === "user-config"){

            console.log(msgjson)
            if(msgjson.parameters.length > 0){

                msgjson.parameters.forEach(parameter => {
                    AddLiveDataRow(parameter);
                });
            }
            if(msgjson.actions.length > 0){

                msgjson.actions.forEach(action => {
                    AddActionRow(action);
                });
            }
        }
        
    }
});

function UpdateLiveDataRow(msgjson){
    //if the live data row doesn't exist we just add it to the table
    if(document.getElementById(`${msgjson.nameID}-value`) === null){
            AddLiveDataRow(msgjson)
    }
            
    nameID = msgjson.nameID;
    dataElement = document.getElementById(`.${nameID}`);

    document.getElementById(`${nameID}-value`).innerHTML = msgjson.data;
}

function AddLiveDataRow(msgjson){
    //if the parameter already exists we dont add it lol
    if(document.getElementById(`${msgjson.nameID}-value`)){
        return;
    }


    let nameID = msgjson.nameID;
    let description = msgjson.description;
    let unit = msgjson.unit;
    let value = "0";

    const tbody = document.getElementById("live-data-table-body");
    const bottomRow = document.getElementById("dataInsertRow");
    

    const rowData = document.createElement("tr");
    rowData.className = "table-rows"
    rowData.id = nameID;
    rowData.innerHTML = 
        `
            <td id="${nameID}"class="name-column">${nameID}</td>
            <td class="description-column">${description}</td>
            <td id="${nameID}-value" class="value-column">${value}</td>
            <td class="unit-column">${unit}</td>
            <td class="edit-column"><button class="remove-button" onclick="DeleteItem('${nameID}', 'parameter')">Delete</button></td>
        `;
        //we add id to value so we can modify it when data arrives
        //we add id to name so we can check if already exists

    tbody.insertBefore(rowData,bottomRow);
}

    const tbody = document.getElementById("live-data-table-body");
    const bottomRow = document.getElementById("dataInsertRow");
    

    const rowData = document.createElement("tr");
    rowData.className = "table-rows"
    rowData.id = nameID;
    rowData.innerHTML = 
        `
            <td id="${nameID}"class="name-column">${nameID}</td>
            <td class="description-column">${description}</td>
            <td id="${nameID}-value" class="value-column">${value}</td>
            <td class="unit-column">${unit}</td>
            <td class="edit-column"><button class="remove-button" onclick="DeleteItem('${nameID}', 'parameter')">Delete</button></td>
        `;
        //we add id to value so we can modify it when data arrives
        //we add id to name so we can check if already exists

    tbody.insertBefore(rowData,bottomRow);
}

function AddActionRow(msgjson){
    let actionID = msgjson.actionID
    let actionDescription = msgjson.actiondescription
    let actionDescription = msgjson.actiondescription

    const tbody = document.getElementById("action-table-body");
    const bottomRow = document.getElementById("actionInsertRow");

    const rowData = document.createElement("tr");
    rowData.className = "table-rows"
    rowData.id = actionID;
    rowData.innerHTML =
        `
            <td id="${actionID}"class="name-column">${actionID}</td>
            <td class="description-column">${actionDescription}</td>
            <td class="action-status-column">Status</td>
            <td class="action-button-column"><button onclick="ActivateAction('${actionID}')" class="action-run-button">Run</button></td>
            <td class="edit-column"><button class="remove-button" onclick="DeleteItem('${actionID}', 'action')">Delete</button></td>
        `;

    tbody.insertBefore(rowData,bottomRow);
}
//we fill the dashboard with all of users parameters / actions
function GetUserConfig(){
    const msgJson = {};
    msgJson.APIKey = API_KEY;
    msgJson.type = "load-user-config"

    ws.send(JSON.stringify(msgJson))

}

//method to send user created parameter / action to backend for storing in db
function SaveUserItem(storeType){

    const msgJson = {};
    msgJson.APIKey = API_KEY;
    msgJson.type = "store"
    msgJson.storetype = storeType
    if(storeType === 'parameter'){
        const name = document.getElementById("parameter-name-input").value;
        document.getElementById("parameter-name-input").value = "";

        const description = document.getElementById("parameter-description-input").value;
        document.getElementById("parameter-description-input").value = "";

        const unit = document.getElementById("parameter-unit-input").value;
        document.getElementById("parameter-unit-input").value = "";

        if(name == "" || description == "" || unit == ""){
            showToast("Not all fields completed")
            return;
        }

        msgJson.nameID = name;
        msgJson.description = description;
        msgJson.unit = unit;

        if(document.getElementById(`${name}`)){
            showToast("Parameter already exists");
            return;
        }
        
        
        AddLiveDataRow(msgJson)

        ws.send(JSON.stringify(msgJson))
        
    }

    if(storeType === 'action'){
        const name = document.getElementById("action-name-input").value;
        document.getElementById("action-name-input").value = "";

        const description = document.getElementById("action-description-input").value;
        document.getElementById("action-description-input").value = "";

        if(name == "" || description == ""){
            showToast("Not all fields completed")
            return;
        }

        msgJson.actionID = name;
        msgJson.actiondescription = description;

        if(document.getElementById(`${name}`)){
            showToast("Parameter already exists")
        }

        AddActionRow(msgJson)

        ws.send(JSON.stringify(msgJson))
    }
    console.log(msgJson)
}

function DeleteItem(name, itemType){
    const msgJson = {}
    msgJson.APIKey = API_KEY;
    msgJson.type = "remove"
    msgJson.itemtype = itemType;
    msgJson.name = name;

    ws.send(JSON.stringify(msgJson));
    console.log("Sent delete json")

    document.getElementById(name)?.remove();
}

//for console use testing
function AddTestAction(actionName, actionDescription = "Uninitialised Description"){
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
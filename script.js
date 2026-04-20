
UNSELECTED_BGCOLOR = "#28b498";
SELECTED_BGCOLOR = "#F2F2F2"

let visible = false;
//websocket path to backend server
const ws = new WebSocket('ws://dolphinsibiu.ddns.net:1337');

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
        actionID:actionID
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


//used to announce server that user is online and can receive data
ws.addEventListener("open", () =>{
    console.log(API_KEY)
    //we make the string json with needed data
    const authdata = {
        type:"auth-client",
        APIKey:API_KEY
        }
    ws.send(JSON.stringify(authdata));

    console.log("Connected websocket to backend server.")

    GetUserConfig();
})

ws.addEventListener("message", (message)=>{
    
    let msgjson = {};
    try{
        msgjson = JSON.parse(message.data);
    }
    catch(e){
        console.log("Received message is not valid json: " + e);
        return;
    }

    switch(msgjson.type){
        case "data":
            //if the live data row doesn't exist we just add it to the table
            if(document.getElementById(`${msgjson.nameID}-value`) === null){
                AddLiveDataRow(msgjson)
            }
            nameID = msgjson.nameID;
            dataElement = document.getElementById(`.${nameID}`);

            document.getElementById(`${nameID}-value`).innerHTML = msgjson.data;
            break;
        case "add":
            AddLiveDataRow(msgjson)
            break;
        case "user-config":
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
            break;
        default:
            console.log("Received unknown message");
    }

});

function UpdateLiveDataRow(msgjson){
    //if the live data row doesn't exist we just add it to the table
    if(document.getElementById(`${msgjson.nameID}-value`) === null){
            AddLiveDataRow(msgjson)
    }
            
    nameID = msgjson.nameID;
    dataElement = document.getElementById(`.${nameID}`);

    document.getElementById(`${nameID}-value`).innerHTML = msgjson.value;
}

function AddLiveDataRow(msgjson){
    //if the parameter already exists we dont add it lol
    if(document.getElementById(`${msgjson.nameID}-value`)){
        return;
    }

    let nameID = msgjson.nameID;
    let description = msgjson.description;
    let unit = msgjson.unit;
    let value = "-";

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
    const configRequestJson = {};
    
    configRequestJson.type = "load-user-config"

    ws.send(JSON.stringify(configRequestJson))

}

//method to send user created parameter / action to backend for storing in db
function SaveUserItem(storeType){

    const itemStoreJson = {};
    itemStoreJson.APIKey = API_KEY;
    itemStoreJson.type = "store"
    itemStoreJson.storetype = storeType

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

        itemStoreJson.nameID = name;
        itemStoreJson.description = description;
        itemStoreJson.unit = unit;

        if(document.getElementById(`${name}`)){
            showToast("Parameter already exists")
        }
        
        
        AddLiveDataRow(itemStoreJson)

        ws.send(JSON.stringify(itemStoreJson))
        
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

        itemStoreJson.actionID = name;
        itemStoreJson.actiondescription = description;

        if(document.getElementById(`${name}`)){
            showToast("Parameter already exists")
        }

        AddActionRow(itemStoreJson)

        ws.send(JSON.stringify(itemStoreJson))
    }
    console.log(itemStoreJson)
}

function DeleteItem(name, itemType){
    const deleteItemJson = {}
    deleteItemJson.APIKey = API_KEY;
    deleteItemJson.type = "remove"
    deleteItemJson.itemtype = itemType;
    deleteItemJson.name = name;

    ws.send(JSON.stringify(deleteItemJson));
    console.log("Sent delete json")

    document.getElementById(name)?.remove();
}

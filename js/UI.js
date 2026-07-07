UNSELECTED_BGCOLOR = "#28b498";
SELECTED_BGCOLOR = "#F2F2F2"

let visible = false;

GetMonitorData(document.getElementById("monitor-button"));

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

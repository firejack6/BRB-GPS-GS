import { clearData, sendCallsign } from "./HTTPrequests/server.js"
document.getElementById("clearData").addEventListener("click", function(){
    clearData();
    document.getElementById("settingsFrame").classList.toggle("hidden");
})

document.getElementById("settings").addEventListener("click", function(){
    document.getElementById("settingsFrame").classList.toggle("hidden");
});

let url = window.location.href;
if(url.includes("https://")){
    url = url.replace("https://", "");
}
if(url.includes("http://")){
    url = url.replace("http://", "");
}
let hostname = url.split("/")[0];
let host = hostname;

document.getElementById("IPsubmit").addEventListener("click", function(){
    host = document.getElementById("ip").value;
    document.getElementById("settingsFrame").classList.toggle("hidden");
});

export let desiredCallsign;
desiredCallsign = localStorage["callsign"];
document.getElementById("displayCallsign").innerText = desiredCallsign;
if(!desiredCallsign){
    desiredCallsign = "N0CALL";
}

document.getElementById("callsign").addEventListener("click", function(){
    desiredCallsign=prompt("CALLSIGN").toUpperCase()
    document.getElementById("settingsFrame").classList.toggle("hidden");
    localStorage["callsign"] = desiredCallsign;
    document.getElementById("displayCallsign").innerText = desiredCallsign;
    sendCallsign(desiredCallsign)
})

export var site
async function readCache(){
    if(localStorage["site"]){
        document.getElementById("site").value = localStorage["site"];
    } else {
        localStorage["site"] = "AKRON"
    }
    site=localStorage["site"]
    return site
}

async function writeCache(){
    localStorage["site"] = document.getElementById("site").value;
    readCache();
}

document.getElementById("rawpackets").addEventListener("click", function(){
    window.open(`https://${host}/rawpackets/rawPackets.html`);
    document.getElementById("settingsFrame").classList.toggle("hidden");
})

export { writeCache, readCache }
export { host }

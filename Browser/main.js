import { clearData } from "./HTTPrequests/server.js"
import { changeLocation } from "./Maps/mapping.js";
document.getElementById("clearData").addEventListener("click", function(){
    clearData();
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
if(!desiredCallsign){
    desiredCallsign = "N0CALL";
}
document.getElementById("callsignSubmit").addEventListener("click", function(){
    desiredCallsign = document.getElementById("callsign").value;
    document.getElementById("settingsFrame").classList.toggle("hidden");
    localStorage["callsign"] = desiredCallsign;
});

async function readCache(){
    if(localStorage["site"]){
        document.getElementById("site").value = localStorage["site"];
    } else {
        localStorage["site"] = "AKRON"
    }
}

async function writeCache(){
    localStorage["site"] = document.getElementById("site").value;
}

export { writeCache, readCache }
export { host }

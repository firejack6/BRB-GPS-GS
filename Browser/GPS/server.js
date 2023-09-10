import { initialMarkers, appendMarker } from "../Maps/mapping.js";
sendCallsign("KE8VYZ");
async function sendCallsign(callsign){

    await fetch("http://127.0.0.1:5000",{
        method: "POST",
        body: JSON.stringify({
            "callsign": callsign,
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
}

initGPS();
async function initGPS(){
    await fetch("http://127.0.0.1:5000/init",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        initialMarkers(data)
    })
}

setInterval(getGPS, 5000);
async function getGPS(){
    await fetch("http://127.0.0.1:5000/update",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        appendMarker(data)
    })
}

async function clearData(){
    await fetch("http://127.0.0.1:5000/clear",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
}

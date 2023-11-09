import { initialMarkers, appendMarker } from "../Maps/mapping.js";
import { host } from "../main.js"
import { desiredCallsign } from "../main.js";

window.addEventListener("load", () => {
    sendCallsign(desiredCallsign);
    initGPS();
    setInterval(getGPS, 5000);
})

async function sendCallsign(callsign){
    await fetch(`https://${host}:5000`,{
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

async function initGPS(){
    await fetch(`https://${host}:5000/init`,{
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

async function getGPS(){
    await fetch(`http://${host}:5000/update`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "callsign": desiredCallsign,
        })
    })
    .then(res => res.json())
    .then(data => {
        appendMarker(data)
    })
}

async function clearData(){
    await fetch(`https://${host}:5000/clear`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
}

export { clearData, sendCallsign }
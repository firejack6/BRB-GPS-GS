initGPS();
let packets;
async function initGPS(){
    let url = window.location.href;
    if(url.includes("https://")){
        url = url.replace("https://", "");
    }
    if(url.includes("http://")){
        url = url.replace("http://", "");
    }
    let hostname = url.split("/")[0];
    let host = hostname;

    await fetch(`https://${host}:5000/init`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        packets = data;
        createDivs(data);
    })
    
    document.getElementById("chosenCallsign").innerText = "CALLSIGN";
    document.getElementById("packetDisplay").value = "";
}

function createDivs(d){
    let callsigns = Object.keys(d);
    for(let i = 0; i<Object.keys(d).length;i++){
        let callsignDiv = document.createElement("div");
        callsignDiv.setAttribute("class","CSbuttonDIV");

        let selection = document.createElement("button");
        selection.id=callsigns[i];
        selection.setAttribute("class", "callsignButton")
        selection.innerText = callsigns[i]
        
        callsignDiv.appendChild(selection)
        document.getElementById("callsigns").appendChild(callsignDiv)
    }
    let buttons = document.querySelectorAll(".callsignButton");
    for(let i = 0; i<buttons.length;i++){
        buttons[i].addEventListener("click", showPackets);
    }
}

function showPackets(e){
    let cs = e.target.id;
    let csPackets = packets[cs];

    document.getElementById("chosenCallsign").innerText = cs;
    document.getElementById("packetDisplay").value = JSON.stringify(csPackets,null,2);
}

document.getElementById("refreshData").addEventListener("click",function(){
    let csButtonDivs = document.querySelectorAll(".CSbuttonDIV")
    for(let i=0;i<csButtonDivs.length;i++){
        csButtonDivs[i].remove()
    }
    initGPS();
});
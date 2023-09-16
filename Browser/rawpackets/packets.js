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
        let csOption = document.createElement("option");
        csOption.value = callsigns[i];
        csOption.innerText = callsigns[i]

        document.getElementById("callsignDropdown").add(csOption)
    }
}

document.getElementById("callsignDropdown").addEventListener("change", function(){
    let cs = document.getElementById("callsignDropdown").value;
    let csPackets = packets[cs];

    document.getElementById("chosenCallsign").innerText = cs;
    document.getElementById("packetDisplay").value = JSON.stringify(csPackets,null,2);
})

document.getElementById("refreshData").addEventListener("click",function(){
    let select = document.getElementById("callsignDropdown");
    let oldOptions = select.options;
    for(i=select.options.length-1;i>=1;i--){
        select.remove(i)
    }

    initGPS();
});
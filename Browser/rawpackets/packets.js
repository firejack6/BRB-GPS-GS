initGPS();
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
        document.getElementById("packets").innerHTML = JSON.stringify(data,null,2);
    })
}
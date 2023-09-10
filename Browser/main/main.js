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
let hostname = url.split("/")[0];
let host = hostname;
document.getElementById("submit").addEventListener("click", function(){
    host = document.getElementById("ip").value;
    document.getElementById("settingsFrame").classList.toggle("hidden");
});

export {host}

import { setVars  } from "../compass/heading.js";
import { writeCache, readCache } from "../main.js";
import { desiredCallsign, site } from "../main.js";
let map,FARlayer,AKRONlayer,SPACEPORTlayer,AMHERSTlayer,MIDOHIOlayer,FARZ13WIDE,AMHERST13,SPACEPORT13,MIDOHIO13,AKRON13;
var appendMarkerTO = true;
window.addEventListener("load", function(){
    //add base map
    map = L.map('map').setView(launchSiteCoords(), 12);

    readCache();
    createTiles();
    createSatelliteImages();
    changeLocation();
    createMarkers();
    this.setTimeout(() => {appendMarkerTO = false}, 10000)
});

document.getElementById("site").addEventListener("change", () => {
    document.getElementById("settingsFrame").classList.add("hidden")
    changeLocation();
    writeCache();
});

function createMarkers(){
    //add markers
    var FARmarker = L.marker([35.34710258457093, -117.80807729650418],{
        title:"FAR",
        icon: launchIcon
    }).addTo(map);
    
    var AKRONmarker = L.marker([41.07591530951977, -81.51777788686735],{
        title:"RPB",
        icon: zippyIcon
    }).addTo(map);
    
    var SPACEPORTmarker = L.marker([32.94023256718151, -106.91949721558379],{
        title:"SPACEPORT",
        icon: launchIcon
    }).addTo(map);
    
    var AMHERSTmarker = L.marker([41.34100613451444, -82.31234047171398],{
        title:"AMHERST",
        icon: launchIcon
    }).addTo(map);
    
    var MIDOHIOmarker = L.marker([39.86088459952167, -83.65579310291524],{
        title:"MIDOHIO",
        icon: launchIcon
    }).addTo(map);
}

function createTiles(){
    //create tile layers
    FARlayer = protomapsL.leafletLayer({url:'./Maps/tiles/FAR.LG.pmtiles'});
    
    AKRONlayer = protomapsL.leafletLayer({url:'./Maps/tiles/AKRON.pmtiles'});
    
    SPACEPORTlayer = protomapsL.leafletLayer({url:'./Maps/tiles/SPACEPORT.pmtiles'});
    
    AMHERSTlayer = protomapsL.leafletLayer({url:'./Maps/tiles/AMHERST.pmtiles'});
    
    MIDOHIOlayer = protomapsL.leafletLayer({url:'./Maps/tiles/MIDOHIO.pmtiles'});
}

function createSatelliteImages(){
    //create image overlays
    FARZ13WIDE = L.imageOverlay('./Maps/satellite/FAR.Z13.Wide.512.png', [[35.0659731379842, -117.3779296875],[35.7465122599185, -118.212890625]],{
        opacity: 0.5
    });

    AMHERST13 = L.imageOverlay('./Maps/satellite/Amherst.png', [[41.310824, -82.265625],[41.376808, -82.353516]],{
        opacity: 0.6
    });

    SPACEPORT13 = L.imageOverlay('./Maps/satellite/Spaceport.png', [[32.916485, -106.831054],[32.990236, -106.962891]],{
        opacity: 0.6
    });

    MIDOHIO13 = L.imageOverlay('./Maps/satellite/MidOhio.png', [[39.8085360414459, -83.583984375],[39.9097362345372, -83.7158203125]],{
        opacity: 0.6
    });

    AKRON13 = L.imageOverlay("./Maps/satellite/Akron.png", [[41.0462168145206,-81.5625],[41.1786539723317,-81.38671875]],{
        opacity: 0.6
    });
}

//create icons
var rocketIcon = L.icon({
    iconUrl: './Maps/icons/rocket.webp',
    iconSize: [50, 50],
});

var launchIcon = L.icon({
    iconUrl: './Maps/icons/launch.png',
    iconSize: [50, 50],
});

var zippyIcon = L.icon({
    iconUrl: './Maps/icons/zippy.png',
    iconSize: [30, 50],
});

var dotIcon = L.icon({
    iconUrl: './Maps/icons/reddot.webp',
    iconSize: [10, 10],
});


// handle gps points
export function initialMarkers(d){
    for(let i = 0; i<Object.keys(d).length; i++){
        appendMarker({[Object.keys(d)[i]]:d[Object.keys(d)[i]][0]})

        let cs = Object.keys(d)[i];
        if(cs != "N0CALL"){
            let data = d[cs][0]
            let alt = d.altitude;
            var marker = L.marker([data.latitude, data.longitude], {
                title: cs,
                icon: rocketIcon
            }).addTo(map);
        
            // marker.bindPopup(`<p> ${cs} \n ${alt} \n ${data.timestamp} </p>`)
        }
    }
}

let oldData = {};
export function appendMarker(d){
    if(Object.keys(d)[0] == "N0CALL"){
        return
    }

    // discard duplicates
    let OLDcs = Object.keys(oldData)
    if(d[OLDcs]){
        if(d[OLDcs].timestamp == oldData[OLDcs].timestamp){
            return
        }
    }
    // plot new data
    else{
        if(d[desiredCallsign]){
            setVars("rocket",d[desiredCallsign])
        }
        
        let cs = Object.keys(d)[0];
        let data = d[cs]
        
        var marker = L.marker([data.latitude, data.longitude], {
            title: cs
        }).addTo(map);
        
        let alt = data.altitude;

        if(appendMarkerTO){
            marker.bindPopup(`<span class="multilineSpan"> ${cs} \n alt: ${alt} \n ${data.timestamp} </span>`)
        } else {
            marker.bindPopup(`<span class="multilineSpan"> ${cs} \n alt: ${alt} \n ${data.timestamp} </span>`)
            .openPopup();
        }
        oldData = d;
    }   
}

setInterval(getDeviceLocation,5000);
function getDeviceLocation(){
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(plotPosition, failed, options);
    }else{
        alert("Geolocation is not supported by this browser.");
    }
}

function failed(){
    console.log("failed to get location")
}

let firstDevicePosition = true;
function plotPosition(position){
    setVars("my",position.coords)
    let marker
    if(firstDevicePosition){
        marker = L.marker([position.coords.latitude, position.coords.longitude], {
            title: "My Position",
            icon: dotIcon
        }).addTo(map);
    }else{
        marker.setLatLng([position.coords.latitude, position.coords.longitude]);
    }
}

function changeLocation(){
    console.log(site)
    if(site=="FAR"){
        FARlayer.addTo(map)
        FARZ13WIDE.addTo(map)
    } else if (site=="AKRON"){
        AKRONlayer.addTo(map)
        AKRON13.addTo(map)
    } else if (site=="SPACEPORT"){
        SPACEPORTlayer.addTo(map)
        SPACEPORT13.addTo(map)
    } else if (site=="AMHERST"){
        AMHERSTlayer.addTo(map)
        AMHERST13.addTo(map)
    } else if(site=="MIDOHIO") {
        MIDOHIOlayer.addTo(map)
        MIDOHIO13.addTo(map)
    } else {
        AKRONlayer.addTo(map)
        AKRON13.addTo(map)
    }

    map.panTo(launchSiteCoords())
}

function launchSiteCoords(){
    var site = document.getElementById("site").value;
    if (site == "FAR"){
        return L.latLng(35.34710258457093, -117.80807729650418)
    }else if (site == "AKRON"){
        return new L.latLng(41.07591530951977, -81.51777788686735)
    }else if (site == "SPACEPORT"){
        return new L.latLng(32.94023256718151, -106.91949721558379)
    }else if (site == "AMHERST"){
        return new L.latLng(41.34100613451444, -82.31234047171398)
    }else if (site == "MIDOHIO"){
        return new L.latLng(39.86088459952167, -83.65579310291524)
    } else { // default to Akron
        return new L.latLng(41.07594033555388, -81.51780126784678)
    }
}

export { changeLocation }
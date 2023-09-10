const map = L.map('map').setView([35.34710258457093, -117.80807729650418], 12);

//add tiles
var FARlayer = protomapsL.leafletLayer({url:'../Maps/tiles/FAR.LG.pmtiles'});
FARlayer.addTo(map);

var AKRONlayer = protomapsL.leafletLayer({url:'../Maps/tiles/AKRON.pmtiles'});
AKRONlayer.addTo(map);

var SPACEPORTlayer = protomapsL.leafletLayer({url:'../Maps/tiles/SPACEPORT.pmtiles'});
SPACEPORTlayer.addTo(map);

var AMHERSTlayer = protomapsL.leafletLayer({url:'../Maps/tiles/AMHERST.pmtiles'});
AMHERSTlayer.addTo(map);

//create icons
var rocketIcon = L.icon({
    iconUrl: '../Maps/icons/rocket.webp',
    iconSize: [50, 50],
});

var launchIcon = L.icon({
    iconUrl: '../Maps/icons/launch.png',
    iconSize: [50, 50],
});

var zippyIcon = L.icon({
    iconUrl: '../Maps/icons/zippy.png',
    iconSize: [30, 50],
});

var dotIcon = L.icon({
    iconUrl: '../Maps/icons/reddot.webp',
    iconSize: [10, 10],
});

//add image overlays
var FARZ13 = L.imageOverlay('../Maps/satellite/FAR.Z13.png', [[35.209721, -117.641601],[35.46067, -118.037109]],{
    opacity: 0.5
});
FARZ13.addTo(map);

var AMHERST13 = L.imageOverlay('../Maps/satellite/Amherst.png', [[41.310824, -82.265625],[41.376808, -82.353516]],{
    opacity: 0.6
});
AMHERST13.addTo(map);

var SPACEPORT13 = L.imageOverlay('../Maps/satellite/Spaceport.png', [[32.916485, -106.831054],[32.990236, -106.962891]],{
    opacity: 0.6
});
SPACEPORT13.addTo(map);

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

// handle gps points
export function initialMarkers(d){
    for(let i = 0; i<Object.keys(d).length; i++){
        appendMarker({[Object.keys(d)[i]]:d[Object.keys(d)[i]][0]})

        let cs = Object.keys(d)[i];
        if(cs != "N0CALL"){
            let data = d[cs][0]
    
            var marker = L.marker([data.latitude, data.longitude], {
                title: cs,
                icon: rocketIcon
            }).addTo(map);
        
            marker.bindPopup(`<p> ${data.timestamp} </p>`)
        }
    }
}

let oldData = {}
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
        let cs = Object.keys(d)[0];
        let data = d[cs]
    
        var marker = L.marker([data.latitude, data.longitude], {
            title: cs
        }).addTo(map);
    
        marker.bindPopup(`<p> ${data.timestamp} </p>`)
            .openPopup();
        oldData = d;
    }   
}

setInterval(getDeviceLocation,5000);
function getDeviceLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(plotPosition);
    }else{
        alert("Geolocation is not supported by this browser.");
    }
}

let firstDevicePosition = true;
function plotPosition(position){
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
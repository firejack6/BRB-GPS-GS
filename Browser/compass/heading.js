document.getElementById("startCompass").addEventListener("click", requestOrientationPermission);

let myBearing;
function requestOrientationPermission(){
  try{
    DeviceOrientationEvent.requestPermission()
    .then(response => {
        if (response == 'granted') {
            window.addEventListener('deviceorientation', (e) => {
              myBearing = e.alpha;
              if (myBearing>180){
                myBearing = myBearing-360;
              }
              // document.getElementById("rawHeading").innerHTML = e.alpha.toFixed(3)+180 + "°";
            })
            setInterval(calculateHeading,1000);
        }
    })
    .catch(console.error)
  } catch{
    compassTesting = true;
    myBearing = 0;
    setInterval(fakeHeading,100);
    setInterval(calculateHeading,100);
  }
}

let compassTesting = false;
function fakeHeading(){
  myBearing = myBearing + 10;
  if(myBearing>360){
    myBearing = 0;
  }
}

let myPositionR = {}, rocketPositionR = {};
function calculateHeading(){
  if(compassTesting){
    rocketPosition = {latitude: 41.081, longitude: -81.519};
    myPosition = {latitude: 41.085, longitude: -81.514};
  }
  if(myPosition != undefined && rocketPosition != undefined){
    // to radians
    myPositionR.latitude = myPosition.latitude * Math.PI / 180;
    myPositionR.longitude = myPosition.longitude * Math.PI / 180;
    rocketPositionR.latitude = rocketPosition.latitude * Math.PI / 180;
    rocketPositionR.longitude = rocketPosition.longitude * Math.PI / 180;

    //bearing
    var y = Math.sin(rocketPositionR.longitude - myPositionR.longitude) * Math.cos(rocketPositionR.latitude);
    var x = Math.cos(myPositionR.latitude) * Math.sin(rocketPositionR.latitude) - Math.sin(myPositionR.latitude) * Math.cos(rocketPositionR.latitude) * Math.cos(rocketPositionR.longitude - myPositionR.longitude);
    var bearing = Math.atan2(y, x) * 180 / Math.PI; //direction we need to go, mybearing is the direction we're going
    var diffBearing = myBearing - bearing;
    updateCompass(diffBearing, myBearing+90);

    //distance
    var R = 6371; // Radius of the earth in km
    var dLat = rocketPositionR.latitude-myPositionR.latitude;
    var dLon = rocketPositionR.longitude-myPositionR.longitude;
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(myPositionR.latitude) * Math.cos(rocketPositionR.latitude) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c * 1000; // Distance in m

    document.getElementById("distance").innerHTML = "&nbsp"+d.toFixed(3) + "m";
  }
}

var myPosition, rocketPosition;
function setVars(which,position){
  if(position != undefined){
    if(which == "my"){
      myPosition = position;
    }else{
      rocketPosition = position;
    }
  }
}

function updateCompass(rkthdg,myhdg){
  document.getElementById("rocketCont").style.setProperty("transform","translate(-35%, -50%) rotate("+rkthdg+"deg)");
  document.getElementById("compassNorth").style.transform = "rotate("+myhdg+"deg)";
  document.getElementById("compassPNG").style.transform = "rotate("+myhdg+"deg)";
}

// add north
// place north marker by rotating to 360-myBearing

export { setVars }
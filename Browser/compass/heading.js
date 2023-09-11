document.getElementById("startCompass").addEventListener("click", requestOrientationPermission);

let myBearing;
function requestOrientationPermission(){
  DeviceOrientationEvent.requestPermission()
  .then(response => {
      if (response == 'granted') {
          window.addEventListener('deviceorientation', (e) => {
            myBearing = e.alpha;
            if (myBearing>180){
              myBearing = myBearing-360;
            }
            document.getElementById("rawHeading").innerHTML = e.alpha.toFixed(3)+180 + "°";
          })
          setInterval(calculateHeading,1000);

      }
  })
  .catch(console.error)
}

let myPositionR = {}, rocketPositionR = {};
function calculateHeading(){
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
    
    document.getElementById("headingg").innerHTML = "&nbsp"+diffBearing.toFixed(3) + "°";

    updateCompass(diffBearing);

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

function updateCompass(hdg){
  document.getElementById("compassArrow").style.transform = "rotate("+hdg+"deg)";
}



export { setVars }
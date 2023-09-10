document.getElementById("startCompass").addEventListener("click", requestOrientationPermission);

let myBearing;
function requestOrientationPermission(){
  DeviceOrientationEvent.requestPermission()
  .then(response => {
      if (response == 'granted') {
          window.addEventListener('deviceorientation', (e) => {
            myBearing = e.alpha;
            document.getElementById("rawHeading").innerHTML = e.alpha;
          })
          setInterval(calculateHeading,3000);

      }
  })
  .catch(console.error)
}

function calculateHeading(){
  // let myPosition = {"latitude":41.310824, "longitude":-82.265625}
  console.log(myPosition)
  console.log(rocketPosition)
  if(myPosition != undefined && rocketPosition != undefined){
    // to radians
    myPosition.latitude = myPosition.latitude * Math.PI / 180;
    myPosition.longitude = myPosition.longitude * Math.PI / 180;
    rocketPosition.latitude = rocketPosition.latitude * Math.PI / 180;
    rocketPosition.longitude = rocketPosition.longitude * Math.PI / 180;

    var y = Math.sin(rocketPosition.longitude - myPosition.longitude) * Math.cos(rocketPosition.latitude);
    var x = Math.cos(myPosition.latitude) * Math.sin(rocketPosition.latitude) - Math.sin(myPosition.latitude) * Math.cos(rocketPosition.latitude) * Math.cos(rocketPosition.longitude - myPosition.longitude);
    var bearing = Math.atan2(y, x) * 180 / Math.PI;
    alert(bearing)
    let diffBearing = myBearing - bearing;
    document.getElementById("heading").innerHTML = diffBearing;
  }
}

let myPosition, rocketPosition;
function setVars(which,position){
  if(position != undefined){
    if(which == "my"){
      myPosition = position;
    }else{
      rocketPosition = position;
    }
  }
}

export { setVars }
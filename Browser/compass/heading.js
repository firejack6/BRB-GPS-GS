window.addEventListener('deviceorientation', manageCompass)
let absoluteHeading
function manageCompass(event) {
    if (event.webkitCompassHeading) {
        absoluteHeading = event.webkitCompassHeading + 180;
    } else {
        absoluteHeading = 180 - event.alpha;
    }
    console.log(absoluteHeading);
}
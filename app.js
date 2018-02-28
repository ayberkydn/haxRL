// Handles for rendering

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');

// Init keypress events

var keys = {};
window.onkeydown = function (evt) {
    keys[evt.key] = true;
};
window.onkeyup = function (evt) {
    keys[evt.key] = false;
};

// Global Constants

const bgColor = "green";
const playerMass = 3;
const ballMass = 2;
const playerRestitution = 0.4;
const ballRestitution = 0.4;
const playerDamping = 0.93;
const ballDamping = 0.98;
//
scene = new Scene();
scene.addObject(new Player(initialX = 80,
    initialY = 80,
    radius = 18,
    mass = playerMass,
    restitution = playerRestitution,
    damping = playerDamping,
    color = "blue"));

scene.addObject(new Ball(initialX = 250,
    initialY = 250,
    radius = 11,
    mass = ballMass,
    restitution = ballRestitution,
    damping = ballDamping));



window.setInterval(function () {
    scene.update();
    scene.draw();
}, 30);
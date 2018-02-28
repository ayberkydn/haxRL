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

const attenuationCoef = 0.91;
const bgColor = "green";
var keyPower = 5; // needs to be global

//
scene = new Scene();
scene.addObject(new Player(initialX = 80, initialY = 80, radius = 18, mass = 10, color = "blue"));
scene.addObject(new Ball(initialX = 250, initialY = 250, radius = 11, mass = 1));



window.setInterval(function () {
    scene.update();
    scene.draw();
}, 30);
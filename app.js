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


// Parameters
const bgColor = "green";
const playerMass = 3;
const ballMass = 2;
const playerRestitution = 0.4;
const ballRestitution = 0.4;
const playerDamping = 0.93;
const ballDamping = 0.98;
const topbottomMargin = 60;
const leftrightMargin = 30;
//

// __main__

scene = new Scene();

scene.addObject(new Ball(
    centerX = 250,
    centerY = 250,
    radius = 11,
    mass = ballMass,
    restitution = ballRestitution,
    damping = ballDamping));

scene.addObject(new Player(
    centerX = 200,
    centerY = 200,
    radius = 18,
    mass = playerMass,
    restitution = playerRestitution,
    damping = playerDamping,
    color = "blue"));


scene.addObject(new HorizontalBorder(
    centerX = canvas.width / 2,
    centerY = topbottomMargin,
    length = canvas.width - leftrightMargin * 2,
    restitution = 1));

scene.addObject(new HorizontalBorder(
    centerX = canvas.width / 2,
    centerY = canvas.height - topbottomMargin,
    length = canvas.width - leftrightMargin * 2,
    restitution = 1));

scene.addObject(new VerticalBorder(
    centerX = leftrightMargin,
    centerY = canvas.height / 2,
    lenght = canvas.height - topbottomMargin * 2,
    restitution = 1));

scene.addObject(new VerticalBorder(
    centerX = canvas.width - leftrightMargin,
    centerY = canvas.height / 2,
    lenght = canvas.height - topbottomMargin * 2,
    restitution = 1));


window.setInterval(function () {
    scene.update();
    scene.draw();
}, 30);
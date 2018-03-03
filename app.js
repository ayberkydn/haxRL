// Gets the handles for rendering
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
const bgColor = "#688F56";
const redColor = "#E56E56";
const blueColor = "#5689E5";
const playerMass = 3;
const ballMass = 2;
const playerRestitution = 0.4;
const ballRestitution = 0.4;
const playerDamping = 0.93;
const playerkickDamping = 0.87;
const playerkickPower = 15;
const ballDamping = 0.98;
const topbottomMargin = 60;
const leftrightMargin = 30;
//

// __main__

scene = new Scene();


scene.addObject(new Ball(
    centerX = canvas.width / 2,
    centerY = canvas.height / 2,
    radius = 9,
    mass = ballMass,
    restitution = ballRestitution,
    damping = ballDamping));

scene.addObject(new Player(
    centerX = 300,
    centerY = canvas.height / 2,
    radius = 16,
    mass = playerMass,
    restitution = playerRestitution,
    damping = playerDamping,
    kickDamping = playerkickDamping,
    kickPower = playerkickPower,
    color = redColor));

scene.addObject(new Player(
    centerX = 500,
    centerY = canvas.height / 2,
    radius = 16,
    mass = playerMass,
    restitution = playerRestitution,
    damping = playerDamping,
    kickDamping = playerkickDamping,
    kickPower = playerkickPower,
    color = blueColor));

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
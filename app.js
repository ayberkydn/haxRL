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
const bgColor = Color.green;
const redColor = Color.red;
const blueColor = Color.blue;
const playerMass = 3;
const ballMass = 2;
const playerRestitution = 0.45;
const ballRestitution = 0.45;
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

scene.addObject(new Box(
    xLeft = leftrightMargin,
    xRight = canvas.width - leftrightMargin,
    yUp = topbottomMargin,
    yDown = canvas.height - topbottomMargin,
    restitution = 1
));

scene.addObject(new Goal(
    centerX = leftrightMargin,
    centerY = canvas.height / 2,
    way = Way.left,
    length = 150
));

scene.addObject(new Goal(
    centerX = canvas.width - leftrightMargin,
    centerY = canvas.height / 2,
    way = Way.right,
    length = 150
));


window.setInterval(function () {
    scene.update();
    scene.draw();
}, 30);
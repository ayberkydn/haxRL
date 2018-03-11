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
var bgColor = Color.green;
var redColor = Color.red;
var blueColor = Color.blue;
var playerMass = 3;
var ballMass = 2;
var playerRestitution = 0.45;
var borderRestitution = 1;
var ballRestitution = 0.45;
var playerDamping = 0.93;
var playerkickDamping = 0.87;
var playerkickPower = 15;
var playerRadius = 16;
var ballRadius = 9;
var ballDamping = 0.98;
var topbottomMargin = 60;
var leftrightMargin = 30;
var goalLength = 150;
//
var game = new Game();
game.addAgent(new HumanAgent(Side.red));
game.addAgent(new RandomAgent(Side.blue));

window.setInterval(function () {
    game.update();
    game.draw();
}, 30);
//TODO 
//Direkten bazen hayvan gibi dönme şeysini düzelt
//Borderları start end diye refactor et
//
//



try {
    var dl = require('deeplearn');
} catch (err) {
    console.log(err);
}
dl.setBackend("cpu");



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
var topbottomMargin = 80;
var leftrightMargin = 60;
var goalLength = 140;
//
var env = new Environment( /*render*/ true, /*sound*/ true, /*resetDelay*/ false, /*randomStart*/ true);
//env.addAgent(new HumanAgent(Side.blue, "w", "s", "a", "d", "q"));
env.addAgent(new HumanAgent("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "x"), Side.red);
env.addAgent(new QLearnerAgent(), Side.blue);















window.setInterval(() => {
    env.update();
    env.draw();
}, 30);
window.setTimeout(() => {
    console.log(3000 / env.step, "ms per step total");
}, 3000);

/*
window.setInterval(() => {
    env.update();
    env.draw();
}, 0);
window.setTimeout(() => {
    console.log(3000 / env.step, "ms per step total");
}, 3000);
*/

/*
var t0 = performance.now();
for (let n = 0; n < 500; n++) {
    env.update();
    env.draw();
}
var t1 = performance.now();
console.log((t1 - t0) / 500, "per step total")

var t0 = performance.now();
for (let n = 0; n < 500; n++) {
    env.update();
}
var t1 = performance.now();
console.log((t1 - t0) / 500, "per step update")

var t0 = performance.now();
for (let n = 0; n < 500; n++) {
    env.draw();
}
var t1 = performance.now();
console.log((t1 - t0) / 500, "per step draw")
*/

/*
for (let n = 0; n < 200000; n++) {
    game.update();
    if (n % 1000 == 0) {
        game.draw();
    }
}
*/

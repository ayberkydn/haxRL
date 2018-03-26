//TODO 
//Direkten bazen hayvan gibi dönme şeysini düzelt
//Borderları start end diye refactor et

//Epsilon annealing gibi son algoritma tricklerini implement et, parametreleri guzellestir
//Jsona yazıp okumayı implement et sonra timeoutsuz calistir
//Haxball boyutları esitle

dl.setBackend("webgl");



// Gets the handles for rendering
var canvas = document.getElementById("gameCanvas");
var canvas2 = document.getElementById("agentVisionCanvas");
var ctx = canvas.getContext('2d');
var cHeight = canvas.height;
var cWidth = canvas.width;
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
var ballRadius = 10;
var ballDamping = 0.98;
var topbottomMargin = 40;
var leftrightMargin = 55;
var goalLength = 140;
var middleFieldRadius = 83;
var postRadius = 8.5;
var scaleH = 0.20;
var scaleW = 0.20;
//
var env = new Environment( /*render*/ true, /*sound*/ false, /*resetDelay*/ false, /*randomStart*/ false);
//env.addAgent(new HumanAgent(Side.blue, "w", "s", "a", "d", "q"));
env.addAgent(new HumanAgent("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "x"), Side.red);
env.addAgent(new DQNAgent(), Side.blue);
//env.linkAgentsExperience();

env.draw();
setInterval(() => {
    env.draw();
    drawImageTensor(sampleImageFrom(canvas, 0, [scaleH, scaleW]), canvas2);
    env.update();
}, 0);




/*
var globalStep = 0;
var proc = window.setInterval(() => {
    env.update();
    env.draw();
    globalStep++;
}, 0);

var probTime = 25000;

window.setTimeout(() => {
    var perstep = probTime / globalStep;
    console.log(perstep, "ms per step total");
    clearInterval(proc);
    window.setInterval(() => {
        env.update();
        env.draw();
    }, perstep);
}, probTime * 1.5);
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

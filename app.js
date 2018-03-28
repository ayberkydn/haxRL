//TODO 
//Direkten bazen hayvan gibi dönme şeysini düzelt
//Borderları start end diye refactor et

//Epsilon annealing gibi son algoritma tricklerini implement et, parametreleri guzellestir
//Jsona yazıp okumayı implement et sonra timeoutsuz calistir


//LAYERS REFACTOR
//-activation ayri layer
//-networke input shape init



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
env.addAgent(new ANNAgent(), Side.blue);
//env.linkAgentsExperience();

env.draw();


setInterval(() => {
    env.update();
}, 0);


// for (let n = 0; n < 500; n++) {
//     env.draw();
//     env.update();
// }

// let t1 = performance.now();
// for (let n = 0; n < 500; n++) {
//     env.draw();
//     env.update();
// }
// let t2 = performance.now();

// console.log(t2 / 5000 - t1 / 5000, "ms per frame");
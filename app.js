var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);


// Init balls
let balls = [];

// Init players
let players = [];
players.push(new Player(50, 50, 10));

// Init keypress events
var keys = {}
window.onkeydown = function(evt) {
    keys[evt.key] = true;
}
window.onkeyup = function(evt) {
    keys[evt.key] = false;
}

function update() {
    for(let ball of balls){
        ball.update();
    }
    for(let player of players){
        player.update();
    }
}

function draw() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let ball of balls) {
        ball.draw();
    }
    for(let player of players){
        player.draw();
    }
}

function updateAndDraw(){
    update(); draw();
}


window.setInterval(updateAndDraw, 30);


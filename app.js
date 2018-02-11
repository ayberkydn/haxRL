var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext('2d');

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let balls = [];
for(let i = 0; i<10; i++){
    let ballx = Math.floor((Math.random()*200));
    let bally = Math.floor((Math.random()*200));
    let ballRadius = Math.floor((Math.random()*20));
    balls.push(new Ball(ballx, bally, ballRadius))
}

function update() {
    for(let ball of balls){
        ball.update()
    }
}

function draw() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let ball of balls) {
        ball.draw();
    }
}

function updateAndDraw(){
    update(); draw();
}


window.setInterval(updateAndDraw, 200);
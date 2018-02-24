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

// Forces for keypress events

// Global Constants

const attenuationCoef = 0.9;



let player = new Player(initialX = 80, initialY = 80, radius = 80, mass = 1);

function update() {

    let diagonal = (keys.ArrowUp ^ keys.ArrowDown) & (keys.ArrowLeft ^ keys.ArrowRight);
    if (keys.ArrowUp == true) {
        player.applyForce(new Vector(0, -1).mult(diagonal ? 1 / Math.SQRT2 : 1));
    }
    if (keys.ArrowDown == true) {
        player.applyForce(new Vector(0, 1).mult(diagonal ? 1 / Math.SQRT2 : 1));
    }
    if (keys.ArrowLeft == true) {
        player.applyForce(new Vector(-1, 0).mult(diagonal ? 1 / Math.SQRT2 : 1));
    }
    if (keys.ArrowRight == true) {
        player.applyForce(new Vector(1, 0).mult(diagonal ? 1 / Math.SQRT2 : 1));
    }

    player.update();
}

function draw() {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

}

function updateAndDraw() {

    update();
    draw();

}


window.setInterval(updateAndDraw, 30);
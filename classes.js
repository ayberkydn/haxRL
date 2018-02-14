class Circle {
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }

    update(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }    
    draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill()
    }
}

class Player extends Circle {
    constructor(x, y, radius) {
        super(x, y, radius);
    }
    
    update() {
        if(keys["w"] === true) {
            this.ySpeed -= 1;
        }
        if(keys["a"] === true) {
            this.xSpeed -= 1;
        }
        if(keys["s"] === true) {
            this.ySpeed += 1;
        }
        if(keys["d"] === true) {
            this.xSpeed += 1;
        }
        super.update();
    }
}

class Ball extends Circle {
    constructor(x, y, radius){
        super(x, y, radius)
    }
}
class Ball {
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.xSpeed = Math.random()*5;
        this.ySpeed = Math.random()*5;
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
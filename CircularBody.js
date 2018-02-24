class CircularBody {
    constructor(initialX, initialY, radius, mass, color) {
        this.location = new Vector(initialX, initialY);
        this.radius = radius;
        this.mass = mass;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.color = color;
    }

    applyForce(forceVec) {
        let accDelta = forceVec.copy().div(this.mass);
        this.acceleration.add(accDelta);
    }

    update() {
        this.location.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.mult(attenuationCoef);
        this.acceleration.mult(0);
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.location.x, this.location.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    checkCollisionWith(body2) {
        if (body2.location.copy().sub(this.location).magnitude() <= this.radius) {
            console.log("collision");
        }
    }

}
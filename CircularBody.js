class CircularBody {
    constructor(initialX, initialY, radius, mass, restitution, damping, color) {
        this.location = new Vector(initialX, initialY);
        this.radius = radius;
        this.mass = mass;
        this.invMass = 1 / this.mass;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.color = color;
        this.restitution = restitution;
        this.damping = damping;
    }

    applyForce(forceVec) {
        let accelerationDelta = Vector.div(forceVec, this.mass);
        this.acceleration.add(accelerationDelta);
    }

    applyImpulse(impulseVec) {
        let velocityDelta = Vector.div(impulseVec, this.mass);
        this.velocity.add(velocityDelta);
    }

    update() {
        this.location.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.mult(this.damping);
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
        let distance = body2.location.copy().sub(this.location).magnitude();
        if (distance <= this.radius + body2.radius) {
            return true;
        }
    }

}
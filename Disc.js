class Disc extends Body {
    constructor(centerX, centerY, radius, mass, restitution, damping, color) {
        super(centerX, centerY, restitution);
        this.radius = radius;
        this.mass = mass;
        this.invMass = 1 / this.mass;
        this.color = color;
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
        this.center.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.mult(this.damping);
        this.acceleration.mult(0);
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = Color.black;
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}




class Ball extends Disc {
    constructor(initialX, initialY, radius, mass) {
        super(...arguments, Color.white);
    }
}
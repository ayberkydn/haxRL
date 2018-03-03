class Body {
    constructor(centerX, centerY, restitution) {
        this.center = new Vector(centerX, centerY);
        this.restitution = restitution;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
    }

    applyForce() {}
    applyImpulse() {}
    update() {}
    draw() {}

}
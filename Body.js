class Body {
    constructor(centerX, centerY, restitution) {
        this.center = new Vector(centerX, centerY);
        this.restitution = restitution;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.collisionMask = [Body];
    }

    applyForce() {
        throw "applyForce not implemented";
    }
    applyImpulse() {
        throw "applyImpulse not implemented";
    }
    update() {
        throw "update not implemented";
    }
    draw() {
        throw "draw not implemented";
    }

    setCollisionMask(maskArray) {
        this.collisionMask = maskArray;
        return this;
    }

    makeGhost() {
        this.collisionMask = [];
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }

    setOuterColor(color) {
        this.outerColor = color;
        return this;
    }


}

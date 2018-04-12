class Border extends Body {
    constructor(centerX, centerY, restitution, visible = true, ghost = false) {
        super(...arguments);
        this.mass = Infinity;
        this.invMass = 0;
        this.color = Color.border;
        this.visible = visible;
        this.extendsTo = null;
        this.collisionMask = [Disc];
    }
    update() { //do nothing
    }
    applyImpulse() { //do nothing
    }

    extendTo(way) {
        this.extendsTo = way;
        return this;
    }
}
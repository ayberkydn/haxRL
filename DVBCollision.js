class DVBCollision extends Collision {
    //Disc-VerticalBorder collision
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof VerticalBorder)) {
            throw `Wrong collision type: Not a Disk-VB collision`;
        } else {
            super(body1, body2);
            if (body2.extendsTo == Way.left) {
                this.collisionNormal = new Vector(1, 0);
            } else if (body2.extendsTo == Way.right) {
                this.collisionNormal = new Vector(-1, 0);
            } else {
                this.collisionNormal = body1.center.x > body2.center.x ? new Vector(1, 0) : new Vector(-1, 0);
            }
            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);
            this.penetrationDepth = this.body1.radius - Math.abs(this.body1.center.x - this.body2.center.x);
        }
    }
}

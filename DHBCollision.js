class DHBCollision extends Collision {
    //Disc-HorizontalBorder collision
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof HorizontalBorder)) {
            throw `Wrong collision type: Not a Disk-HB collision`;
        } else {
            super(body1, body2);
            if (body2.extendsTo == Way.up) {
                this.collisionNormal = new Vector(0, 1);
            } else if (body2.extendsTo == Way.down) {
                this.collisionNormal = new Vector(0, -1);
            } else {
                this.collisionNormal = body1.center.y > body2.center.y ? new Vector(0, 1) : new Vector(0, -1);
            }

            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);
            this.penetrationDepth = this.body1.radius - Math.abs(this.body1.center.y - this.body2.center.y);
        }
    }
}
class DDCollision extends Collision {
    //Disc-Disc collision
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof Disc)) {
            throw `Wrong collision type: Not a Disk-Disk collision`;
        } else {
            super(body1, body2);
            this.collisionNormal = Vector.sub(this.body1.center, this.body2.center).normalize();
            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);
            this.penetrationDepth = Math.abs(this.body1.radius + this.body2.radius - Vector.sub(this.body1.center, this.body2.center).magnitude());
        }
    }
}

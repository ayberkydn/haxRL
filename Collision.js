class Collision {
    constructor(body1, body2) {
        this.body1 = body1;
        this.body2 = body2;
        this.restitution = Math.min(this.body1.restitution, this.body2.restitution);

        if (body1 instanceof Disc && body2 instanceof Disc) {
            this.type = "DD";
        } else if (body1 instanceof Disc && body2 instanceof Border) {
            this.type = "DB";
        } else if (body1 instanceof Border && body2 instanceof Disc) {
            // If type is DB, body1 will be Disk
            //   and body2 will be Border
            this.type = "DB";
            this.body1 = body2;
            this.body2 = body1;
        } else if (body1 instanceof Border && body2 instanceof Border) {
            this.type = "BB";
        }
    }

    resolve() {
        //https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
        //Apply corresponding forces/impulses to colliding objects


        // Don't handle collision if objects aren't actually colliding
        if (this.velocityAlongNormal > 0)
            return;

        let j = -(1 + this.restitution) * this.velocityAlongNormal;
        j /= this.body1.invMass + this.body2.invMass;

        let impulse = this.collisionNormal.mult(j);
        this.body1.applyImpulse(impulse);
        this.body2.applyImpulse(impulse.mult(-1));
    }

    static getCollision(body1, body2) {
        // Returns collision of corresponding type with body1 and body2, if any. 

        if (body1 instanceof Border && body2 instanceof Disc) {
            // Disc-Border is allowed, Border-Disc is not.
            return Collision.getCollision(body2, body1);

        } else if (body1 instanceof Disc && body2 instanceof HorizontalBorder) {
            if (Math.abs(body1.center.y - body2.center.y) < body1.radius) {
                return new DHBCollision(body1, body2);
            } //lenghti de hesaba kat

        } else if (body1 instanceof Disc && body2 instanceof VerticalBorder) {
            if (Math.abs(body1.center.x - body2.center.x) < body1.radius) {
                return new DVBCollision(body1, body2);
            } //lenght hesaba kat

        } else if (body1 instanceof Disc && body2 instanceof Disc) {
            if (Vector.sub(body1.center, body2.center).magnitude() <= body1.radius + body2.radius) {
                return new DDCollision(body1, body2);
            }
        } else if (body1 instanceof Border && body2 instanceof Border) {
            return false;
        }
    }


}

class DDCollision extends Collision {
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof Disc)) {
            throw `Wrong collision type: Not a Disk-Disk collision`;
        } else {
            super(body1, body2);
            this.collisionNormal = Vector.sub(this.body1.center, this.body2.center).normalize();
            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);
        }


    }
}

class DVBCollision extends Collision {
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof VerticalBorder)) {
            throw `Wrong collision type: Not a Disk-VB collision`;
        } else {
            super(body1, body2);
            this.collisionNormal = body1.center.x > body2.center.x ? new Vector(1, 0) : new Vector(-1, 0);
            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);

        }




    }
}

class DHBCollision extends Collision {
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof HorizontalBorder)) {
            throw `Wrong collision type: Not a Disk-HB collision`;
        } else {
            super(body1, body2);
            this.collisionNormal = body1.center.y > body2.center.y ? new Vector(0, 1) : new Vector(0, -1);
            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);

        }




    }
}
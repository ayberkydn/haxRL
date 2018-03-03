class Collision {
    constructor(body1, body2) {
        this.body1 = body1;
        this.body2 = body2;
        this.restitution = Math.min(this.body1.restitution, this.body2.restitution);
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
        this.resolvePenetration();

    }

    resolvePenetration() {
        //https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
        let percent = 0.1; //0.2 - 0.8 arasi imis
        let slop = 0.1; //0.01 - 0.1
        let correction = Vector.mult(this.collisionNormal, percent * Math.max(this.penetrationDepth - slop, 0) / (this.body1.invMass + this.body2.invMass));
        this.body1.center.sub(Vector.mult(correction, this.body1.invMass));
        this.body2.center.add(Vector.mult(correction, this.body2.invMass));
    }

    static getCollision(body1, body2) {
        // Returns collision of corresponding type with body1 and body2, if any. 
        // else returns undefined
        if (body1 === body2) return;
        if (body1 instanceof Border && body2 instanceof Disc) {
            // Disc-Border is allowed, Border-Disc is not.
            return Collision.getCollision(body2, body1);

        } else if (body1 instanceof Disc && body2 instanceof HorizontalBorder) {
            if (Math.abs(body1.center.y - body2.center.y) < body1.radius) {
                return new DHBCollision(body1, body2);
            } //lenghti de hesaba kat TODO

        } else if (body1 instanceof Disc && body2 instanceof VerticalBorder) {
            if (Math.abs(body1.center.x - body2.center.x) < body1.radius) {
                return new DVBCollision(body1, body2);
            } //lengthi de hesaba kat TODO

        } else if (body1 instanceof Disc && body2 instanceof Disc) {
            if (Vector.sub(body1.center, body2.center).magnitude() <= body1.radius + body2.radius) {
                return new DDCollision(body1, body2);
            }
        } else if (body1 instanceof Kicker && body2 instanceof Ball) {
            return Collision.getCollision(body2, body1);
        } else if (body1 instanceof Ball && body2 instanceof Kicker) {
            if (Vector.sub(body1.center, body2.center).magnitude() <= body1.radius + body2.radius) {
                return new KickCollision(body1, body2);
            }
        }
    }
}

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

class DVBCollision extends Collision {
    //Disc-VerticalBorder collision
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof VerticalBorder)) {
            throw `Wrong collision type: Not a Disk-VB collision`;
        } else {
            super(body1, body2);
            this.collisionNormal = body1.center.x > body2.center.x ? new Vector(1, 0) : new Vector(-1, 0);
            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);
            this.penetrationDepth = this.body1.radius - Math.abs(this.body1.center.x - this.body2.center.x);
        }
    }
}


class DHBCollision extends Collision {
    //Disc-HorizontalBorder collision
    constructor(body1, body2) {
        if (!(body1 instanceof Disc && body2 instanceof HorizontalBorder)) {
            throw `Wrong collision type: Not a Disk-HB collision`;
        } else {
            super(body1, body2);
            this.collisionNormal = body1.center.y > body2.center.y ? new Vector(0, 1) : new Vector(0, -1);
            this.relativeVelocity = Vector.sub(this.body1.velocity, this.body2.velocity);
            this.velocityAlongNormal = Vector.dot(this.collisionNormal, this.relativeVelocity);
            this.penetrationDepth = this.body1.radius - Math.abs(this.body1.center.y - this.body2.center.y);
        }
    }
}

class KickCollision extends Collision {
    constructor(body1, body2) {
        if (!(body1 instanceof Ball && body2 instanceof Kicker)) {
            throw `Wrong collision type: Not a Ball-Kicker collision`;
        } else {
            super(body1, body2);
            this.collisionNormal = Vector.sub(this.body1.center, this.body2.center).normalize();
        }
    }

    resolve() {
        if (this.body2.active) {
            this.body2.deactivate();
            this.body1.applyImpulse(this.collisionNormal.mult(this.body2.kickPower));
            new Audio("kicksound.mp3").play();
        }
    }
}
class Collision {
    constructor(body1, body2) {
        this.body1 = body1;
        this.body2 = body2;
        this.restitution = Math.min(this.body1.restitution, this.body2.restitution);
    }


    resolve() {
        //https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
        //Apply corresponding forces/impulses to colliding objects

        this.resolveImpulse();
        this.resolvePenetration();

    }

    resolveImpulse() {
        // Don't handle collision if objects aren't actually colliding
        if (this.velocityAlongNormal > 0)
            return;

        let j = -(1 + this.restitution) * this.velocityAlongNormal;
        j /= this.body1.invMass + this.body2.invMass;

        let impulse = Vector.mult(this.collisionNormal, j);

        this.body1.applyImpulse(impulse);
        this.body2.applyImpulse(impulse.mult(-1));

    }

    resolvePenetration() {
        // //https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
        let percent = 1; //0.2 - 0.8 arasi imis
        let slop = 0.1; //0.01 - 0.1
        let correction = Vector.mult(this.collisionNormal, percent * Math.max(this.penetrationDepth - slop, 0) / (this.body1.invMass + this.body2.invMass));
        this.body1.center.add(Vector.mult(correction, this.body1.invMass));
        this.body2.center.sub(Vector.mult(correction, this.body2.invMass));
    }

    static getCollision(body1, body2) {
        // Returns collision of corresponding type with body1 and body2, if any. 
        // else returns undefined

        if (body1 === body2) {
            return null;
        }

        let body1_in_body2CollisionMask = false;
        let body2_in_body1CollisionMask = false;
        for (let objClass of body1.collisionMask) {

            if (body2 instanceof objClass) {
                body2_in_body1CollisionMask = true;
                break;
            }
        }
        for (let objClass of body2.collisionMask) {


            if (body1 instanceof objClass) {
                body1_in_body2CollisionMask = true;
                break;
            }
        }
        if ((body1_in_body2CollisionMask && body1_in_body2CollisionMask) != true) {
            return null;
        }


        if (body1 instanceof Border && body2 instanceof Disc) {
            // Disc-Border is allowed, Border-Disc is not.
            return Collision.getCollision(body2, body1);



        } else if (body1 instanceof Disc && body2 instanceof HorizontalBorder) {
            if (body2.center.x + body2.length / 2 > body1.center.x && body2.center.x - body2.length / 2 < body1.center.x) {
                if (body1.center.y - body2.center.y < body1.radius && body2.extendsTo == Way.up) {
                    return new DHBCollision(body1, body2);
                } else if (body2.center.y - body1.center.y < body1.radius && body2.extendsTo == Way.down) {
                    return new DHBCollision(body1, body2);
                }
            }




        } else if (body1 instanceof Disc && body2 instanceof VerticalBorder) {
            if (body2.center.y + body2.length / 2 > body1.center.y && body2.center.y - body2.length / 2 < body1.center.y) {

                if (body1.center.x - body2.center.x < body1.radius && body2.extendsTo == Way.left) {
                    return new DVBCollision(body1, body2);
                } else if (body2.center.x - body1.center.x < body1.radius && body2.extendsTo == Way.right) {
                    return new DVBCollision(body1, body2);
                }
            }




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
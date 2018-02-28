class Collision {
    constructor(object1, object2) {
        this.object1 = object1;
        this.object2 = object2;
    }

    resolve() {
        //TODO
        //Apply corresponding forces/impulses to colliding objects
        let collisionNormal = Vector.sub(this.object1.location, this.object2.location).normalize();
        let relativeVelocity = Vector.sub(this.object1.velocity, this.object2.velocity);
        let velocityAlongNormal = Vector.dot(collisionNormal, relativeVelocity);
        //TEST
        if (velocityAlongNormal > 0)
            return;
        //TEST
        let restitution = Math.min(this.object1.restitution, this.object2.restitution);
        let j = -(1 + restitution) * velocityAlongNormal;
        j /= 1 / this.object1.mass + 1 / this.object2.mass;

        let impulse = collisionNormal.mult(j);
        this.object1.applyImpulse(impulse);
        this.object2.applyImpulse(impulse.mult(-1));
    }

}
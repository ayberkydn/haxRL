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
class Player extends Disc {
    constructor(centerX, centerY, radius, mass, restitution, damping, kickDamping, kickPower, color) {
        super(centerX, centerY, radius, mass, restitution, damping, color);
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.nonkickDamping = damping;
        this.kickDamping = kickDamping;
        this.kicker = new Kicker(this, kickPower);

    }

    applyAction(action) {
        if (action == Action.up) {
            this.applyForce(Unitvec.up);
            this.kicker.active = false;
        } else if (action == Action.upleft) {
            this.applyForce(Unitvec.upleft);
            this.kicker.active = false;
        } else if (action == Action.left) {
            this.applyForce(Unitvec.left);
            this.kicker.active = false;
        } else if (action == Action.downleft) {
            this.applyForce(Unitvec.downleft);
            this.kicker.active = false;
        } else if (action == Action.down) {
            this.applyForce(Unitvec.down);
            this.kicker.active = false;
        } else if (action == Action.downright) {
            this.applyForce(Unitvec.downright);
            this.kicker.active = false;
        } else if (action == Action.right) {
            this.applyForce(Unitvec.right);
            this.kicker.active = false;
        } else if (action == Action.upright) {
            this.applyForce(Unitvec.upright);
            this.kicker.active = false;
        } else if (action == Action.upshoot) {
            this.applyForce(Unitvec.up);
            this.kicker.active = true;
        } else if (action == Action.upleftshoot) {
            this.applyForce(Unitvec.upleft);
            this.kicker.active = true;
        } else if (action == Action.leftshoot) {
            this.applyForce(Unitvec.left);
            this.kicker.active = true;
        } else if (action == Action.downleftshoot) {
            this.applyForce(Unitvec.downleft);
            this.kicker.active = true;
        } else if (action == Action.downshoot) {
            this.applyForce(Unitvec.down);
            this.kicker.active = true;
        } else if (action == Action.downrightshoot) {
            this.applyForce(Unitvec.downright);
            this.kicker.active = true;
        } else if (action == Action.rightshoot) {
            this.applyForce(Unitvec.right);
            this.kicker.active = true;
        } else if (action == Action.uprightshoot) {
            this.applyForce(Unitvec.upright);
            this.kicker.active = true;
        } else if (action == Action.nomove) {
            this.kicker.active = false;
        } else if (action == Action.nomoveshoot) {
            this.kicker.active = true;
        }

    }

    update() {
        this.applyAction();
        if (this.kicker.active) {
            this.damping = this.kickDamping;
        } else {
            this.damping = this.nonkickDamping;
        }
        super.update();
    }

    draw() {
        super.draw();
        this.kicker.draw();
    }
}
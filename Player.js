class Player extends Disc {
    constructor(centerX, centerY, radius, mass, restitution, damping, kickDamping, kickPower, color) {
        super(centerX, centerY, radius, mass, restitution, damping, color);
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.kick = false;
        this.kickPast = false;
        this.nonkickDamping = damping;
        this.kickDamping = kickDamping;
        this.kicker = new Kicker(this, kickPower);

    }

    handleKeys() {

        //Handles pressed keys to set the state of player
        if (keys.ArrowUp === true) {
            this.up = true;
        } else {
            this.up = false;
        }
        if (keys.ArrowDown === true) {
            this.down = true;
        } else {
            this.down = false;
        }
        if (keys.ArrowLeft === true) {
            this.left = true;
        } else {
            this.left = false;
        }
        if (keys.ArrowRight === true) {
            this.right = true;
        } else {
            this.right = false;
        }
        if (keys.x === true) {
            if (this.kickPast === false) {
                this.kicker.active = true;
            }
            this.kickPast = true;
        } else {
            this.kicker.active = false;
            this.kickPast = false;
        }
    }

    applyKeyForces() {
        //Handles pressed keys to set the state of player

        let diagonal = (this.up ^ this.down) & (this.left ^ this.right);
        if (this.up === true) {
            this.applyForce(new Vector(0, -1).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }
        if (this.down === true) {
            this.applyForce(new Vector(0, 1).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }
        if (this.left === true) {
            this.applyForce(new Vector(-1, 0).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }
        if (this.right === true) {
            this.applyForce(new Vector(1, 0).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }

    }

    update() {
        this.handleKeys();
        this.applyKeyForces();
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
class Player extends Disc {
    constructor(centerX, centerY, radius, mass, restitution, damping, kickDamping, kickPower, color) {
        super(centerX, centerY, radius, mass, restitution, damping, color);
        console.log(centerX);

        this.upKey = "ArrowUp";
        this.downKey = "ArrowDown";
        this.leftKey = "ArrowLeft";
        this.rightKey = "ArrowRight";
        this.shootKey = "x";
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
        if (keys[this.upKey] === true) {
            this.up = true;
        } else {
            this.up = false;
        }
        if (keys[this.downKey] === true) {
            this.down = true;
        } else {
            this.down = false;
        }
        if (keys[this.leftKey] === true) {
            this.left = true;
        } else {
            this.left = false;
        }
        if (keys[this.rightKey] === true) {
            this.right = true;
        } else {
            this.right = false;
        }
        if (keys[this.shootKey] === true) {
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
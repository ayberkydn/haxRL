class Player extends CircularBody {
    constructor(initialLocationVec, radius, mass) {
        super(...arguments);
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.shooting = false;
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
            this.shooting = true;
        } else {
            this.shooting = false;
        }
    }

    applyKeyForces() {
        //Handles pressed keys to set the state of player

        let diagonal = (this.up ^ this.down) & (this.left ^ this.right);
        if (this.up === true) {
            this.applyForce(new Vector(0, -keyPower).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }
        if (this.down === true) {
            this.applyForce(new Vector(0, keyPower).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }
        if (this.left === true) {
            this.applyForce(new Vector(-keyPower, 0).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }
        if (this.right === true) {
            this.applyForce(new Vector(keyPower, 0).mult(diagonal ? 1 / Math.SQRT2 : 1));
        }

    }

    update() {
        this.handleKeys();
        this.applyKeyForces();
        super.update();
    }

    draw() {
        super.draw();
        if (this.shooting === true) {
            ctx.beginPath();
            ctx.arc(this.location.x, this.location.y, this.radius, 0, 2 * Math.PI);
            ctx.strokeStyle = "white";
            ctx.stroke();
        }
    }
}
class Body {
    constructor(centerX, centerY, restitution) {
        this.center = new Vector(centerX, centerY);
        this.restitution = restitution;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
    }

    applyForce() {}
    applyImpulse() {}
    update() {}
    draw() {}

}

class Border extends Body {
    constructor(centerX, centerY, restitution) {
        super(...arguments);
        this.center = new Vector(centerX, centerY);
        this.mass = Infinity;
        this.invMass = 0;
    }
    update() {}

}

class ArcBorder extends Border {
    constructor(centerX, centerY, startAngle, endAngle, radius) {
        super(centerX, centerY);
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.radius = radius;
    }
}

class HorizontalBorder extends Border {
    constructor(centerX, centerY, length, restitution) {
        super(centerX, centerY, restitution);
        this.length = length;
    }

    draw() {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        let startX = this.center.x - this.length / 2;
        let startY = this.center.y;
        let endX = this.center.x + this.length / 2;
        let endY = startY;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }


}

class VerticalBorder extends Border {
    constructor(centerX, centerY, length, restitution) {
        super(centerX, centerY, restitution);
        this.length = length;
    }

    draw() {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        let startX = this.center.x;
        let startY = this.center.y - this.length / 2;
        let endX = startX;
        let endY = this.center.y + this.length / 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

class Disc extends Body {
    constructor(centerX, centerY, radius, mass, restitution, damping, color) {
        super(centerX, centerY, restitution);
        this.radius = radius;
        this.mass = mass;
        this.invMass = 1 / this.mass;
        this.color = color;
        this.damping = damping;
    }

    applyForce(forceVec) {
        let accelerationDelta = Vector.div(forceVec, this.mass);
        this.acceleration.add(accelerationDelta);
    }

    applyImpulse(impulseVec) {
        let velocityDelta = Vector.div(impulseVec, this.mass);
        this.velocity.add(velocityDelta);
    }

    update() {
        this.center.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.mult(this.damping);
        this.acceleration.mult(0);
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius - 1, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}




class Player extends Disc {
    constructor(centerX, centerY, radius, mass, restitution, damping, color) {
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
        super.update();
    }

    draw() {
        super.draw();
        if (this.shooting === true) {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.radius - 1, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}


class Ball extends Disc {
    constructor(initialX, initialY, radius, mass) {
        super(...arguments, "white");
    }
}
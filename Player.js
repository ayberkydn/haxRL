class Player extends Disc {
    constructor(centerX, centerY, radius, mass, restitution, damping, kickDamping, kickPower, color) {
        super(centerX, centerY, radius, mass, restitution, damping, color);
        this.agent = null;
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
            this.applyForce(Vector.Unit.up);
            this.kicker.active = false;
        } else if (action == Action.upleft) {
            this.applyForce(Vector.Unit.upleft);
            this.kicker.active = false;
        } else if (action == Action.left) {
            this.applyForce(Vector.Unit.left);
            this.kicker.active = false;
        } else if (action == Action.downleft) {
            this.applyForce(Vector.Unit.downleft);
            this.kicker.active = false;
        } else if (action == Action.down) {
            this.applyForce(Vector.Unit.down);
            this.kicker.active = false;
        } else if (action == Action.downright) {
            this.applyForce(Vector.Unit.downright);
            this.kicker.active = false;
        } else if (action == Action.right) {
            this.applyForce(Vector.Unit.right);
            this.kicker.active = false;
        } else if (action == Action.upright) {
            this.applyForce(Vector.Unit.upright);
            this.kicker.active = false;
        } else if (action == Action.upshoot) {
            this.applyForce(Vector.Unit.up);
            this.kicker.active = true;
        } else if (action == Action.upleftshoot) {
            this.applyForce(Vector.Unit.upleft);
            this.kicker.active = true;
        } else if (action == Action.leftshoot) {
            this.applyForce(Vector.Unit.left);
            this.kicker.active = true;
        } else if (action == Action.downleftshoot) {
            this.applyForce(Vector.Unit.downleft);
            this.kicker.active = true;
        } else if (action == Action.downshoot) {
            this.applyForce(Vector.Unit.down);
            this.kicker.active = true;
        } else if (action == Action.downrightshoot) {
            this.applyForce(Vector.Unit.downright);
            this.kicker.active = true;
        } else if (action == Action.rightshoot) {
            this.applyForce(Vector.Unit.right);
            this.kicker.active = true;
        } else if (action == Action.uprightshoot) {
            this.applyForce(Vector.Unit.upright);
            this.kicker.active = true;
        } else if (action == Action.nomove) {
            this.kicker.active = false;
        } else if (action == Action.nomoveshoot) {
            this.kicker.active = true;
        }

    }



    applyActionHVS(actionH, actionV, actionS) {
        // TODO
        // HVS sirasında degilse exception yolla
        let diagonal = (actionH != ActionH.nomove) && (actionV != ActionV.nomove);
        let diagonalScale = diagonal ? Math.SQRT1_2 : 1;
        let shoot = (actionS == ActionS.shoot);

        if (actionH == ActionH.forward) {
            let forwardVec = this.agent.side == Side.red ? Vector.Unit.right : Vector.Unit.left;
            this.applyForce(Vector.mult(forwardVec, diagonalScale));
        } else if (actionH == ActionH.backward) {
            let backwardVec = this.agent.side == Side.red ? Vector.Unit.left : Vector.Unit.right;
            this.applyForce(Vector.mult(backwardVec, diagonalScale));
        }

        if (actionV == ActionV.up) {
            this.applyForce(Vector.mult(Vector.Unit.up, diagonalScale));
        } else if (actionV == ActionV.down) {
            this.applyForce(Vector.mult(Vector.Unit.down, diagonalScale));
        }

        if (actionS == ActionS.shoot) {
            this.kicker.activate();
        } else if (actionS == ActionS.nomove) {
            this.kicker.deactivate();
        }










    }


    update() {
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
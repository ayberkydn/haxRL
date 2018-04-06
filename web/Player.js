class Player extends Disc {
    constructor(centerX, centerY, radius, mass, restitution, damping, kickDamping, kickPower, color) {
        super(centerX, centerY, radius, mass, restitution, damping, color);
        this.agent = null;
        this.nonkickDamping = damping;
        this.kickDamping = kickDamping;
        this.kicker = new Kicker(this, kickPower);
    }

    applyAction(action) {
        if (action == Action.up) {
            this.applyForce(Vector.Unit.up);
            this.kicker.active = false;
        } else if (action == Action.upforward) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.upright : Vector.Unit.upleft);
            this.kicker.active = false;
        } else if (action == Action.forward) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.right : Vector.Unit.left);
            this.kicker.active = false;
        } else if (action == Action.downforward) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.downright : Vector.Unit.downleft);
            this.kicker.active = false;
        } else if (action == Action.down) {
            this.applyForce(Vector.Unit.down);
            this.kicker.active = false;
        } else if (action == Action.downbackward) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.downleft : Vector.Unit.downright);
            this.kicker.active = false;
        } else if (action == Action.backward) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.left : Vector.Unit.right);
            this.kicker.active = false;
        } else if (action == Action.upbackward) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.upleft : Vector.Unit.upright);
            this.kicker.active = false;
        } else if (action == Action.upshoot) {
            this.applyForce(Vector.Unit.up);
            this.kicker.active = true;
        } else if (action == Action.upforwardshoot) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.upright : Vector.Unit.upleft);
            this.kicker.active = true;
        } else if (action == Action.forwardshoot) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.right : Vector.Unit.left);
            this.kicker.active = true;
        } else if (action == Action.downforwardshoot) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.downright : Vector.Unit.downleft);
            this.kicker.active = true;
        } else if (action == Action.downshoot) {
            this.applyForce(Vector.Unit.down);
            this.kicker.active = true;
        } else if (action == Action.downbackwardshoot) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.downleft : Vector.Unit.downright);
            this.kicker.active = true;
        } else if (action == Action.backwardshoot) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.left : Vector.Unit.right);
            this.kicker.active = true;
        } else if (action == Action.upbackwardshoot) {
            this.applyForce(this.agent.side == Side.red ? Vector.Unit.upleft : Vector.Unit.upright);
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
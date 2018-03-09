class Agent {
    constructor(side) {
        this.side = side;
        let startX = (this.side == Side.red) ? 100 : canvas.width - 100;
        let color = (this.side == Side.red) ? Color.red : Color.blue;
        this.player = new Player(startX, canvas.height / 2, playerRadius, playerMass, playerRestitution, playerDamping, playerkickDamping, playerkickPower, color);
    }

    act() {}
    learn() {}
}

class RandomAgent extends Agent {
    constructor(side) {
        super(side);
    }

    act() {
        let actionIndex = Math.floor(Object.keys(Action).length * Math.random());
        let action = Object.values(Action)[actionIndex];
        this.player.applyAction(action);
    }
}

class HumanAgent extends Agent {
    constructor(side) {
        super(side);
        this.upKey = "ArrowUp";
        this.downKey = "ArrowDown";
        this.leftKey = "ArrowLeft";
        this.rightKey = "ArrowRight";
        this.shootKey = "x";
    }

    act() {

        let up = (keys[this.upKey]) ? true : false;
        let down = (keys[this.downKey]) ? true : false;
        let left = (keys[this.leftKey]) ? true : false;
        let right = (keys[this.rightKey]) ? true : false;
        let shoot = (keys[this.shootKey]) ? true : false;

        if (shoot) {
            if (up) {
                if (left) {
                    this.player.applyAction(Action.upleftshoot);
                } else if (right) {
                    this.player.applyAction(Action.uprightshoot);
                } else {
                    this.player.applyAction(Action.upshoot);
                }
            } else if (down) {
                if (left) {
                    this.player.applyAction(Action.downleftshoot);
                } else if (right) {
                    this.player.applyAction(Action.downrightshoot);
                } else {
                    this.player.applyAction(Action.downshoot);
                }
            } else {
                if (left) {
                    this.player.applyAction(Action.leftshoot);
                } else if (right) {
                    this.player.applyAction(Action.rightshoot);
                } else {
                    this.player.applyAction(Action.shoot);
                }
            }
        } else {
            if (up) {
                if (left) {
                    this.player.applyAction(Action.upleft);
                } else if (right) {
                    this.player.applyAction(Action.upright);
                } else {
                    this.player.applyAction(Action.up);
                }
            } else if (down) {
                if (left) {
                    this.player.applyAction(Action.downleft);
                } else if (right) {
                    this.player.applyAction(Action.downright);
                } else {
                    this.player.applyAction(Action.down);
                }
            } else {
                if (left) {
                    this.player.applyAction(Action.left);
                } else if (right) {
                    this.player.applyAction(Action.right);
                } else {
                    this.player.applyAction(Action.shoot);
                }
            }
        }

    }


}
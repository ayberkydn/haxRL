class HumanAgent extends Agent {
    constructor(side, upKey, downKey, leftKey, rightKey, shootKey) {
        super(side);
        this.upKey = upKey;
        this.downKey = downKey;
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.shootKey = shootKey;
    }

    act() {

        let up = (keys[this.upKey]) ? true : false;
        let down = (keys[this.downKey]) ? true : false;
        let left = (keys[this.leftKey]) ? true : false;
        let right = (keys[this.rightKey]) ? true : false;
        let shoot = (keys[this.shootKey]) ? true : false;
        this.shoot = shoot & !this.pastShoot;

        let actionH = ActionH.nomove;
        if (left) {
            actionH = ActionH.left;
        } else if (right) {
            actionH = ActionH.right;
        }

        let actionV = ActionV.nomove;
        if (up) {
            actionV = ActionV.up;
        } else if (down) {
            actionV = ActionV.down;
        }

        let actionS = ActionS.nomove;
        if (this.shoot) {
            actionS = ActionS.shoot;
        }

        this.player.applyActionTrio(actionH, actionV, actionS);
        this.pastShoot = shoot;

        /*
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
                    this.player.applyAction(Action.nomoveshoot);
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
                    this.player.applyAction(Action.nomove);
                }
            }
        }
*/
    }


}
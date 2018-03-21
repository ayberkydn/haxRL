class Agent {
    constructor() {
        this.side = null;
        this.env = null;
        this.goal = null;
        this.ball = null;
        this.player = null;
        this.opponent = null;
    }

    setSide(side) {
        this.side = side;
        let startX = (side == Side.red) ? 120 : cWidth - 120;
        let color = (side == Side.red) ? Color.red : Color.blue;
        this.player = new Player(startX, cHeight / 2, playerRadius, playerMass, playerRestitution, playerDamping, playerkickDamping, playerkickPower, color);
        this.player.agent = this;
        this.goal = this.env.scene.metaObjects.goals[side == Side.red ? 0 : 1];
        this.forwardVec = side == Side.red ? Vector.Unit.right : Vector.Unit.left;
        this.upVec = Vector.Unit.up;
    }

    act() {}
    learn() {}
}
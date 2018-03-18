class Agent {
    constructor() {
        this.side = null;
        this.game = null;
        this.goal = null;
        this.ball = null;
        this.player = null;
        this.opponent = null;
    }

    setSide(side) {
        this.side = side;
        let startX = (side == Side.red) ? 120 : canvas.width - 120;
        let color = (side == Side.red) ? Color.red : Color.blue;
        this.player = new Player(startX, canvas.height / 2, playerRadius, playerMass, playerRestitution, playerDamping, playerkickDamping, playerkickPower, color);
        this.player.agent = this;
    }

    act() {}
    learn() {}
}
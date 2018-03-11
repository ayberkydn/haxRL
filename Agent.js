class Agent {
    constructor(side) {
        this.side = side;
        let startX = (this.side == Side.red) ? 120 : canvas.width - 120;
        let color = (this.side == Side.red) ? Color.red : Color.blue;
        this.player = new Player(startX, canvas.height / 2, playerRadius, playerMass, playerRestitution, playerDamping, playerkickDamping, playerkickPower, color);
    }

    act() {}
    learn() {}
}
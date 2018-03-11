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
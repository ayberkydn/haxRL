class Agent {
    constructor(side) {
        this.side = side;
        let startX = (this.side == Side.red) ? 120 : canvas.width - 120;
        let color = (this.side == Side.red) ? Color.red : Color.blue;
        this.player = new Player(startX, canvas.height / 2, playerRadius, playerMass, playerRestitution, playerDamping, playerkickDamping, playerkickPower, color);
        this.game = null;
    }

    act() {}
    actRandom() {
        let actionHIndex = Math.floor(Object.keys(ActionH).length * Math.random());
        let actionH = Object.values(ActionH)[actionHIndex];

        let actionVIndex = Math.floor(Object.keys(ActionV).length * Math.random());
        let actionV = Object.values(ActionV)[actionVIndex];

        let actionSIndex = Math.floor(Object.keys(ActionS).length * Math.random());
        let actionS = Object.values(ActionS)[actionSIndex];


        this.player.applyActionTrio(actionH, actionV, actionS);

    }
    learn() {}
}
class RandomAgent extends Agent {
    constructor(side) {
        super(side);
    }

    act() {

        let actionHIndex = Math.floor(Object.keys(ActionH).length * Math.random());
        let actionH = Object.values(ActionH)[actionHIndex];

        let actionVIndex = Math.floor(Object.keys(ActionV).length * Math.random());
        let actionV = Object.values(ActionV)[actionVIndex];

        let actionSIndex = Math.floor(Object.keys(ActionS).length * Math.random());
        let actionS = Object.values(ActionS)[actionSIndex];

        this.player.applyActionHVS(actionH, actionV, actionS);

    }

}
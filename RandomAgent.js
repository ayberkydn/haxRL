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
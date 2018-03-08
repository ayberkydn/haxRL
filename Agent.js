class Agent {
    constructor(side) {
        this.actions = {
            up: "up",
            upleft: "upleft",
            left: "left",
            downleft: "downleft",
            down: "down",
            downright: "downright",
            right: "right",
            upright: "upright",
            upshoot: "up",
            upleftshoot: "upleftshoot",
            leftshoot: "leftshoot",
            downleftshoot: "downleftshoot",
            downshoot: "downshoot",
            downrightshoot: "downrightshoot",
            rightshoot: "rightshoot",
            uprightshoot: "uprightshoot",
            nomove: "nomove",
            nomoveshoot: "nomoveshoot",
        };

        this.side = side;
    }

    act() {}
    learn() {}
}

class RandomAgent {
    constructor(side) {
        super(side);
    }

    act() {
        //TODO
        //select random action and apply on player
    }
}

class HumanAgent {
    constructor(side) {
        super(side);
    }
}
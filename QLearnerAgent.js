class QLearnerAgent extends Agent {
    constructor(side) {
        super(side);
        this.experienceReplay = new ExperienceReplay(100);
        this.modelH = new NeuralNetwork(6, 20, 3).setLoss("mse");
        this.modelV = new NeuralNetwork(6, 20, 3).setLoss("mse");
        this.modelS = new NeuralNetwork(6, 20, 2).setLoss("mse");
        this.discount = 0.99;
        this.epsilon = 0.8; //normalde kucuk
        this.sars = {};
    }


    act() {
        this.sars.s = this.getStateInfo();
        let actionHIndex = this.modelH.predict(this.sars.s);
        let actionH = Object.values(ActionH)[actionHIndex];

        let actionVIndex = this.modelV.predict(this.sars.s);
        let actionV = Object.values(ActionV)[actionVIndex];

        let actionSIndex = this.modelS.predict(this.sars.s);
        let actionS = Object.values(ActionS)[actionSIndex];
        this.sars.a = {
            aH: actionHIndex,
            aV: actionVIndex,
            aS: actionSIndex
        };
        this.player.applyActionTrio(actionH, actionV, actionS);

    }

    getStateInfo() {
        return ([
            this.game.scene.metaObjects.balls[0].center.x,
            this.game.scene.metaObjects.balls[0].center.y,
            this.game.scene.metaObjects.players[0].center.x,
            this.game.scene.metaObjects.players[0].center.y,
            this.game.scene.metaObjects.players[1].center.x,
            this.game.scene.metaObjects.players[1].center.y,
        ]);
    }

    getReward() {
        let distToBall = Vector.dist(this.player.center, this.game.scene.metaObjects.balls[0].center);
        if (distToBall < 100) {
            return 1;
        } else {
            return -1;
        }
    }

    learn() {
        this.sars.r = this.getReward();
        console.log(this.sars.r);
        this.sars.ss = this.getStateInfo();
        this.experienceReplay.addExperience(this.sars);
        let exp = this.experienceReplay.sampleExperience();
        let {
            s,
            a,
            r,
            ss
        } = exp;

        let {
            aH,
            aV,
            aS,
        } = a;

        let yH = r + this.discount * this.modelH.predict(ss, true);
        let targetH = this.modelH.forward(s).dataSync();
        targetH[aH] = yH;
        this.modelH.trainStep(s, targetH);

        let yV = r + this.discount * this.modelV.predict(ss, true);
        let targetV = this.modelV.forward(s).dataSync();
        targetV[aV] = yV;
        this.modelV.trainStep(s, targetV);

        let yS = r + this.discount * this.modelS.predict(ss, true);
        let targetS = this.modelS.forward(s).dataSync();
        targetS[aS] = yS;
        this.modelS.trainStep(s, targetS);

    }

}
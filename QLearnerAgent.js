class QLearnerAgent extends Agent {
    constructor() {
        super();
        this.experienceReplay = new ExperienceReplay(100);
        this.brainH = new NeuralNetwork(6, 20, 3).setLoss("mse");
        this.brainV = new NeuralNetwork(6, 20, 3).setLoss("mse");
        this.brainS = new NeuralNetwork(6, 20, 2).setLoss("mse");
        this.discount = 0.9999;
        this.sars = {};
    }


    act() {
        this.sars.s = this.getStateInfo();
        let actionHIndex = this.brainH.predict(this.sars.s);
        let actionH = Object.values(ActionH)[actionHIndex];

        let actionVIndex = this.brainV.predict(this.sars.s);
        let actionV = Object.values(ActionV)[actionVIndex];

        let actionSIndex = this.brainS.predict(this.sars.s);
        let actionS = Object.values(ActionS)[actionSIndex];
        this.sars.a = {
            aH: actionHIndex,
            aV: actionVIndex,
            aS: actionSIndex
        };
        this.player.applyActionHVS(actionH, actionV, actionS);

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

    getReward(s, a, ss) {
        let sBallPosition = new Vector(s[0], s[1]);
        let sAgentPosition = new Vector(s[4], s[5]);
        let sDiff = Vector.dist(sBallPosition, sAgentPosition);
        let ssBallPosition = new Vector(ss[0], ss[1]);
        let ssAgentPosition = new Vector(ss[4], ss[5]);
        let ssDiff = Vector.dist(ssBallPosition, ssAgentPosition);
        let gotCloser = ssDiff < sDiff;
        return (gotCloser ? 1 : -1);

    }

    learn() {
        this.sars.ss = this.getStateInfo();
        this.sars.r = this.getReward(this.sars.s, this.sars.a, this.sars.ss);
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

        let yH = r + this.discount * this.brainH.predict(ss, true);
        let targetH = this.brainH.forward(s).dataSync();
        targetH[aH] = yH;
        this.brainH.trainStep(s, targetH);

        let yV = r + this.discount * this.brainV.predict(ss, true);
        let targetV = this.brainV.forward(s).dataSync();
        targetV[aV] = yV;
        this.brainV.trainStep(s, targetV);

        let yS = r + this.discount * this.brainS.predict(ss, true);
        let targetS = this.brainS.forward(s).dataSync();
        targetS[aS] = yS;
        this.brainS.trainStep(s, targetS);

    }

}

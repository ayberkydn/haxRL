class NNQLearnerAgent extends Agent {
    constructor() {
        super();
        this.experienceReplay = new ExperienceReplay(10000000);
        this.brainH = new NeuralNetwork(2, 20, 3).setLoss("mse");
        this.brainV = new NeuralNetwork(2, 20, 3).setLoss("mse");
        this.brainS = new NeuralNetwork(2, 20, 2).setLoss("mse");
        this.discount = 0.999;
        this.sars = {};

    }


    act() {
        this.sars.s = this.getStateInfo();
        let actionHIndex = this.brainH.predict(this.sars.s);
        let actionH = Object.values(ActionH)[actionHIndex];

        let actionVIndex = this.brainV.predict(this.sars.s);
        let actionV = Object.values(ActionV)[2];

        let actionSIndex = this.brainS.predict(this.sars.s);
        let actionS = Object.values(ActionS)[1];
        this.sars.a = {
            aH: actionHIndex,
            aV: actionVIndex,
            aS: actionSIndex
        };
        this.player.applyActionHVS(actionH, actionV, actionS);

    }

    getStateInfo() {
        return ([
            this.ball.center.x / 800,
            this.player.center.x / 800,
        ]);
    }

    getReward(s, a, ss) {
        let sDist = Math.abs(s[0] - s[1]);
        let ssDist = Math.abs(ss[0] - ss[1]);
        let soClose = ssDist < 0.1;
        console.log(soClose ? 1 : -1);
        return (soClose ? 1 : -1);

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
        if (this.env.state.episodeEnd) {
            console.log("yesended");
            yH = r;
        }
        let targetH = this.brainH.forward(s).dataSync();
        targetH[aH] = yH;
        this.brainH.trainStep(s, targetH);
        /*
                let yV = r + this.discount * this.brainV.predict(ss, true);
                let targetV = this.brainV.forward(s).dataSync();
                targetV[aV] = yV;
                this.brainV.trainStep(s, targetV);

                let yS = r + this.discount * this.brainS.predict(ss, true);
                let targetS = this.brainS.forward(s).dataSync();
                targetS[aS] = yS;
                this.brainS.trainStep(s, targetS);
        */
    }

}
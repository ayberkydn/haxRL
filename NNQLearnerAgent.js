class NNQLearnerAgent extends Agent {
    constructor() {
        super();
        this.experienceReplay = new ExperienceReplay(100000, 100);
        let stateDim = 4;
        let hiddenSize = 200;
        this.brain = new NeuralNetwork(stateDim, hiddenSize, 9).setLoss("mse");
        this.targetBrain = new NeuralNetwork(stateDim, hiddenSize, 9).setLoss("mse");
        this.targetBrain.copyWeightsFrom(this.brain);

        this.discount = 0.995;
        this.lastSARST = {};
        this.actionRepeat = 5;
        this.targetUpdateFreq = 10;
        this.epsilon = 0.1;

        this.repeatCooldown = 0;
        this.targetUpdateCooldown = 0;
        this.lastAction = null;

    }


    act() {
        if (this.repeatCooldown > 0) { //repeat action
            this.repeatCooldown--;
            this.player.applyAction(this.lastAction);
        } else { //select new action
            this.repeatCooldown = this.actionRepeat;
            this.lastSARST.s = this.getStateInfo();

            let actionIndex;
            if (Math.random() < this.epsilon) {
                actionIndex = Math.floor(Math.random() * 9);
            } else {
                actionIndex = this.brain.predict(this.lastSARST.s)[0];
            }
            let action = Object.values(Action)[actionIndex];
            this.lastSARST.a = actionIndex;
            this.player.applyAction(action);
            this.lastAction = action;
        }
    }

    getStateInfo() {
        return ([
            this.ball.center.x,
            this.ball.center.y,
            this.player.center.x,
            this.player.center.y,
        ]);
    }

    isTerminated() {
        return this.env.step < this.actionRepeat;
    }

    getReward(s, a, ss) {
        let sBallPos = new Vector(s[0], s[1]);
        let sPlayerPos = new Vector(s[2], s[3]);

        let ssBallPos = new Vector(ss[0], ss[1]);
        let ssPlayerPos = new Vector(ss[2], ss[3]);

        let sDist = Vector.dist(sPlayerPos, sBallPos);
        let ssDist = Vector.dist(ssPlayerPos, ssBallPos);

        let ballVelocity = -Vector.sub(ssBallPos, sBallPos).x;
        let ballToLeft = ballVelocity > 0.5;
        let closing = ssDist < sDist - 0.5;
        let close = ssDist < 100;
        let reward = close ? 1 : -1;

        return reward;


    }

    learn() {
        if (this.repeatCooldown == 0) { //means new action to be made
            this.lastSARST.ss = this.getStateInfo();
            this.lastSARST.t = this.isTerminated();
            this.lastSARST.r = this.getReward(this.lastSARST.s, this.lastSARST.a, this.lastSARST.ss);
            this.experienceReplay.addExperience(this.lastSARST);
            let batchSize = 64;
            let expBatch = this.experienceReplay.sampleExperience(batchSize);

            if (expBatch) {
                let {
                    sBatch,
                    aBatch,
                    rBatch,
                    ssBatch,
                    tBatch,
                } = expBatch;
                let ssMaxQBatch = this.targetBrain.predict(ssBatch, true);

                let yBatch = Object.assign([], rBatch);
                for (let n = 0; n < aBatch.length; n++) {
                    if (tBatch[n] == false) { //Nonterminal state
                        yBatch[n] += this.discount * ssMaxQBatch[n];
                    }
                }

                let targetBatch = this.brain.forward(sBatch);

                for (let n = 0; n < aBatch.length; n++) {
                    targetBatch[n][aBatch[n]] = yBatch[n];
                }

                let prev = this.brain.W1.clone();
                this.brain.trainStep(sBatch, targetBatch);
                let after = this.brain.W1.clone();

                if (this.targetUpdateCooldown == 0) {
                    this.targetBrain.copyWeightsFrom(this.brain);
                    this.targetUpdateCooldown = this.targetUpdateFreq;
                } else {
                    this.targetUpdateCooldown--;
                }
            }
        }
    }
}
class DQNAgent extends Agent {
    constructor() {
        super();
        this.experienceReplay = new ExperienceReplay(100000, 200);
        this.actionSpace = 16;
        this.scaleH = 0.2;
        this.scaleW = 0.2;
        this.stateShape = [cHeight * this.scaleH, cWidth * this.scaleW, 3];



        this.DQN = new NeuralNetwork()
            .addLayer(new ConvLayer([3, 3], 4, 1, "valid", dl.relu, this.stateShape))
            .addLayer(new PoolingLayer([2, 2], "max", "valid"))
            .addLayer(new ConvLayer([3, 3], 8, 1, "valid", dl.relu))
            .addLayer(new PoolingLayer([2, 2], "max", "valid"))
            .addLayer(new ConvLayer([3, 3], 16, 1, "valid", dl.relu))
            .addLayer(new PoolingLayer([2, 2], "max", "valid"))
            .addLayer(new ConvLayer([3, 3], 32, 1, "valid", dl.relu))
            .addLayer(new PoolingLayer([2, 2], "max", "valid"))
            .addLayer(new FlattenLayer())
            .addLayer(new DenseLayer(500))
            .addLayer(new DenseLayer(500))
            .addLayer(new DenseLayer(this.actionSpace))
            .setLoss("mse")
            .setOptimizer(dl.train.rmsprop(0.00025, 0.95, 0.95, 0.01));

        this.targetDQN = new NeuralNetwork()
            .addLayer(new ConvLayer([3, 3], 4, 1, "valid", dl.relu, this.stateShape))
            .addLayer(new PoolingLayer([2, 2], "max", "valid"))
            .addLayer(new ConvLayer([3, 3], 8, 1, "valid", dl.relu))
            .addLayer(new PoolingLayer([2, 2], "max", "valid"))
            .addLayer(new ConvLayer([3, 3], 16, 1, "valid", dl.relu))
            .addLayer(new PoolingLayer([2, 2], "max", "valid"))
            .addLayer(new ConvLayer([3, 3], 32, 1, "valid", dl.relu))
            .addLayer(new PoolingLayer([2, 2], "max", "valid"))
            .addLayer(new FlattenLayer())
            .addLayer(new DenseLayer(500))
            .addLayer(new DenseLayer(500))
            .addLayer(new DenseLayer(this.actionSpace))
            .copyWeightsFrom(this.DQN);



        this.discount = 0.95; //when reward is continuous low discount is better IMO
        this.lastSiASSiiR = {};
        this.actionRepeat = 4;
        this.targetUpdateFreq = 50;
        this.epsilon = 1; //start as 1, linearly anneal to 0.1
        this.learnStep = 0;
        this.repeatCooldown = 0;
        this.targetUpdateCooldown = 0;
        this.lastAction = null; //for action repeat
    }


    act() {
        if (this.repeatCooldown > 0) { //repeat action
            this.repeatCooldown--;
            this.player.applyAction(this.lastAction);

        } else { //select new action
            this.repeatCooldown = this.actionRepeat;
            this.lastSiASSiiR.s = this.getState();
            this.lastSiASSiiR.i = this.getStateInfo();
            console.log(this.DQN.forward(this.lastSiASSiiR.s)[0].map(x => x.toFixed(2)));

        }

        let actionIndex;
        if (Math.random() < this.epsilon) {
            actionIndex = Math.floor(Math.random() * this.actionSpace);
        } else {
            actionIndex = this.DQN.predict(this.lastSiASSiiR.s)[0];
        }
        let action = Object.values(Action)[actionIndex];
        this.lastSiASSiiR.a = actionIndex;
        this.player.applyAction(action);
        this.lastAction = action;
    }


    learn() {
        if (this.repeatCooldown == 0 || this.episodeTerminated()) { //means new action to be made or terminal state is reached
            this.lastSiASSiiR.ss = this.getState();
            this.lastSiASSiiR.ii = this.getStateInfo();
            this.lastSiASSiiR.r = this.getReward(this.lastSiASSiiR.s, this.lastSiASSiiR.i, this.lastSiASSiiR.a, this.lastSiASSiiR.ss, this.lastSiASSiiR.ii);
            this.experienceReplay.addExperience(this.lastSiASSiiR);
            let batchSize = 32;
            let expBatch = this.experienceReplay.sampleExperience(batchSize);

            if (expBatch) {
                let {
                    sBatch,
                    iBatch,
                    aBatch,
                    ssBatch,
                    iiBatch,
                    rBatch,
                } = expBatch;

                let ssMaxQBatch = this.targetDQN.predict(ssBatch, true);

                let yBatch = Object.assign([], rBatch);
                for (let n = 0; n < aBatch.length; n++) {
                    if (iiBatch[n].terminalState == false) { //Nonterminal state
                        yBatch[n] += this.discount * ssMaxQBatch[n];
                    }
                }
                let targetBatch = this.DQN.forward(sBatch);

                for (let n = 0; n < aBatch.length; n++) {
                    targetBatch[n][aBatch[n]] = yBatch[n];
                }

                this.DQN.trainStep(sBatch, targetBatch);
                this.learnStep++;
                if (this.epsilon > 0) {
                    this.epsilon -= 0.00001;
                } else {
                    this.epsilon = 0;
                }

                if (this.targetUpdateCooldown == 0) {
                    this.targetDQN.copyWeightsFrom(this.DQN);
                    this.targetUpdateCooldown = this.targetUpdateFreq;
                } else {
                    this.targetUpdateCooldown--;
                }
            }
        }
    }
    getState() {
        var stateImg = ctx.getImageData(0, 0, this.stateShape[1], this.stateShape[0]);
        return stateImg;

    }

    getStateInfo() {
        return {
            terminalState: this.episodeTerminated(),
            playerLocation: this.player.center,
            playerVelocity: this.player.velocity,
            opponentLocation: this.opponent.player.center,
            opponentVelocity: this.opponent.player.velocity,
            ballLocation: this.ball.center,
            ballVelocity: this.ball.velocity,
        };
    }

    episodeTerminated() {
        return this.env.episodeEnd;
    }

    getReward(s, i, a, ss, ii) {

        let selfGoal = ii.ballLocation.x > cWidth - leftrightMargin;
        let ballBack = ii.ballVelocity.x > 0.1;
        console.log("selfgoal", selfGoal);
        console.log("ballback", ballBack);
        if (selfGoal) {
            return 100;
        } else if (ballBack) {
            return 1;
        } else {
            return -1;
        }

    }
}
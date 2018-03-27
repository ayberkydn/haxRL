class DQNAgent extends Agent {
    constructor() {
        super();
        this.actionSpace = 4;
        this.scaleH = scaleH;
        this.scaleW = scaleW;
        this.stateShape = [Math.floor(cHeight * this.scaleH), Math.floor(cWidth * this.scaleW), 1];



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
            .addLayer(new DenseLayer(512, dl.relu))
            .addLayer(new DenseLayer(this.actionSpace))
            .setLoss("mse")
            .setOptimizer(dl.train.adam(0.001))
            .summary();

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
            .addLayer(new DenseLayer(512, dl.relu))
            .addLayer(new DenseLayer(this.actionSpace))
            .copyWeightsFrom(this.DQN);


        this.experienceReplayCapacity = 10000;
        this.experienceReplay = new ExperienceReplay(this.experienceReplayCapacity, 100);
        this.discount = 0.25; //when reward is continuous low discount is better IMO
        this.lastSiASSiiR = {};
        this.actionRepeat = 4;
        this.targetUpdateFreq = 500;
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


            let actionIndex;
            if (Math.random() < this.epsilon) {
                actionIndex = Math.floor(Math.random() * this.actionSpace);
            } else {
                actionIndex = this.DQN.predict(this.lastSiASSiiR.s)[0];
                console.log(softmax(this.DQN.forward(this.lastSiASSiiR.s)[0]).map(x => x.toFixed(2)));
            }
            let action = Object.values(Action)[actionIndex];
            this.lastSiASSiiR.a = actionIndex;
            this.player.applyAction(action);
            this.lastAction = action;
        }
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
                if (this.epsilon > 0.001) {
                    this.epsilon -= 0.00003;
                } else {
                    this.epsilon = 0.001;
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
        var stateImg = sampleImageFrom(canvas, 0, [this.scaleH, this.scaleW]);
        drawImageTensor(stateImg, canvas2, false);
        return stateImg;

    }

    getStateInfo() {
        return {
            terminalState: this.episodeTerminated(),
            playerLocation: this.player.center.copy(),
            playerVelocity: this.player.velocity.copy(),
            opponentLocation: this.opponent.player.center.copy(),
            opponentVelocity: this.opponent.player.velocity.copy(),
            ballLocation: this.ball.center.copy(),
            ballVelocity: this.ball.velocity.copy(),
        };
    }

    episodeTerminated() {
        return this.env.episodeEnd;
    }

    getReward(s, i, a, ss, ii) {

        let goal = ii.ballLocation.x < leftrightMargin;
        let ballFwd = ii.ballVelocity.x < -0.5;
        let getCloserToBall = Vector.dist(ii.playerLocation, ii.ballLocation) + 1 < Vector.dist(i.playerLocation, i.ballLocation);
        let reward = -1;
        if (goal) {
            reward = 100;
        } else if (ballFwd || getCloserToBall) {
            reward = 1;
        }

        console.log("reward", reward);
        return reward;

    }
}
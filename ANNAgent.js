class ANNAgent extends Agent {
    constructor() {
        super();
        this.actionSpace = 4;
        this.scaleH = scaleH;
        this.scaleW = scaleW;
        this.stateShape = 12;



        this.ANN = new NeuralNetwork(this.stateShape)
            .addLayer(new DenseLayer(200))
            .addLayer(new ActivationLayer(dl.relu))
            .addLayer(new DenseLayer(200))
            .addLayer(new ActivationLayer(dl.relu))
            .addLayer(new DenseLayer(200))
            .addLayer(new ActivationLayer(dl.relu))
            .addLayer(new DenseLayer(this.actionSpace))
            .setLoss("mse")
            .setOptimizer(dl.train.adam(0.01))
            .summary();

        this.targetANN = new NeuralNetwork(this.stateShape)
            .addLayer(new DenseLayer(200))
            .addLayer(new ActivationLayer(dl.relu))
            .addLayer(new DenseLayer(200))
            .addLayer(new ActivationLayer(dl.relu))
            .addLayer(new DenseLayer(200))
            .addLayer(new ActivationLayer(dl.relu))
            .addLayer(new DenseLayer(this.actionSpace))
            .copyWeightsFrom(this.ANN);


        this.experienceReplayCapacity = 10000;
        this.experienceReplayStarting = 500;
        this.batchSize = 32;
        this.experienceReplay = new ExperienceReplay(this.experienceReplayCapacity, this.experienceReplayStarting);
        this.discount = 0.95; //when reward is continuous low discount is better IMO
        this.lastSiASSiiR = {};
        this.actionRepeat = 4;
        this.targetUpdateFreq = this.experienceReplayStarting;
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
            console.log((this.ANN.forward([this.lastSiASSiiR.s])[0]).map(x => x.toFixed(2)));


            let actionIndex;
            if (Math.random() < this.epsilon) {
                actionIndex = Math.floor(Math.random() * this.actionSpace);
            } else {
                actionIndex = this.ANN.predict(this.lastSiASSiiR.s)[0];
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

            let expBatch = this.experienceReplay.sampleExperience(this.batchSize);
            if (expBatch) {
                let {
                    sBatch,
                    iBatch,
                    aBatch,
                    ssBatch,
                    iiBatch,
                    rBatch,
                } = expBatch;


                let ssMaxQBatchIndex = this.targetANN.predict(ssBatch, false);
                let ssMaxQBatchValues = this.targetANN.forward(ssBatch);
                let ssMaxQBatch = [];
                for (let n = 0; n < ssMaxQBatchIndex.length; n++) {
                    ssMaxQBatch.push(ssMaxQBatchValues[n][ssMaxQBatchIndex[n]]);
                }

                let yBatch = Object.assign([], rBatch);


                for (let n = 0; n < aBatch.length; n++) {
                    if (iiBatch[n].terminalState == false) { //Nonterminal state
                        yBatch[n] += this.discount * ssMaxQBatch[n];
                    }
                }
                let targetBatch = this.ANN.forward(sBatch);

                for (let n = 0; n < aBatch.length; n++) {
                    targetBatch[n][aBatch[n]] = yBatch[n];
                }

                // console.log("-------------------------")
                // console.log("state values", this.ANN.forward(sBatch)[0]);
                // console.log("next state values", ssMaxQBatchValues[0]);
                // console.log("next state max index", ssMaxQBatchIndex[0]);
                // console.log("next state max value", ssMaxQBatch[0])
                // console.log("discount", this.discount)
                // console.log("next state max * discount", ssMaxQBatch[0] * this.discount)
                // console.log("reward", rBatch[0]);
                // console.log("target value", rBatch[0] + this.discount * ssMaxQBatch[0])
                // console.log("chosen action", aBatch[0]);
                // console.log("target actions", targetBatch[0]);
                // console.log("state values after train", this.ANN.forward(sBatch)[0])
                // console.log("-------------------------")


                this.ANN.trainStep(sBatch, targetBatch);


                this.learnStep++;
                if (this.epsilon > 0.001) {
                    this.epsilon -= 0.0001;
                } else {
                    this.epsilon = 0.001;
                }

                if (this.targetUpdateCooldown == 0) {
                    this.targetANN.copyWeightsFrom(this.ANN);
                    this.targetUpdateCooldown = this.targetUpdateFreq;
                } else {
                    this.targetUpdateCooldown--;
                }
            }
        }
    }
    getState() {
        let sInfo = this.getStateInfo();
        let center = Vector.add(this.goal.center, this.opponent.goal.center).div(2);
        let fwdNormFact = 1 / (cWidth / 2 - leftrightMargin);
        let upNormFact = 1 / (cHeight / 2 - topbottomMargin);
        let velNormFact = 0.2;

        let playerRelLoc = Vector.sub(sInfo.playerLocation, center);
        let opponentRelLoc = Vector.sub(sInfo.opponentLocation, center);
        let ballRelLoc = Vector.sub(sInfo.ballLocation, center);

        let playerRelForward = Vector.dot(playerRelLoc, this.forwardVec) * fwdNormFact;
        let playerRelUp = Vector.dot(playerRelLoc, this.upVec) * upNormFact;

        let opponentRelForward = Vector.dot(opponentRelLoc, this.forwardVec) * fwdNormFact;
        let opponentRelUp = Vector.dot(opponentRelLoc, this.upVec) * upNormFact;

        let ballRelForward = Vector.dot(ballRelLoc, this.forwardVec) * fwdNormFact;
        let ballRelUp = Vector.dot(ballRelLoc, this.upVec) * upNormFact;

        let playerVelForward = Vector.dot(sInfo.playerVelocity, this.forwardVec) * velNormFact;
        let playerVelUp = Vector.dot(sInfo.playerVelocity, this.upVec) * velNormFact;

        let opponentVelForward = Vector.dot(sInfo.opponentVelocity, this.forwardVec) * velNormFact;
        let opponentVelUp = Vector.dot(sInfo.opponentVelocity, this.upVec) * velNormFact;

        let ballVelForward = Vector.dot(sInfo.ballVelocity, this.forwardVec) * velNormFact;
        let ballVelUp = Vector.dot(sInfo.ballVelocity, this.upVec) * velNormFact;

        //console.log([playerRelForward, playerRelUp, opponentRelForward, opponentRelUp, ballRelForward, ballRelUp, playerVelForward, playerVelUp, opponentVelForward, opponentVelUp, ballVelForward, ballVelUp].map(x => x.toFixed(2)));
        return [playerRelForward, playerRelUp, opponentRelForward, opponentRelUp, ballRelForward, ballRelUp, playerVelForward, playerVelUp, opponentVelForward, opponentVelUp, ballVelForward, ballVelUp];

    }

    getStateInfo() {
        return {
            terminalState: this.episodeTerminated(),
            playerLocation: this.player.center.copy(),
            opponentLocation: this.opponent.player.center.copy(),
            ballLocation: this.ball.center.copy(),
            playerVelocity: this.player.velocity.copy(),
            opponentVelocity: this.opponent.player.velocity.copy(),
            ballVelocity: this.ball.velocity.copy(),
        };
    }

    episodeTerminated() {
        return this.env.episodeEnd;
    }

    getReward(s, i, a, ss, ii) {

        let goal = ss[4] > 1;
        let ballFwd = ss[10] > 0.2;
        let reward;
        if (goal) {
            reward = 1000;
        } else if (ballFwd) {
            reward = 5;
        } else {
            reward = -1;
        }
        return reward;

    }
}
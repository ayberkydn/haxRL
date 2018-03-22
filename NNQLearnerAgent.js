class NNQLearnerAgent extends Agent {
    constructor() {
        super();
        this.experienceReplay = new ExperienceReplay(10000, 100);
        this.stateDim = 12;
        let hiddenSize = 200;
        this.actionSpace = 16;
        this.learningRate = 0.01;
        this.brain = new NeuralNetwork([this.stateDim, hiddenSize, hiddenSize, this.actionSpace]).setLoss("mse").setActivation(dl.tanh).setOptimizer(dl.train.sgd(this.learningRate));
        this.targetBrain = new NeuralNetwork([this.stateDim, hiddenSize, hiddenSize, this.actionSpace]).setLoss("mse").setActivation(dl.tanh);
        this.targetBrain.copyWeightsFrom(this.brain);

        this.discount = 0.85; //when reward is continuous low discount is better IMO
        this.lastSARST = {};
        this.actionRepeat = 4;
        this.targetUpdateFreq = 100;
        this.epsilon = 0.15;
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
            this.lastSARST.s = this.getStateInfo();
           
            console.log(this.brain.forward(this.lastSARST.s)[0].map(x => x.toFixed(2)));
           
            let actionIndex;
            if (Math.random() < this.epsilon) {
                actionIndex = Math.floor(Math.random() * this.actionSpace);
            } else {
                actionIndex = this.brain.predict(this.lastSARST.s)[0];
            }
            let action = Object.values(Action)[actionIndex];
            this.lastSARST.a = actionIndex;
            this.player.applyAction(action);
            this.lastAction = action;
        }
    }

    learn() {
        if (this.repeatCooldown == 0 || this.episodeTerminated()) { //means new action to be made
            this.lastSARST.ss = this.getStateInfo();
            this.lastSARST.t = this.episodeTerminated();
            this.lastSARST.r = this.getReward(this.lastSARST.s, this.lastSARST.a, this.lastSARST.ss);
            console.log(this.lastSARST.r)
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

                this.brain.trainStep(sBatch, targetBatch);

                if (this.targetUpdateCooldown == 0) {
                    this.targetBrain.copyWeightsFrom(this.brain);
                    this.targetUpdateCooldown = this.targetUpdateFreq;
                } else {
                    this.targetUpdateCooldown--;
                }
            }
        }
    }
    getStateInfo() {
        let envCenter = this.env.scene.metaObjects.centers[0];
        let horizontalNormalizer = cWidth / 2 - leftrightMargin;
        let verticalNormalizer = cHeight / 2 - topbottomMargin;

        let playerRelCenter = Vector.sub(this.player.center, envCenter);
        let playerPosForward = Vector.dot(playerRelCenter, this.forwardVec) / horizontalNormalizer;
        let playerPosUp = Vector.dot(this.player.center, this.upVec) / verticalNormalizer;

        let ballRelCenter = Vector.sub(this.ball.center, envCenter);
        let ballPosForward = Vector.dot(ballRelCenter, this.forwardVec) / horizontalNormalizer;
        let ballPosUp = Vector.dot(ballRelCenter, this.upVec) / verticalNormalizer;

        let opponentRelCenter = Vector.sub(this.opponent.player.center, envCenter);
        let opponentPosForward = Vector.dot(opponentRelCenter, this.forwardVec) / horizontalNormalizer;
        let opponentPosUp = Vector.dot(opponentRelCenter, this.upVec) / verticalNormalizer;

        let playerVelForward = Vector.dot(this.player.velocity, this.forwardVec) / 4;
        let playerVelUp = Vector.dot(this.player.velocity, this.upVec) / 4;

        let ballVelForward = Vector.dot(this.ball.velocity, this.forwardVec) / 6;
        let ballVelUp = Vector.dot(this.ball.velocity, this.upVec) / 6;

        let opponentVelForward = Vector.dot(this.opponent.player.velocity, this.forwardVec) / 4;
        let opponentVelUp = Vector.dot(this.opponent.player.velocity, this.upVec) / 4;

        //TODO CHECK ALL

        return ([
            playerPosForward,
            playerPosUp,
            ballPosForward,
            ballPosUp,
            opponentPosForward,
            opponentPosUp,
            playerVelForward,
            playerVelUp,
            ballVelForward,
            ballVelUp,
            opponentVelForward,
            opponentVelUp,
        ]);
    }

    episodeTerminated() {
        return this.env.episodeEnd;
    }

    getReward(s, a, ss) {
        /*
                let goalScored = ss[2] > 1;
                let goalConceded = ss[2] < -1;
                if (goalConceded || goalScored) {

                    console.log("goal");
                }

                if (goalScored) {
                    return 10;
                } else if (goalConceded) {
                    return -10;
                } else {
                    return -0.2;
                }
            }
            
            let ballAtUpCorner = ss[2] > 0.85 && ss[3] > 0.85;
            console.log(ballAtUpCorner);
            return ballAtUpCorner ? 1 : -1;
            */

        let goal = ss[2] >= 1;
        let ballGoingForward = ss[2] - 0.01 > s[2];
        if (goal) {
            return 1;
        } else if (ballGoingForward) {
            return 0.1;
        } else {
            return -1;
        }
    }
}

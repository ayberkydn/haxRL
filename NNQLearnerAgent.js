class NNQLearnerAgent extends Agent {
    constructor() {
        super();
        this.experienceReplay = new ExperienceReplay(10000, 100);
        let hiddenSize = 200;
        this.actionSpace = 16;
        this.learningRate = 0.01;
        this.scaleH = 0.2;
        this.scaleW = 0.2;
        this.stateShape = [cHeight * this.scaleH, cWidth * this.scaleW, 3];



        this.brain = new NeuralNetwork()
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

        this.targetBrain = new NeuralNetwork()
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
            .copyWeightsFrom(this.brain);


        //TODO


        this.discount = 0.85; //when reward is continuous low discount is better IMO
        this.lastSARST = {};
        this.actionRepeat = 4;
        this.targetUpdateFreq = 2;
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
            this.lastSARST.s = this.getStateInfo();
            //console.log(this.brain.forward(this.lastSARST.s)[0].map(x => x.toFixed(2)));

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
                this.learnStep++;
                this.epsilon = (Math.cos(this.learnStep * 0.001) + 1) / 2;

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
        var stateImg = ctx.getImageData(0, 0, this.stateShape[1], this.stateShape[0]);
        return stateImg;

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
        /*
        let goal = ss[2] >= 1;
        let ballGoingForward = ss[2] - 0.01 > s[2];
        if (goal) {
            return 1;
        } else if (ballGoingForward) {
            return 0.1;
        } else {
            return -0.1;
        }
        */

        let meGoingForward = ss[0] - 0.01 > s[0];
        let meGoingUp = ss[1] - 0.01 > s[1];
        return (meGoingForward | meGoingUp) ? 1 : -1;
    }
}
class NeuralNetwork {
    constructor(nIn, nHidden, nOut) {
        this.nIn = nIn;
        this.nHidden = nHidden;
        this.nOut = nOut;
        this.lossFunc = function () {
            throw "loss function not implemented";
        };

        this.optimizer = dl.train.sgd(0.0001);

        this.W1 = dl.variable(dl.randomNormal([nIn, nHidden]).mul(dl.scalar(2 / (nIn + nHidden))));
        this.b1 = dl.variable(dl.zeros([nHidden]));
        this.W2 = dl.variable(dl.randomNormal([nHidden, nOut]).mul(dl.scalar(2 / (nHidden + nOut))));
        this.b2 = dl.variable(dl.zeros([nOut]));

    }

    copyWeightsFrom(nn2) {
        this.W1 = nn2.W1.clone();
        this.b1 = nn2.b1.clone();
        this.W2 = nn2.W2.clone();
        this.b2 = nn2.b2.clone();
    }


    setLoss(lossFunc) {
        if (lossFunc == "mse") {
            this.lossFunc = (logits, labels) => {
                let mse = dl.mean(dl.square(dl.sub(logits, labels)));
                return mse;
            };
        } else if (lossFunc == "softmaxcrossentropy") {
            this.lossFunc = (logits, labels) => {
                let xEntropy = dl.losses.softmaxCrossEntropy(logits, labels);
                return xEntropy.mean();
            };
        }
        return this;
    }

    setOptimizer(optimizer) {
        this.optimizer = optimizer;
        return this;
    }

    predict(inputMatrix, returnScore = false) {
        return dl.tidy(() => {
            let out = this.forward(inputMatrix);
            if (returnScore) {
                return dl.max(out).dataSync()[0];
            } else {
                return dl.argMax(out).dataSync()[0];
            }

        });
    }


    forward(inputMatrix) {
        return dl.tidy(() => {
            let x = dl.tensor(inputMatrix);
            x = (x.rank == 1 ? x.expandDims(0) : x);
            let hiddenOut = x.matMul(this.W1).add(this.b1);
            hiddenOut = dl.tanh(hiddenOut);
            let out = hiddenOut.matMul(this.W2);
            return out;
        });
    }


    loss(inputMatrix, labelsArray) {
        return dl.tidy(() => {
            let logits = this.forward(inputMatrix);
            let labels = dl.tensor(labelsArray);
            let loss = this.lossFunc(labels, logits);
            return loss;
        });
    }

    trainStep(X, y) {
        this.optimizer.minimize(() => this.loss(X, y));
    }

}
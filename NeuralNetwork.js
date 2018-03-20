class NeuralNetwork {
    constructor(nIn, nHidden, nOut) {
        this.nIn = nIn;
        this.nHidden = nHidden;
        this.nOut = nOut;
        this.lossFunc = function () {
            throw "loss function not implemented";
        };

        this.optimizer = dl.train.sgd(0.001);
        this.params = {};
        this.params.W1 = dl.variable(dl.randomNormal([nIn, nHidden]).mul(dl.scalar(2 / (nIn + nHidden))));
        this.params.b1 = dl.variable(dl.zeros([nHidden]));
        this.params.W2 = dl.variable(dl.randomNormal([nHidden, nOut]).mul(dl.scalar(2 / (nHidden + nOut))));
        this.params.b2 = dl.variable(dl.zeros([nOut]));

    }


    copyWeightsFrom(nn2) {
        this.params.W1 = nn2.params.W1.clone();
        this.params.b1 = nn2.params.b1.clone();
        this.params.W2 = nn2.params.W2.clone();
        this.params.b2 = nn2.params.b2.clone();
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
            let out = this._forward(inputMatrix);
            if (returnScore) {
                return tensorToArray(dl.max(out, 1));
            } else {
                return tensorToArray(dl.argMax(out, 1));
            }

        });
    }


    _forward(inputMatrix) {
        return dl.tidy(() => {
            let x = dl.tensor(inputMatrix);
            x = (x.rank == 1 ? x.expandDims(0) : x);
            let hiddenOut = x.matMul(this.params.W1).add(this.params.b1);
            hiddenOut = dl.tanh(hiddenOut);
            let out = hiddenOut.matMul(this.params.W2).add(this.params.b2);
            return out;
        });
    }

    forward(inputMatrix) {
        return dl.tidy(() => {
            let out = this._forward(inputMatrix);
            return tensorToArray(out);
        });
    }


    _loss(inputMatrix, labelsArray) {
        return dl.tidy(() => {
            let logits = this._forward(inputMatrix);
            let labels = dl.tensor(labelsArray);
            let loss = this.lossFunc(labels, logits);
            return loss;
        });
    }

    loss(inputMatrix, labelsArray) {
        return dl.tidy(() => {
            let loss = this._loss(inputMatrix, labelsArray);
            return loss.dataSync()[0];
        });
    }

    trainStep(X, y) {
        this.optimizer.minimize(() => this._loss(X, y));
    }

}
class NeuralNetwork {
    constructor(layerSizes) {
        if (!(layerSizes instanceof Array)) {
            throw "Invalid arguments, enter 1 argument as array!";
        }
        this.layerSizes = layerSizes;
        this.nLayers = layerSizes.length;

        this.lossFunc = function () {
            throw "loss function not implemented";
        };
        this.optimizer = {
            minimize: () => {
                throw "optimizer not implemented";
            }
        };
        this.activation = () => {
            throw "activation not implemented";
        };

        this.params = {
            Ws: [],
            bs: [],
        };

        for (let n = 0; n < this.nLayers - 1; n++) {
            this.params.Ws.push(dl.variable(dl.randomNormal([layerSizes[n], layerSizes[n + 1]]).mul(dl.scalar(2 / (layerSizes[n] + layerSizes[n + 1])))));
            this.params.bs.push(dl.variable(dl.zeros([layerSizes[n + 1]])));
        }

    }


    copyWeightsFrom(nn2) {
        if (!arrayEqual(this.layerSizes, nn2.layerSizes)) {
            console.log(this.layerSizes, nn2.layerSizes);
            throw "Network architectures are not identical!";
        } else {
            for (let n = 0; n < this.params.Ws.length; n++) {
                this.params.Ws[n] = nn2.params.Ws[n].clone();
                this.params.bs[n] = nn2.params.bs[n].clone();
            }
        }
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

    setActivation(activation) {
        this.activation = activation;
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
            let hiddenOut = x;
            for (let n = 0; n < this.nLayers - 2; n++) {
                hiddenOut = hiddenOut.matMul(this.params.Ws[n]).add(this.params.bs[n]);
                hiddenOut = this.activation(hiddenOut);
            }
            let out = hiddenOut.matMul(this.params.Ws[this.nLayers - 2]).add(this.params.bs[this.nLayers - 2]);
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
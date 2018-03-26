class NeuralNetwork {
    constructor() {

        this.lossFunc = function () {
            throw "Loss function not implemented";
        };
        this.optimizer = {
            minimize: () => {
                throw "Optimizer not implemented";
            }
        };

        this.layers = [];
    }

    addLayer(layer) {
        if (this.layers.length == 0) {
            if (!layer.inputShape) {
                throw "Input layer must be defined with input shape";
            }
        } else {
            layer.setInputShape(this.layers[this.layers.length - 1].outputShape);
        }
        this.layers.push(layer);
        return this;

    }


    copyWeightsFrom(nn2) {
        if (this.layers.length != nn2.layers.length) {
            throw `Network topology mismatch between ${this} and ${nn2}`;
        } else {
            for (let n = 0; n < this.layers.length; n++) {
                this.layers[n].copyWeightsFrom(nn2.layers[n]);
            }
        }
        return this;

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


    predict(inputTensor, returnScore = false) {

        return dl.tidy(() => {

            let out = this._forward(inputTensor);
            if (returnScore) {
                return tensorToArray(dl.max(out, 1));
            } else {
                return tensorToArray(dl.argMax(out, 1));
            }
        });
    }


    _forward(inputTensor, toLayer = 0) {
        return dl.tidy(() => {
            if (!(inputTensor instanceof dl.Tensor)) {
                if (inputTensor instanceof Array) {
                    if (inputTensor[0] instanceof ImageData) { //Array of images
                        inputTensor = inputTensor.map(img => ImageDataRGBA255ToImageTensorRGB1(img));
                        inputTensor = dl.stack(inputTensor);
                    } else if (inputTensor[0] instanceof Array) {
                        inputTensor = dl.tensor(inputTensor);
                    } else if (inputTensor[0] instanceof dl.Tensor) {
                        inputTensor = dl.stack(inputTensor);
                    } else {
                        throw `Invalid input ${inputTensor} for Neural Network`;
                    }
                } else if (inputTensor instanceof ImageData) {
                    inputTensor = ImageDataRGBA255ToImageTensorRGB1(inputTensor);
                } else {
                    throw `Invalid input ${inputTensor} for Neural Network`;
                }
            }


            let hiddenOut = inputTensor;
            for (let n = 0; n < (toLayer ? toLayer : this.layers.length); n++) {
                hiddenOut = this.layers[n].forward(hiddenOut);
            }

            return hiddenOut;

        });

    }

    forward(inputTensor, toLayer = 0) {
        return dl.tidy(() => {
            let out = this._forward(inputTensor, toLayer);
            return tensorToArray(out);
        });
    }


    _loss(inputTensor, labelsArray) {
        return dl.tidy(() => {
            let logits = this._forward(inputTensor);
            let labels = labelsArray;
            if (!(labelsArray instanceof dl.Tensor)) {
                labels = dl.tensor(labelsArray);
            }
            let loss = this.lossFunc(labels, logits);
            return loss;
        });
    }

    loss(inputTensor, labelsArray) {
        return dl.tidy(() => {
            let loss = this._loss(inputTensor, labelsArray);
            return loss.dataSync()[0];
        });
    }

    trainStep(X, y) {
        this.optimizer.minimize(() => this._loss(X, y));
    }

    summary() {
        this.layers.map((layer) => {
            console.log(layer.constructor.name, "inputShape", layer.inputShape, "outputShape", layer.outputShape);
        });
        return this;
    }

}

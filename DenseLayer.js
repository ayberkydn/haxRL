class DenseLayer extends Layer {
    constructor(outputShape, activation, inputShape = null) {
        super();
        this.outputShape = outputShape;
        this.activation = activation;
        if (inputShape) {
            this.setInputShape(inputShape);
        }
    }

    setInputShape(nIn) {
        this.inputShape = nIn;
        this.W = dl.variable(dl.randomNormal([nIn, this.outputShape]).mul(dl.scalar(2 / (nIn + this.outputShape))));
        this.b = dl.variable(dl.zeros([1, this.outputShape]));
    }

    forward(inputTensor) {
        if (!(inputTensor instanceof dl.Tensor)) {
            throw `Input ${x} of layer is not a Tensor`;
        } else if (inputTensor.rank == 1) {
            inputTensor = inputTensor.expandDims(0);
        }

        if (inputTensor.rank != 2) {
            throw `Input ${inputTensor} is not a rank 2 tensor`;
        } else {
            let net = dl.add(dl.matMul(inputTensor, this.W), this.b);
            if (this.activation) {
                return this.activation(net);
            } else {
                return net;
            }
        }
    }

    copyWeightsFrom(layer2) {
        if (!arrayEqual(this.W.shape, layer2.W.shape) || !arrayEqual(this.b.shape, layer2.b.shape)) {
            throw `Can't copy layer. Shape mismatch between shape of ${this.W.shape} and ${layer2.W.shape}`;
        } else {
            this.W.dispose();
            this.b.dispose();
            this.W = layer2.W.clone();
            this.b = layer2.b.clone();
        }
    }

}
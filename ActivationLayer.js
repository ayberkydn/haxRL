class ActivationLayer extends Layer {
    constructor(actFunc) {
        super();
        this.activation = actFunc;
    }

    setInputShape(inputShape) {
        this.inputShape = inputShape;
        this.outputShape = inputShape;
    }

    forward(inputTensor) {
        if (!(inputTensor instanceof dl.Tensor)) {
            throw `Input ${inputTensor} of layer is not a Tensor`;
        } else if (inputTensor.rank == 1) {
            inputTensor = inputTensor.expandDims(0);
        }

        return this.activation(inputTensor);
    }



}
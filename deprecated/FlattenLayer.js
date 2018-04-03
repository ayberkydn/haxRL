class FlattenLayer extends Layer {
    constructor(inputShape = null) {
        super();
        if (inputShape) {
            this.setInputShape(inputShape);
        }
    }

    setInputShape(inputShape) {
        if (inputShape.length != 3) {
            throw `Can't construct flatten layer. Input shape = ${inputShape} must be [height, width, channel] format.`;
        } else {
            this.inputShape = inputShape;
            this.outputShape = math.prod(inputShape);
        }

    }

    forward(inputTensor) {
        if (!(inputTensor instanceof dl.Tensor)) {
            throw `Input ${x} of layer is not a Tensor`;
        } else if (inputTensor.shape.length == 3) {
            inputTensor = inputTensor.expandDims(0);
        } else if (inputTensor.shape.length != 4) {
            throw `Shape of the input = ${inputTensor.shape} is not compatible with the layer`;
        }

        return inputTensor.reshape([inputTensor.shape[0], -1]);
    }

}
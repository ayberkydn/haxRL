class ConvLayer extends Layer {
    constructor(filterShape, nFilters, stride = 1, pad = 'valid', activation = null, inputShape = null) {
        super();
        if (filterShape.length != 2) {
            throw `Can't construct convolutional layer. Filter shape = ${filterShape} must be [height, width] format.`;
        }
        if (pad != 'valid' && pad != 'same') {
            throw `Can't construct convolutional layer. Pad = ${pad} must be 'valid' or 'same'`;
        } else if (Number.isInteger(stride)) {
            stride = [stride, stride];
        } else if (stride.length != 2) {
            throw `Can't construct convolutional layer. Stride = ${stride} must be in [height, width] or number format.`;
        }

        this.filterShape = filterShape;
        this.nFilters = nFilters;
        this.stride = stride;
        this.pad = pad;
        this.activation = activation;

        if (inputShape) {
            this.setInputShape(inputShape);
        }


    }

    setInputShape(inputShape) {
        if (inputShape.length != 3) {
            throw `Can't construct convolutional layer. Input shape = ${inputShape} must be [height, width, channel] format.`;
        }
        this.inputShape = inputShape;
        if (this.pad == 'valid') {
            this.outputShape = [Math.ceil((this.inputShape[0] - this.filterShape[0] + 1) / (this.stride[0])), Math.ceil((this.inputShape[1] - this.filterShape[1] + 1) / (this.stride[1])), this.nFilters];
        } else if (this.pad == 'same') {
            this.outputShape = [Math.ceil(this.inputShape[0] / this.stride[0]), Math.ceil(this.inputShape[1] / this.stride[1]), this.nFilters];
        }

        //TODO SPECIFIC INITIALIZATION FOR CONV LAYER
        this.W = dl.variable(dl.randomNormal([...this.filterShape, inputShape[2], this.nFilters]));
        this.b = dl.variable(dl.zeros([...this.outputShape]));
    }

    forward(inputTensor) {
        if (!(inputTensor instanceof dl.Tensor)) {
            throw `Input ${x} of layer is not a Tensor`;
        } else if (inputTensor.shape.length == 3) {
            inputTensor = inputTensor.expandDims(0);
        } else if (inputTensor.shape.length != 4) {
            throw `Shape of the input = ${inputTensor.shape} is not compatible with the layer`;
        }
        let net = dl.add(dl.conv2d(inputTensor, this.W, this.stride, this.pad), this.b);
        if (this.activation) {
            return this.activation(net);
        } else {
            return net;
        }
    }

    copyWeightsFrom(layer2) {
        if (!arrayEqual(this.W.shape, layer2.W.shape) || !arrayEqual(this.b.shape, layer2.b.shape)) {
            throw `Shape mismatch between ${this.W} and ${layer2.W}`;
        } else {
            this.W.dispose();
            this.b.dispose();
            this.W = layer2.W.clone();
            this.b = layer2.b.clone();
        }
    }

}
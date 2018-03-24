class PoolingLayer extends Layer {
    constructor(poolSize, poolType = "max", pad = "same", stride = null, inputShape = null) {
        super();


        this.poolType = poolType;
        this.pad = pad;
        this.stride = stride;

        if (Number.isInteger(poolSize)) {
            this.poolSize = [poolSize, poolSize];
        } else if (poolSize.length == 2 && poolSize.every(n => Number.isInteger(n))) {
            this.poolSize = poolSize;
        } else {
            throw `Invalid pool size: ${poolSize}`;
        }

        if (stride == null) {
            this.stride = poolSize;
        }

        if (Number.isInteger(this.stride)) {
            this.stride = [this.stride, this.stride];
        } else if (!(this.stride.length == 2 && this.stride.every(n => Number.isInteger(n)))) {
            throw `Invalid stride: ${this.stride}`;
        }


        if (this.poolType == "max") {
            this.pooler = (x) => x.maxPool(this.poolSize, this.stride, this.pad);
        } else if (this.poolType == "min") {
            this.pooler = (x) => x.minPool(this.poolSize, this.stride, this.pad);
        } else if (this.poolType == "avg") {
            this.pooler = (x) => x.avgPool(this.poolSize, this.stride, this.pad);
        } else {
            throw `Invalid pool type = ${poolType}`;
        }

        if (this.pad != "valid" && this.pad != "same") {
            throw `Invalid pad: ${this.pad}`;
        }


        if (inputShape) {
            this.setInputShape(inputShape);
        }

    }



    setInputShape(inputShape) {
        if (inputShape.length != 3) {
            throw `Can't construct pooling layer. Input shape = ${inputShape} must be [height, width, channel] format.`;
        }
        this.inputShape = inputShape;
        if (this.pad == 'valid') {
            this.outputShape = [Math.ceil((this.inputShape[0] - this.poolSize[0] + 1) / (this.stride[0])), Math.ceil((this.inputShape[1] - this.poolSize[1] + 1) / (this.stride[1])), this.inputShape[2]];
        } else if (this.pad == 'same') {
            this.outputShape = [Math.ceil(this.inputShape[0] / this.stride[0]), Math.ceil(this.inputShape[1] / this.stride[1]), this.inputShape[2]];
        }


    }

    forward(inputTensor) {
        if (!(inputTensor instanceof dl.Tensor)) {
            throw `Input ${inputTensor} of layer is not a Tensor`;
        } else if (inputTensor.shape.length == 3) {
            inputTensor = inputTensor.expandDims(0);
        } else if (inputTensor.shape.length != 4) {
            throw `Shape of the input = ${inputTensor.shape} is not compatible with the layer`;
        }

        return this.pooler(inputTensor);

    }
}
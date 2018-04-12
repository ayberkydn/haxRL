class Layer {
    constructor() {}

    setInputShape() {
        throw "setInputShape not implemented";
    }

    forward() {
        throw "forward not implemented";
    }

    copyWeightsFrom(layer2) {
        if (this.W) {
            throw "copyWeightsFrom not implemented";
        }
    }
}
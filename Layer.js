class Layer {
    constructor() {}

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
var tensorToMatrix = a => math.matrix(Array.from(a.dataSync())).reshape(a.shape);
var tensorToArray = a => math.matrix(Array.from(a.dataSync())).reshape(a.shape)._data;
var matrixToTensor = a => dl.tensor(a._data);


var softmax = (scoresIn) => {
    scores = Object.assign([], scoresIn[0]);
    let sum = 0;
    for (let n = 0; n < scores.length; n++) {
        scores[n] = Math.exp(scores[n]);
        sum += scores[n];
    }
    for (let n = 0; n < scores.length; n++) {
        scores[n] /= sum;
    }

    return scores;
};

var choice = (probs) => {
    for (let n = 1; n < 3; n++) {
        scores[n] += scores[n - 1];
    }
    let rand = Math.random();
    if (rand < scores[0]) {
        return 0;
    } else if (rand < scores[1]) {
        return 1;
    } else {
        return 2;
    }
};

var arrayEqual = (array1, array2) => {
    if (array1.length != array2.length) {
        return false;
    } else {
        for (let n = 0; n < array1.length; n++) {
            if (array1[n] != array2[n]) {
                return false;
            }
        }
        return true;
    }
};


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


var ImageDataRGBA255ToImageTensorRGB1 = (imgData) => {
    if (!(imgData instanceof ImageData)) {
        throw `${imgData} Not an ImageData`;
    }
    return dl.fromPixels(imgData).div(dl.scalar(255));
};

var TensorRGB1ToImageDataRGBA255 = (tensor) => {
    if (tensor.shape.length != 3 || tensor.shape[2] != 3) {
        throw `Tensor of shape ${tensor.shape} is not an RGB tensor`;
    }
    let alpha = dl.ones([tensor.shape[0], tensor.shape[1], 1], 'float32');
    let cat = tensor.concat(alpha, 2).mul(dl.scalar(255)).asType('int32');
    var rgba255 = new ImageData(Uint8ClampedArray.from(cat.dataSync()), tensor.shape[1], tensor.shape[0]);
    return rgba255;
};

var ImageTensorRGBToGray = (tensor) => {
    if (tensor.shape.length != 3) {
        throw `${tensor} is not an image tensor.`;
    } else if (tensor.shape[2] != 3) {
        throw `${tensor} is not an RGB tensor.`;
    } else {
        let gray = dl.mean(tensor, -1, true);
        return gray;
    }
};

var ImageTensor1To3Channel = (tensor) => {
    if (tensor.shape.length != 3) {
        throw `$Tensor of shape {tensor.shape} is not an image tensor.`;
    } else if (tensor.shape[2] != 1) {
        throw `Tensor of shape ${tensor.shape} is not an Grayscale tensor.`;
    } else {
        let rgb = dl.concat([tensor, tensor, tensor], -1);
        return rgb;
    }
};

var selectChannelFromImageTensor = (tensor, channel) => {
    if (tensor.shape.length != 3) {
        throw `Tensor of shape ${tensor.shape} is not an image tensor`;
    } else if (channel != 0 && channel != 1 && channel != 2) {
        throw `Invalid channel input: ${channel}`;
    } else {
        let imgTensorChannel = dl.slice(imgTensor, [0, 0, channel], [tensor.shape[0], tensor.shape[1], channel]);
    }
};

var scaleImageTensor = (tensor, scale) => {
    if (scale.length != 2) {
        throw "Scale must be [height, width] format.";
    }
    let imgHeight, imgWidth;

    if (tensor.shape.length == 4) {
        imgHeight = tensor.shape[1];
        imgWidth = tensor.shape[2];
    } else if (tensor.shape.length == 3) {
        imgHeight = tensor.shape[0];
        imgWidth = tensor.shape[1];
    } else {
        throw "Incompatible image tensor for scaling";
    }
    return tensor.resizeBilinear([imgHeight * scale[0], imgWidth * scale[1]]);
};
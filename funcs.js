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
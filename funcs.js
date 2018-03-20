var tensorToMatrix = a => math.matrix(Array.from(a.dataSync())).reshape(a.shape);
var tensorToArray = a => math.matrix(Array.from(a.dataSync())).reshape(a.shape)._data;
var matrixToTensor = a => dl.tensor(a._data);
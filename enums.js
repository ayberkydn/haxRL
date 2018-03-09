var Way = {
    up: "up",
    down: "down",
    left: "left",
    right: "right",
};

var Color = {
    red: "#E56E56",
    blue: "#5689E5",
    green: "#688F56",
    black: "#000000",
    white: "#FFFFFF",
    border: "#C7E6BD",
};


var Side = {
    red: "red",
    blue: "blue",
};

var Action = {
    up: "up",
    upleft: "upleft",
    left: "left",
    downleft: "downleft",
    down: "down",
    downright: "downright",
    right: "right",
    upright: "upright",
    upshoot: "upshoot",
    upleftshoot: "upleftshoot",
    leftshoot: "leftshoot",
    downleftshoot: "downleftshoot",
    downshoot: "downshoot",
    downrightshoot: "downrightshoot",
    rightshoot: "rightshoot",
    uprightshoot: "uprightshoot",
    nomove: "nomove",
    nomoveshoot: "nomoveshoot",
};

var Unitvec = {
    up: new Vector(0, -1),
    upleft: new Vector(-1 / Math.SQRT2, -1 / Math.SQRT2),
    left: new Vector(-1, 0),
    downleft: new Vector(-1 / Math.SQRT2, 1 / Math.SQRT2),
    down: new Vector(0, 1),
    downright: new Vector(1 / Math.SQRT2, 1 / Math.SQRT2),
    right: new Vector(1, 0),
    upright: new Vector(1 / Math.SQRT2, -1 / Math.SQRT2),
};
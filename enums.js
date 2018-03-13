var Way = {
    up: "WAY_UP",
    down: "WAY_DOWN",
    left: "WAY_LEFT",
    right: "WAY_RIGHT",
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
    red: "SIDE_RED",
    blue: "SIDE_BLUE",
};
/*
var ActionV = {
    up: "ACTION_UP",
    upleft: "ACTION_UP_LEFT",
    left: "ACTION_LEFT",
    downleft: "ACTION_DOWN_LEFT",
    down: "ACTION_DOWN",
    downright: "ACTION_DOWN_RIGHT",
    right: "ACTION_RIGHT",
    upright: "ACTION_UP_RIGHT",
    upshoot: "ACTION_UP_SHOOT",
    upleftshoot: "ACTION_UP_LEFT_SHOOT",
    leftshoot: "ACTION_LEFT_SHOOT",
    downleftshoot: "ACTION_DOWN_LEFT_SHOOT",
    downshoot: "ACTION_DOWN_SHOOT",
    downrightshoot: "ACTION_DOWN_RIGHT_SHOOT",
    rightshoot: "ACTION_RIGHT_SHOOT",
    uprightshoot: "ACTION_UP_RIGHT_SHOOT",
    nomove: "ACTION_NOMOVE",
    nomoveshoot: "ACTION_NOMOVE_SHOOT",
};
*/
var ActionV = {
    up: "ACTION_VERTICAL_UP",
    down: "ACTION_VERTICAL_DOWN",
    nomove: "ACTION_VERTICAL_NOMOVE"
};

var ActionH = {
    left: "ACTION_HORIZONTAL_LEFT",
    right: "ACTION_HORIZONTAL_RIGHT",
    nomove: "ACTION_HORIZONTAL_NOMOVE"
};

var ActionS = {
    shoot: "ACTION_SHOOT_TRUE",
    nomove: "ACTION_SHOOT_FALSE",
};

var Unitvec = {
    up: new Vector(0, -1),
    upleft: new Vector(-Math.SQRT1_2, -Math.SQRT1_2),
    left: new Vector(-1, 0),
    downleft: new Vector(-Math.SQRT1_2, Math.SQRT1_2),
    down: new Vector(0, 1),
    downright: new Vector(Math.SQRT1_2, Math.SQRT1_2),
    right: new Vector(1, 0),
    upright: new Vector(Math.SQRT1_2, -Math.SQRT1_2),
};
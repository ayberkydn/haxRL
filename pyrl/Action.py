from enum import Enum
class Action(Enum):
    
    up = "ACTION_UP"
    down = "ACTION_DOWN"
    forward = "ACTION_FORWARD"
    backward = "ACTION_BACKWARD"
    nomoveshoot = "ACTION_NOMOVE_SHOOT"
    upforward = "ACTION_UP_FORWARD"
    downforward = "ACTION_DOWN_FORWARD"
    upbackward = "ACTION_UP_BACKWARD"
    downbackward = "ACTION_DOWN_BACKWARD"
    upshoot = "ACTION_UP_SHOOT"
    downshoot = "ACTION_DOWN_SHOOT"
    forwardshoot = "ACTION_FORWARD_SHOOT"
    backwardshoot = "ACTION_BACKWARD_SHOOT"
    upforwardshoot = "ACTION_UP_FORWARD_SHOOT"
    upbackwardshoot = "ACTION_UP_BACKWARD_SHOOT"
    downforwardshoot = "ACTION_DOWN_FORWARD_SHOOT"
    downbackwardshoot = "ACTION_DOWN_BACKWARD_SHOOT"
    nomove = "ACTION_NOMOVE"

#class Action(Enum):
#    
#    up = "ACTION_UP"
#    down = "ACTION_DOWN"
#    left = "ACTION_LEFT"
#    right = "ACTION_RIGHT"
#    nomoveshoot = "ACTION_NOMOVE_SHOOT"
#    upleft = "ACTION_UP_LEFT"
#    downleft = "ACTION_DOWN_LEFT"
#    upright = "ACTION_UP_RIGHT"
#    downright = "ACTION_DOWN_RIGHT"
#    upshoot = "ACTION_UP_SHOOT"
#    downshoot = "ACTION_DOWN_SHOOT"
#    leftshoot = "ACTION_LEFT_SHOOT"
#    rightshoot = "ACTION_RIGHT_SHOOT"
#    upleftshoot = "ACTION_UP_LEFT_SHOOT"
#    uprightshoot = "ACTION_UP_RIGHT_SHOOT"
#    downleftshoot = "ACTION_DOWN_LEFT_SHOOT"
#    downrightshoot = "ACTION_DOWN_RIGHT_SHOOT"
#    nomove = "ACTION_NOMOVE"


class ActionV:
    up = "ACTION_VERTICAL_UP"
    down = "ACTION_VERTICAL_DOWN"
    nomove = "ACTION_VERTICAL_NOMOVE"


class ActionH:
    forward = "ACTION_HORIZONTAL_FORWARD"
    backward = "ACTION_HORIZONTAL_BACKWARD"
    nomove = "ACTION_HORIZONTAL_NOMOVE"


class ActionS:
    shoot = "ACTION_SHOOT_TRUE"
    nomove = "ACTION_SHOOT_FALSE"
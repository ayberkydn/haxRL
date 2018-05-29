import scipy
import matplotlib.pyplot as plt
from Border import Border
from VerticalBorder import VerticalBorder
from HorizontalBorder import HorizontalBorder
from Disc import Disc
from DHBCollision import DHBCollision
from DVBCollision import DVBCollision
from KickCollision import KickCollision
from DDCollision import DDCollision
from Way import Way
from Vector import Vector
from Kicker import Kicker
from Ball import Ball


def preprocess_state(state):
    if len(state.shape) == 1:
        return state
    elif len(state.shape) == 3:
        single_channel = state[:,:,0]
        return scipy.misc.imresize(single_channel, [84, 84])
    else:
        raise TypeError

def show(image):
    plt.imshow(image)
    plt.show()
    

def get_collision(body1, body2):
    #Returns collision of corresponding type with body1 and body2, if any. 
    #else returns None
    if body1.center == body2.center:
        return

    body1_in_body2_mask = isinstance(body1, tuple(body2.collision_mask))
    body2_in_body1_mask = isinstance(body2, tuple(body1.collision_mask))
    
    if not body1_in_body2_mask or not body2_in_body1_mask:
        return
    
    if isinstance(body1, Border) and isinstance(body2, Disc):
        # Disc-Border is allowed, Border-Disc is not.
        return get_collision(body2, body1)
    
    if isinstance(body1, Disc) and isinstance(body2, HorizontalBorder):
        ##Disc-HB collision
        if body2.center.x + body2.length / 2 > body1.center.x and body2.center.x - body2.length / 2 < body1.center.x:
            if body1.center.y - body2.center.y < body1.radius and body2.extends_to == Way.up:
                return DHBCollision(body1, body2)
            elif body2.center.y - body1.center.y < body1.radius and body2.extends_to == Way.down:
                return DHBCollision(body1, body2)
    
    
 
    elif isinstance(body1, Disc) and isinstance(body2, HorizontalBorder):
        if body2.center.x + body2.length / 2 > body1.center.x and body2.center.x - body2.length / 2 < body1.center.x:
            if body1.center.y - body2.center.y < body1.radius and body2.extends_to == Way.up:
                return DHBCollision(body1, body2)
            if body2.center.y - body1.center.y < body1.radius and body2.extends_to == Way.down:
                return DHBCollision(body1, body2)
            
    elif isinstance(body1, Disc) and isinstance(body2, VerticalBorder):
        if body2.center.y + body2.length / 2 > body1.center.y and body2.center.y - body2.length / 2 < body1.center.y:#
            if body1.center.x - body2.center.x < body1.radius and body2.extends_to == Way.left:
                return DVBCollision(body1, body2)
            elif body2.center.x - body1.center.x < body1.radius and body2.extends_to == Way.right:
                return DVBCollision(body1, body2)
                      


    elif isinstance(body1, Disc) and isinstance(body2, VerticalBorder):
        if body2.center.y + body2.length / 2 > body1.center.y and body2.center.y - body2.length / 2 < body1.center.y:
            if body1.center.x - body2.center.x < body1.radius and body2.extends_to == Way.left:
                return DVBCollision(body1, body2)
            elif body2.center.x - body1.center.x < body1.radius and body2.extends_to == Way.right:
                return DVBCollision(body1, body2)
            
    elif isinstance(body1, Disc) and isinstance(body2, Disc):
        if Vector.sub(body1.center, body2.center).magnitude() <= body1.radius + body2.radius:
            return DDCollision(body1, body2)

    elif isinstance(body1, Kicker) and isinstance(body2, Ball):
        return get_collision(body2, body1)


    elif isinstance(body1, Ball) and isinstance(body2, Kicker):
        if Vector.sub(body1.center, body2.center).magnitude() <= body1.radius + body2.radius:
            return KickCollision(body1, body2)


import torch

def discount(arr, coef):
    '''Comment'''
    length = arr.shape[-1]
    coefs = coef ** torch.arange(length)
    return coefs * arr
    
def flatten(arr):
    '''Comment'''
    return arr.reshape(-1, *arr.shape[2:])

def to_pytorch(state):
    state = state[:].transpose(2, 0, 1)
    state = torch.from_numpy(state)
    state.to("cuda")
    return state
import math
from enum import Enum

class Vector:
    
    def __init__(self, x, y):
    
        self.x = x
        self.y = y
        
    def add(self, vec2):
        result = Vector(self.x + vec2.x, self.y + vec2.y)
        return result
    

    def sub(self, vec2):
        result = Vector(self.x - vec2.x, self.y - vec2.y)
        return result
      
    def mult(self, n):
        result = Vector(self.x * n, self.y * n)
        return result
    
    def div(self, n):
        result = Vector(self.x / n, self.y / n)
        return result
        
    def magnitude(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5 
        
    def normalize(self):
        norm = self.magnitude()
        result = Vector(self.x / norm, self.y / norm)
        return result

    def inverse(self):
        result = self.mult(-1)
        return result
    
    def copy(self):
        return Vector(self.x, self.y)

    def dot(self, vec2):
        result = self.x * vec2.x + self.y * vec2.y
        return result
    
    def dist(self, vec2):
        return Vector.sub(self, vec2).magnitude()
        
    def __repr__(self):
        return "Vector: ({}, {})".format(self.x, self.y)
    
    def __str__(self):
        return "Vector: ({}, {})".format(self.x, self.y)
    
    def __eq__(self, vec2):
        return self.x == vec2.x and self.y == vec2.y
    

class UnitVec:
    up = Vector(0, -1)
    upleft = Vector(-math.sqrt(0.5), -math.sqrt(0.5))
    left = Vector(-1, 0)
    downleft = Vector(-math.sqrt(0.5), math.sqrt(0.5))
    down = Vector(0, 1)
    downright = Vector(math.sqrt(0.5), math.sqrt(0.5))
    right = Vector(1, 0)
    upright = Vector(math.sqrt(0.5), -math.sqrt(0.5))

from Collision import Collision
from HorizontalBorder import HorizontalBorder
from Vector import Vector
from Way import Way
from Disc import Disc

class DHBCollision(Collision):
    #Disc-VerticalBorder collision
    def __init__(self, body1, body2):
        assert isinstance(body1, Disc) and isinstance(body2, HorizontalBorder)
        super.__init__(body1, body2)
        if body2.extends_to == Way.left:
            self.collision_normal = Vector(1, 0)
        elif body2.extends_to == Way.right:
            self.collision_normal = Vector(-1, 0);
        else:
            self.collision_normal = Vector(1, 0) if body1.center.x > body2.center.x else Vector(-1, 0)
        
        self.relative_velocity = Vector.sub(self.body1.velocity, self.body2.velocity)
        self.velocity_along_normal = Vector.dot(self.collision_normal, self.relative_velocity)
        self.penetration_depth = self.body1.radius - abs(self.body1.center.x - self.body2.center.x)
    
    

# -*- coding: utf-8 -*-


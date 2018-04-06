from Collision import Collision
from VerticalBorder import VerticalBorder
from Vector import Vector
from Way import Way
from Disc import Disc

class DVBCollision(Collision):
    #Disc-VerticalBorder collision
    def __init__(self, body1, body2):
        assert isinstance(body1, Disc) and isinstance(body2, VerticalBorder)
        super().__init__(body1, body2)
        if body2.extends_to == Way.up:
            self.collision_normal = Vector(0, 1)
        elif body2.extends_to == Way.down:
            self.collision_normal = Vector(0, -1);
        else:
            self.collision_normal = Vector(0, 1) if body1.center.y > body2.center.y else Vector(0, -1)
        
        self.relative_velocity = Vector.sub(self.body1.velocity, self.body2.velocity)
        self.velocity_along_normal = Vector.dot(self.collision_normal, self.relative_velocity)
        self.penetration_depth = self.body1.radius - abs(self.body1.center.y - self.body2.center.y)
        
    

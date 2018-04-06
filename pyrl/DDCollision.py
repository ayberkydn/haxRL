from Collision import Collision
from Disc import Disc
from Vector import Vector

class DDCollision(Collision):
    #Disc-Disc collision
    def __init__(self, body1, body2):
        assert isinstance(body1, Disc) and isinstance(body2, Disc)
        super().__init__(body1, body2);

        self.collision_normal = Vector.sub(self.body1.center, self.body2.center).normalize()
        self.relative_velocity = Vector.sub(self.body1.velocity, self.body2.velocity)
        self.velocity_along_normal = Vector.dot(self.collision_normal, self.relative_velocity)
        self.penetration_depth = abs(self.body1.radius + self.body2.radius - Vector.sub(self.body1.center, self.body2.center).magnitude())
        
        

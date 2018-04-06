from Collision import Collision
from Vector import Vector
from Ball import Ball
from Kicker import Kicker

class KickCollision(Collision):
    def __init__(self, body1, body2):
        assert isinstance(body1, Ball) and isinstance(body2, Kicker)
        super().__init__(body1, body2)
        self.collision_normal = Vector.sub(self.body1.center, self.body2.center).normalize()
        
    def resolve(self):
        if self.body2.active:
            self.body2.deactivate()
            self.body1.apply_impulse(self.collision_normal.mult(self.body2.kick_power))
            ##play audio





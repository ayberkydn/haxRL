from Body import Body

class Collision:
    def __init__(self, body1, body2):
        assert (isinstance(body1, Body) and isinstance(body2, Body))
        self.body1 = body1
        self.body2 = body2
        self.restitution = min(body1.restitution, body2.restitution)
        
    def resolve(self):
        self.resolve_impulse()
        self.resolve_penetration()
        
    def resolve_impulse(self):
        #https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
        
        #Don't handle collision if objects aren't actually colliding
        if self.velocity_along_normal > 0:
            return
            
        j = -(1 + self.restitution) * self.velocity_along_normal
        j /= self.body1.inv_mass + self.body2.inv_mass
        
        impulse = self.collision_normal.mult(j)
        
        self.body1.apply_impulse(impulse)
        self.body2.apply_impulse(impulse.mult(-1))


    def resolve_penetration(self):
        #https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
        percent = 1
        slop = 0.1
        correction = self.collision_normal.mult(percent * max(self.penetration_depth - slop, 0) / (self.body1.inv_mass + self.body2.inv_mass)) 
        self.body1.center = self.body1.center.add(correction.mult(self.body1.inv_mass))
        self.body2.center = self.body2.center.sub(correction.mult(self.body2.inv_mass))

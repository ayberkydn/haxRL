from Vector import Vector

class Body:
    def __init__(self, center_x, center_y, restitution):
        self.center = Vector(center_x, center_y)
        self.restitution = restitution
        self.velocity = Vector(0, 0)
        self.acceleration = Vector(0, 0)
        self.collision_mask = (Body, )
        
        
    def apply_force(self):
        raise NotImplementedError("apply_force not implemented")
    
    def apply_impulse(self):
        raise NotImplementedError("apply_impulse not implemented")
        
    def update(self):
        raise NotImplementedError("update not implemented")
        
    def draw(self):
        raise NotImplementedError("draw not implemented")
        
    def set_collision_mask(self, mask_array):
        self.collision_mask = tuple(mask_array)
        return self
    
    def make_ghost(self):
        self.collision_mask = tuple()
        return self
    
    def set_color(self, color):
        self.color = color
        return self
    
    def set_outer_color(self, color):
        self.outer_color = color
        return self

    def __str__(self):
        return "Body: Center = {} \n restitution = {} \n velocity {}".format(self.center, self.restitution, self.velocity)
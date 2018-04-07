from Body import Body
import math
from Color import Color
from Disc import Disc
from Way import Way

class Border(Body):
    def __init__(self, center_x, center_y, restitution, visible = True, ghost = False):
        super().__init__(center_x, center_y, restitution)
        self.mass = math.inf
        self.inv_mass = 0
        self.color = Color.border
        self.visible = visible
        self.extends_to = None
        self.collision_mask = [Disc]
   
    def extend_to(self, way):
        assert isinstance(way, Way)
        self.extends_to = way
        return self
    
    def update(self):
        pass

    def apply_impulse(self, impulse):
        pass



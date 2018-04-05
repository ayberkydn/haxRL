from Disc import Disc
from Color import Color

class Ball(Disc):
    def __init__(self, center_x, center_y, radius, mass, restitution, damping):
        super().__init__(center_x, center_y, radius, mass, restitution, damping, Color.white)

        
    
from VerticalBorder import VerticalBorder
from HorizontalBorder import HorizontalBorder
from Way import Way

class Box:
    def __init__(self, x_left, x_right, y_up, y_down, restitution):
        horiz_length = x_right - x_left
        vert_length = y_down - y_up
        assert (horiz_length > 0 and vert_length > 0)
        
        self.borders = {
                "up": HorizontalBorder((x_left + x_right) / 2, y_up, horiz_length, restitution, visible=False),
                "down": HorizontalBorder((x_left + x_right) / 2, y_down, horiz_length, restitution, visible=False),
                "left": VerticalBorder(x_left, (y_up + y_down) / 2, vert_length, restitution, visible=False),
                "right": VerticalBorder(x_right, (y_up + y_down) / 2, vert_length, restitution, visible=False),
        }
        
        self.borders["up"].extend_to(Way.up)
        self.borders["down"].extend_to(Way.down)
        self.borders["left"].extend_to(Way.left)
        self.borders["right"].extend_to(Way.right)

    def draw(self):
        for border in self.borders.values():
            border.draw()
    
    def update(self):
        self
from Border import Border
import pygame

class HorizontalBorder(Border):
    def __init__(self, center_x, center_y, length, restitution, visible = True, ghost = False):
        super().__init__(center_x, center_y, restitution, visible, ghost)
        self.length = length
        
    
    
    def draw(self):
        if self.visible:
            start_x = self.center.x - self.length / 2
            start_y = self.center.y
            end_x = self.center.x + self.length / 2
            end_y = start_y
            
            pygame.draw.lines(self.scene.screen, self.color, False, [(start_x, start_y), (end_x, end_y)], 3)
            
            
from Border import Border
import pygame

class VerticalBorder(Border):
    def __init__(self, center_x, center_y, length, restitution, visible = True, ghost = False):
        super().__init__(center_x, center_y, restitution, visible, ghost)
        self.length = length
        


    def draw(self):
        if self.visible:
            start_x = self.center.x
            start_y = self.center.y - self.length / 2
            end_x = start_x
            end_y = self.center.y + self.length / 2
            
            pygame.draw.lines(self.scene.screen, self.color, False, [(start_x, start_y), (end_x, end_y)], 3)
            
            
#    draw() {
#        if (this.visible) {
#            ctx.strokeStyle = this.color;
#            ctx.beginPath();
#            let startX = this.center.x;
#            let startY = this.center.y - this.length / 2;
#            let endX = startX;
#            let endY = this.center.y + this.length / 2;
#            ctx.moveTo(startX, startY);
#            ctx.lineTo(endX, endY);
#            ctx.stroke();
#        }
#    }
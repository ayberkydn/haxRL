from Border import Border

class VerticalBorder(Border):
    def __init__(self, center_x, center_y, length, restitution, visible = True, ghost = False):
        super().__init__(center_x, center_y, restitution, visible, ghost)
        self.length = length
        
    
    
    def draw(self):
        pass
##    
#
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
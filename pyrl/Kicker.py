from Body import Body
from Color import Color
import pygame

class Kicker(Body):
    def __init__(self, player, kick_power):
        super().__init__(player.center.x, player.center.y, 0)
        self.outer_color = Color.white
        self.color = Color.black
        self.hollow = True
        self.player = player
        self.active = False
        self.kick_power = kick_power
        self.radius = player.radius 
        self.center = player.center
        
        
    def activate(self):
        self.active = True
        self.color = Color.white
        
    def deactivate(self):
        self.active = False
        self.color = Color.black

    def update(self):
        self.center = self.player.center

    def draw(self):
        pygame.draw.circle(self.scene.screen, self.color, (int(self.center.x), int(self.center.y)), int(self.radius), 2)
        


#    draw() {
#        if (this.active) {
#            ctx.strokeStyle = Color.white;
#            ctx.beginPath();
#            ctx.arc(this.player.center.x, this.player.center.y, this.player.radius, 0, 2 * Math.PI);
#            ctx.lineWidth = 2;
#            ctx.stroke();
#        }
#    }
#
#
#}

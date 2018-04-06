from Body import Body
from Color import Color


class Kicker(Body):
    def __init__(self, player, kick_power):
        super().__init__(player.center_x, player.center_y, 0)
        self.outer_color = Color.white
        self.color = Color.black
        self.hollow = True
        self.player = player
        self.active = False
        self.kick_power = kick_power
        self.radius = player.radius + 3.5
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
        pass

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

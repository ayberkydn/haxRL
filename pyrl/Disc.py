from Body import Body
import math
from Color import Color
from Vector import Vector

class Disc(Body):
    def __init__(self, center_x, center_y, radius, mass, restitution, damping, color):
        super().__init__(center_x, center_y, restitution)        
        self.start_x = center_x
        self.start_y = center_y
        self.radius = radius
        self.mass = mass
        if mass == 0:
            self.inv_mass = math.inf
        else:
            self.inv_mass = 1 / mass            
        self.color = color
        self.damping = damping
        self.hollow = False
        self.outer_color = Color.black        
        
    def make_hollow(self):
        self.hollow = True
        return self
        
    def apply_force(self, force_vec):
        assert isinstance(force_vec, Vector)
        acceleration_delta = force_vec.div(self.mass)
        self.acceleration = self.acceleration.add(acceleration_delta)
        
    def apply_impulse(self, impulse_vec):
        assert isinstance(impulse_vec, Vector)
        velocity_delta = impulse_vec.div(self.mass)
        self.velocity = self.velocity.add(velocity_delta)
        
    def update(self):
        self.center = self.center.add(self.velocity)
        self.velocity = self.velocity.add(self.acceleration)
        self.velocity = self.velocity.mult(self.damping)
        self.acceleration = self.acceleration.mult(0)
    

a = Disc(1,2,3,4,5,6,7)






#
#    draw() 
#        if (this.hollow == false) {
#            ctx.fillStyle = this.color;
#            ctx.beginPath();
#            ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
#            ctx.fill();
#        }
#        ctx.strokeStyle = this.outerColor;
#        ctx.beginPath();
#        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
#        ctx.lineWidth = 2;
#        ctx.stroke();
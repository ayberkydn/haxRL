from Disc import Disc
from Kicker import Kicker
from Action import Action
from Vector import UnitVec
from Side import Side
from Color import Color


class Player(Disc):
    def __init__(self, center_x, center_y, radius, mass, restitution, damping, kick_damping, kick_power, side):
        if side == Side.red:
            color = Color.red
        elif side == Side.blue:
            color = Color.blue
        else:
            raise TypeError
        
        super().__init__(center_x, center_y, radius, mass, restitution, damping, color)
        self.side = side 
        self.nonkick_damping = damping
        self.kick_damping = kick_damping
        self.kicker = Kicker(self, kick_power)

    def apply_action(self, action):
        
        assert isinstance(action, Action)
        if action == Action.up:
            self.apply_force(UnitVec.up)
            self.kicker.deactivate()
            
        elif action == Action.upforward:
            self.apply_force(UnitVec.upright if self.side == Side.red else UnitVec.upleft)
            self.kicker.deactivate()
        
        elif action == Action.forward:
            self.apply_force(UnitVec.right if self.side == Side.red else UnitVec.left)
            self.kicker.deactivate()

        elif action == Action.downforward:
            self.apply_force(UnitVec.downright if self.side == Side.red else UnitVec.downleft)
            self.kicker.deactivate()

        elif action == Action.down:
            self.apply_force(UnitVec.down)
            self.kicker.deactivate()

        elif action == Action.downbackward:
            self.apply_force(UnitVec.downleft if self.side == Side.red else UnitVec.downright)
            self.kicker.deactivate()

        elif action == Action.backward:
            self.apply_force(UnitVec.left if self.side == Side.red else UnitVec.right)
            self.kicker.deactivate()

        elif action == Action.upbackward:
            self.apply_force(UnitVec.upleft if self.side == Side.red else UnitVec.upright)
            self.kicker.deactivate()

        elif action == Action.nomove:
            self.kicker.deactivate()
            
        elif action == Action.upshoot:
            self.apply_force(UnitVec.up)
            self.kicker.activate()
            
        elif action == Action.upforwardshoot:
            self.apply_force(UnitVec.upright if self.side == Side.red else UnitVec.upleft)
            self.kicker.activate()
        
        elif action == Action.forwardshoot:
            self.apply_force(UnitVec.right if self.side == Side.red else UnitVec.left)
            self.kicker.activate()

        elif action == Action.downforwardshoot:
            self.apply_force(UnitVec.downright if self.side == Side.red else UnitVec.downleft)
            self.kicker.activate()

        elif action == Action.downshoot:
            self.apply_force(UnitVec.down)
            self.kicker.activate()

        elif action == Action.downbackwardshoot:
            self.apply_force(UnitVec.downleft if self.side == Side.red else UnitVec.downright)
            self.kicker.activate()

        elif action == Action.backwardshoot:
            self.apply_force(UnitVec.left if self.side == Side.red else UnitVec.right)
            self.kicker.activate()

        elif action == Action.upbackwardshoot:
            self.apply_force(UnitVec.upleft if self.side == Side.red else UnitVec.upright)
            self.kicker.activate()
            
        elif action == Action.nomoveshoot:
            self.kicker.activate()

#        if action == Action.up:
#            self.apply_force(UnitVec.up)
#            self.kicker.deactivate()
#            
#        elif action == Action.upleft:
#            self.apply_force(UnitVec.upleft)
#            self.kicker.deactivate()
#        
#        elif action == Action.left:
#            self.apply_force(UnitVec.left)
#            self.kicker.deactivate()
#
#        elif action == Action.downleft:
#            self.apply_force(UnitVec.downleft)
#            self.kicker.deactivate()
#
#        elif action == Action.down:
#            self.apply_force(UnitVec.down)
#            self.kicker.deactivate()
#
#        elif action == Action.downright:
#            self.apply_force(UnitVec.downright)
#            self.kicker.deactivate()
#
#        elif action == Action.right:
#            self.apply_force(UnitVec.right)
#            self.kicker.deactivate()
#
#        elif action == Action.upright:
#            self.apply_force(UnitVec.upright)
#            self.kicker.deactivate()
#
#        elif action == Action.nomove:
#            self.kicker.deactivate()
#            
#        elif action == Action.upshoot:
#            self.apply_force(UnitVec.up)
#            self.kicker.activate()
#            
#        elif action == Action.upleftshoot:
#            self.apply_force(UnitVec.upleft)
#            self.kicker.activate()
#        
#        elif action == Action.leftshoot:
#            self.apply_force(UnitVec.left)
#            self.kicker.activate()
#
#        elif action == Action.downleftshoot:
#            self.apply_force(UnitVec.downleft)
#            self.kicker.activate()
#
#        elif action == Action.downshoot:
#            self.apply_force(UnitVec.down)
#            self.kicker.activate()
#
#        elif action == Action.downrightshoot:
#            self.apply_force(UnitVec.downright)
#            self.kicker.activate()
#
#        elif action == Action.rightshoot:
#            self.apply_force(UnitVec.right)
#            self.kicker.activate()
#
#        elif action == Action.uprightshoot:
#            self.apply_force(UnitVec.upright)
#            self.kicker.activate()
#            
#        elif action == Action.nomoveshoot:
#            self.kicker.activate()
#            
            
            


    def update(self):
        if self.kicker.active:
            self.damping = self.kick_damping
        else: 
            self.damping = self.nonkick_damping
        
        super().update()



    def draw(self):
        super().draw();
        self.kicker.draw()

    
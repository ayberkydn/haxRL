from Disc import Disc
from Kicker import Kicker
from Action import Action
from Vector import UnitVec
from Side import Side


class Player(Disc):
    def __init__(self, center_x, center_y, radius, mass, restitution, damping, kick_damping, kick_power, color):
        super().__init__(center_x, center_y, radius, mass, restitution, damping, color)
        self.agent = None
        self.nonkick_damping = damping
        self.kick_damping = kick_damping
        self.kicker = Kicker(self, kick_power)

    def apply_action(self, action):
        assert isinstance(action, Action)
        if action == Action.up:
            self.apply_force(UnitVec.up)
            self.kicker.deactivate()
            
        elif action == Action.upforward:
            self.apply_force(UnitVec.upright if self.agent.side == Side.red else UnitVec.upleft)
            self.kicker.deactivate()
        
        elif action == Action.forward:
            self.apply_force(UnitVec.right if self.agent.side == Side.red else UnitVec.left)
            self.kicker.deactivate()

        elif action == Action.downforward:
            self.apply_force(UnitVec.downright if self.agent.side == Side.red else UnitVec.downleft)
            self.kicker.deactivate()

        elif action == Action.down:
            self.apply_force(UnitVec.down)
            self.kicker.deactivate()

        elif action == Action.downbackward:
            self.apply_force(UnitVec.downleft if self.agent.side == Side.red else UnitVec.downright)
            self.kicker.deactivate()

        elif action == Action.backward:
            self.apply_force(UnitVec.left if self.agent.side == Side.red else UnitVec.right)
            self.kicker.deactivate()

        elif action == Action.upbackward:
            self.apply_force(UnitVec.upleft if self.agent.side == Side.red else UnitVec.upright)
            self.kicker.deactivate()

        elif action == Action.nomove:
            self.kicker.deactivate()
            
        elif action == Action.upshoot:
            self.apply_force(UnitVec.up)
            self.kicker.activate()
            
        elif action == Action.upforwardshoot:
            self.apply_force(UnitVec.upright if self.agent.side == Side.red else UnitVec.upleft)
            self.kicker.activate()
        
        elif action == Action.forwardshoot:
            self.apply_force(UnitVec.right if self.agent.side == Side.red else UnitVec.left)
            self.kicker.activate()

        elif action == Action.downforwardshoot:
            self.apply_force(UnitVec.downright if self.agent.side == Side.red else UnitVec.downleft)
            self.kicker.activate()

        elif action == Action.downshoot:
            self.apply_force(UnitVec.down)
            self.kicker.activate()

        elif action == Action.downbackwardshoot:
            self.apply_force(UnitVec.downleft if self.agent.side == Side.red else UnitVec.downright)
            self.kicker.activate()

        elif action == Action.backwardshoot:
            self.apply_force(UnitVec.left if self.agent.side == Side.red else UnitVec.right)
            self.kicker.activate()

        elif action == Action.upbackwardshoot:
            self.apply_force(UnitVec.upleft if self.agent.side == Side.red else UnitVec.upright)
            self.kicker.activate()
            
        elif action == Action.nomoveshoot:
            self.kicker.activate()


    def update(self):
        if self.kicker.active:
            self.damping = self.kick_damping
        else: 
            self.damping = self.nonkick_damping
        
        super().update()


#
#    draw() {
#        super.draw();
#        this.kicker.draw();
#    }
#}
#    applyActionHVS(actionH, actionV, actionS) {
#        // TODO
#        // HVS sirasında degilse exception yolla
#        let diagonal = (actionH != ActionH.nomove) && (actionV != ActionV.nomove);
#        let diagonalScale = diagonal ? Math.SQRT1_2 : 1;
#        let shoot = (actionS == ActionS.shoot);
#
#        if (actionH == ActionH.forward) {
#            let forwardVec = this.agent.side == Side.red ? Vector.Unit.right : Vector.Unit.left;
#            this.applyForce(Vector.mult(forwardVec, diagonalScale));
#        } else if (actionH == ActionH.backward) {
#            let backwardVec = this.agent.side == Side.red ? Vector.Unit.left : Vector.Unit.right;
#            this.applyForce(Vector.mult(backwardVec, diagonalScale));
#        }
#
#        if (actionV == ActionV.up) {
#            this.applyForce(Vector.mult(Vector.Unit.up, diagonalScale));
#        } else if (actionV == ActionV.down) {
#            this.applyForce(Vector.mult(Vector.Unit.down, diagonalScale));
#        }
#
#        if (actionS == ActionS.shoot) {
#            this.kicker.activate();
#        } else if (actionS == ActionS.nomove) {
#            this.kicker.deactivate();
#        }
#
#    }
#
from Side import Side
from Color import Color
from Vector import UnitVec
from Player import Player
from config import c_width, c_height, player_radius, player_mass,\
player_restitution, player_damping, player_kick_damping, player_kick_power

class Agent :
    def __init__(self):
        self.side = None
        self.env = None
        self.goal = None
        self.ball = None
        self.player = None
        self.opponent = None
    

    def set_side(self, side):
        self.side = side
        start_x =  120 if side == Side.red else c_width - 120
        color = Color.red if side == Side.red else Color.blue
        self.player = Player(start_x, c_height / 2, player_radius, player_mass, player_restitution, player_damping, player_kick_damping, player_kick_power, color)
        self.player.agent = self
        self.goal = self.env.scene.meta_objects['goals'][0 if side == Side.red else 1]
        self.forward_vec = UnitVec.right if side == Side.red else UnitVec.left
        self.up_vec = UnitVec.up
    

    def act(self):
        pass
    
    def learn(self):
        pass
from Agent import Agent
import pygame
from Action import Action
from Side import Side

class HumanAgent(Agent):
    def __init__(self, up_key, down_key, left_key, right_key, shoot_key):
        super().__init__()
        self.up_key = up_key
        self.down_key = down_key
        self.left_key = left_key
        self.right_key = right_key
        self.shoot_key = shoot_key
        
        self.up = False
        self.down = False
        self.left = False
        self.right = False
        self.shoot = False

    def act(self):
        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                if event.key == self.up_key:
                    self.up = True
                if event.key == self.down_key:
                    self.down = True
                if event.key == self.left_key:    
                    self.left = True
                if event.key == self.right_key:
                    self.right = True
                if event.key == self.shoot_key:
                    self.shoot = True
            elif event.type == pygame.KEYUP:
                if event.key == self.up_key:
                    self.up = False
                if event.key == self.down_key:
                    self.down = False
                if event.key == self.left_key:    
                    self.left = False
                if event.key == self.right_key:
                    self.right = False
                if event.key == self.shoot_key:
                    self.shoot = False
                    
        if (self.shoot):
            if (self.up):
                if (self.left):
                    self.player.apply_action(Action.upforwardshoot if self.side == Side.blue else Action.upbackwardshoot)
                elif (self.right):
                    self.player.apply_action(Action.upbackwardshoot if self.side == Side.blue else Action.upforwardshoot)
                else:
                    self.player.apply_action(Action.upshoot)
                
            elif (self.down):
                if (self.left):
                    self.player.apply_action(Action.downforwardshoot if self.side == Side.blue else Action.downbackwardshoot)
                elif (self.right):
                    self.player.apply_action(Action.downbackwardshoot if self.side == Side.blue else Action.downforwardshoot)
                else:
                    self.player.apply_action(Action.downshoot)
                
            else:
                if (self.left):
                    self.player.apply_action(Action.forwardshoot if self.side == Side.blue else Action.backwardshoot)
                elif (self.right):
                    self.player.apply_action(Action.backwardshoot if self.side == Side.blue else Action.forwardshoot)
                else:
                    self.player.apply_action(Action.nomoveshoot)
        
                
        else:
            if (self.up):
                if (self.left):
                    self.player.apply_action(Action.upforward if self.side == Side.blue else Action.upbackward)
                elif (self.right):
                    self.player.apply_action(Action.upbackward if self.side == Side.blue else Action.upforward)
                else:
                    self.player.apply_action(Action.up)
                
            elif (self.down):
                if (self.left):
                    self.player.apply_action(Action.downforward if self.side == Side.blue else Action.downbackward)
                elif (self.right):
                    self.player.apply_action(Action.downbackward if self.side == Side.blue else Action.downforward)
                else:
                    self.player.apply_action(Action.down)
                
            else:
                if (self.left):
                    self.player.apply_action(Action.forward if self.side == Side.blue else Action.backward)
                elif (self.right):
                    self.player.apply_action(Action.backward if self.side == Side.blue else Action.forward)
                else:
                    self.player.apply_action(Action.nomove)
                
            
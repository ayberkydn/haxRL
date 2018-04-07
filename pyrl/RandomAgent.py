from Agent import Agent
from Action import Action

class ForwardAgent(Agent):
    def __init__(self):
        super().__init__()
        
    
    def act(self):
        self.player.apply_action(Action.upforwardshoot)
        
        

    



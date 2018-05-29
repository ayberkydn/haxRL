from Models import ANN, DQN
import torch
from torch.autograd import Variable
import numpy as np

class GeneticAgent:
    def __init__(self, model=None):
        if model:
            self.model = model
        else:
            raise Exception
        
    def copy(self):
        return GeneticAgent(model = self.model.copy())
    
    def mutate(self, std):
        self.model.noise_params(std)
        return self
    
    def select_action(self, state):    
        probs = self.model(Variable(torch.FloatTensor(np.expand_dims(state, 0))))
        probs_data = probs.data.numpy()
        if np.random.random() < 0.1:
            out = np.random.randint(len(probs_data[0]))
        else:
            out = np.argmax(probs_data[0])
        
        
        return out   
                
        
    
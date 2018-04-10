import numpy as np
from collections import deque

class ExperienceReplay:
    def __init__(self, capacity):
        self.replay = deque(maxlen = capacity)
        
    def sample(self, batch_size):
        rand_ind = np.random.randint(0, len(self.replay), batch_size)
        exp_batch = []
        for n in rand_ind:
            exp_batch.append(self.replay[n])
        return exp_batch
    
        
    def store(self, exp):
        assert (type(exp) == tuple)        
        self.replay.append(exp)
            
        
    
from collections import deque
import math
import random

class ExperienceReplay:
    def __init__(self, capacity):
        self.capacity = capacity
        self.replay = deque(maxlen = capacity)
    

    def add_experience(self, siarssii):
        self.replay.append(siarssii.copy())
        

    def sample_experience(self, batch_size = 1):
        batch = {
            "s_batch": [],
            "i_batch": [],
            "a_batch": [],
            "ss_batch": [],
            "ii_batch": [],
            "r_batch": [],
        }
        
        for n in range(batch_size):
            rand_index = math.floor(random.random() * len(self.replay))
            batch['s_batch'].append(self.replay[rand_index]['s'])
            batch['i_batch'].append(self.replay[rand_index]['i'])
            batch['a_batch'].append(self.replay[rand_index]['a'])
            batch['ss_batch'].append(self.replay[rand_index]['ss'])
            batch['ii_batch'].append(self.replay[rand_index]['ii'])
            batch['r_batch'].append(self.replay[rand_index]['r'])
        
        return batch
    

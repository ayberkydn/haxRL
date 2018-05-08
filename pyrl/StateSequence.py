import numpy as np
class StateSequence:
    def __init__(self, shape, format = "HWC"):
        self.shape = shape[:-1]
        self.length = shape[-1]
        if len(shape) == 2:
            format = "FC"
        self.format = format
        self.reset()
        
        
    def append_obs(self, obs):
        assert len(obs.shape) < 3
        if self.format == "HWC":    
            obs = np.expand_dims(obs, -1)
            self.states = np.append(self.states, obs, axis = -1)
            self.states = self.states[:, :, 1:]
        elif self.format == "CHW":
            obs = np.expand_dims(obs, 0)
            self.states = np.append(self.states, obs, axis = 0)
            self.states = self.states[1:, :, :]
        elif self.format == "FC":
            obs = np.expand_dims(obs, -1)
            self.states = np.append(self.states, obs, axis = 1)
            self.states = self.states[:, 1:]
            
        
    def get_sequence(self):
        return self.states[:]
    
    
    def reset(self):
        if self.format == "HWC":
            self.states = np.zeros([*self.shape, self.length], dtype=np.uint8)
        elif self.format == "CHW":
            self.states = np.zeros([self.length, *self.shape], dtype=np.uint8)
        elif self.format == "FC":
            self.states = np.zeros([*self.shape, self.length], dtype=np.uint8)
        
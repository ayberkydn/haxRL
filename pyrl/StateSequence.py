import numpy as np
class StateSequence:
    def __init__(self, shape, length, format = "HWC"):
        self.shape = shape
        self.format = format
        if format == "HWC":
            self.states = np.zeros([*shape, length], dtype=np.uint8)
        elif format == "CHW":
            self.states = np.zeros([length, *shape], dtype=np.uint8)
        elif format == "FC":
            self.states = np.zeros([*shape, length], dtype=np.uint8)
        
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
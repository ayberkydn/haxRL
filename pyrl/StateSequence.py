from collections import deque
import numpy as np
class StateSequence:
    def __init__(self, shape):
        self.shape = shape
        self.states = np.zeros(shape)
        
    def append_state(self, state):
        if (state.shape[:] == self.states.shape[:-1]):
            state = np.expand_dims(state, -1)
            
        self.states = np.concatenate([self.states, state], axis = -1)
        self.states = np.delete(self.states, 0, -1)
        assert self.states.shape == tuple(self.shape)
    def get_sequence(self):
        return self.states[:]
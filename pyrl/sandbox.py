import gym
import time
import numpy as np
from DQNAgent import DQNAgent
from funcs import preprocess_state, show
import matplotlib.pyplot as plt
import scipy



env = gym.make('Pong-v0')

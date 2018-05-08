import tensorflow as tf
import numpy as np
import gym
from PPOAgent import PPOAgent

class LearningPlatform:
    def __init__(self):
        self.env = gym.make("CartPole-v0")
        self.agent = PPOAgent()
        
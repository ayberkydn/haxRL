import tensorflow as tf
import numpy as np
import gym
import matplotlib.pyplot as plt
from DQNAgent import DQNAgent
from Environments import PenaltyEnvironment
from StateSequence import StateSequence
from StateProcessor import StateProcessor
from time import sleep


class DQNPlatform:
    def __init__(self):
        self.frame_skip = 4
        self.exp_scale = 0.1
        self.time_scale = 1
        
        
#        self.env = gym.make("Pong-v0")
#        self.env.unwrapped.frameskip = self.frame_skip
        self.env = PenaltyEnvironment() 
        self.steps_to_train = int(self.time_scale * 5e7)
        self.agent = DQNAgent(num_actions=self.env.action_space.n, 
                              experience_replay_capacity = 1e6 * self.exp_scale, 
                              frame_skip=self.frame_skip, 
                              starting_experience = 5e4 * self.exp_scale, 
                              discount = 0.99, 
                              batch_size = 32, 
                              update_frequency = 4 * self.time_scale, 
                              target_update_frequency = 1e4 * self.time_scale, 
                              starting_epsilon = 1, 
                              final_epsilon = 0.1,
                              final_epsilon_step = 1e6 * self.time_scale)
        
        self.steps_played = 0
        self.env.reset()
        self.sequence = StateSequence([84, 84], 4)
        self.processor = StateProcessor()



    def train(self, sess):
        for n in range(self.steps_to_train):
            state = self.sequence.get_sequence()
            action = self.agent.select_action(sess, state)
            obs, reward, done, info = self.env.step(action)
                
            self.sequence.append_obs(self.processor.process(sess, obs))
            state_prime = self.sequence.get_sequence()
            self.agent.learn(sess, state, action, reward, state_prime, done)

            self.env.render()
            if done:
                self.env.reset()
            self.steps_played += 1
            if n % 10000 == 0:
                print(self.steps_played / self.steps_to_train * 100, "%")
        
    def test(self, sess):
        self.agent.epsilon = 0
        done = False
        self.env.reset()
        while not done:
            state = self.sequence.get_sequence()
            action = self.agent.select_action(sess, state)
            obs, reward, done, info = self.env.step(action)
            self.sequence.append_obs(self.processor.process(sess, obs))
            self.env.render()
            sleep(0.1)
        
        
        
import tensorflow as tf
import numpy as np
import gym
import matplotlib.pyplot as plt
from DQNAgent import DQNAgent
from ANNAgent import ANNAgent
from Environments import PenaltyEnvironment
from StateSequence import StateSequence
from StateProcessor import StateProcessor
from time import sleep


class ANNPlatform:
    def __init__(self):
        self.env = gym.make("Pong-ram-v0")
        self.frame_skip = 4
        self.env.unwrapped.frameskip = self.frame_skip
        self.exp_scale = 0.1
        self.time_scale = 1
        
        
        self.frames_to_train = int(self.time_scale * 40000000)
        self.agent = ANNAgent(num_actions=self.env.action_space.n, 
                              experience_replay_capacity = 1000000 * self.exp_scale, 
                              frame_skip=self.frame_skip, 
                              starting_experience = 50000 * self.exp_scale, 
                              discount = 0.99, 
                              batch_size = 32, 
                              update_frequency = 4 * self.time_scale, 
                              target_update_frequency = 10000 * self.time_scale, 
                              starting_epsilon = 1, 
                              final_epsilon = 0.1,
                              final_epsilon_frame = 1000000 * self.time_scale)
        
        self.frames_played = 0
        self.env.reset()
        self.sequence = StateSequence([128], 4, "FC")



    def train(self, sess):
        for n in range(self.frames_to_train // self.frame_skip):
            state = self.sequence.get_sequence()
            action = self.agent.select_action(sess, state)
            obs, reward, done, info = self.env.step(action)
                
            self.sequence.append_obs(obs)
            state_prime = self.sequence.get_sequence()
            self.agent.learn(sess, state, action, reward, state_prime, done)

            self.env.render()
            if done:
                self.env.reset()
            self.frames_played += self.frame_skip
            if n % 10000 == 0:
                print(self.frames_played / self.frames_to_train * 100, "%")
        
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
        
        
        
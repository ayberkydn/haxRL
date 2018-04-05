                

# -*- coding: utf-8 -*-

from keras.models import Sequential
from keras import layers
import keras
import numpy as np
import random
from ExperienceReplay import ExperienceReplay

class DQNAgent():
    def __init__(self, input_shape, num_actions):
        #Parameters        
        self.NUM_ACTIONS = num_actions
        self.INPUT_SHAPE = input_shape
        self.BATCH_SIZE = 32
        self.DISCOUNT = 0.995
        self.EXPERIENCE_REPLAY_CAPACITY = 20000
        self.STARTING_EXPERIENCE = 20000
        self.EPSILON = 0.1
        self.TARGET_UPDATE_FREQUENCY = 500
        
        self.learn_step = 0
        self.episode_step = 0
        self.episode_reward = 0


        #Experience replay
        self.experience_replay = ExperienceReplay(self.EXPERIENCE_REPLAY_CAPACITY)
                
        
        
        #Deep Q Network
        self.model = Sequential()
        self.model.add(layers.Conv2D(filters=32, kernel_size=8, strides=4, input_shape = self.INPUT_SHAPE))
        self.model.add(layers.Activation("relu"))
        self.model.add(layers.Conv2D(filters=64, kernel_size=4, strides=2))
        self.model.add(layers.Activation("relu"))
        self.model.add(layers.Conv2D(filters=64, kernel_size=3, strides=1))
        self.model.add(layers.Activation("relu"))
        self.model.add(layers.Flatten())
        self.model.add(layers.Dense(units=512))
        self.model.add(layers.Activation("relu"))
        self.model.add(layers.Dense(units=self.NUM_ACTIONS))
        self.model.compile(optimizer=keras.optimizers.adam(),
                           loss='mse')


        #Target Deep Q Network
        self.target_model = keras.models.clone_model(self.model)
        self.target_model.set_weights(self.model.get_weights())
        
        
        

    def act(self, state):
        if random.random() < self.EPSILON:
            return random.randint(0, self.NUM_ACTIONS - 1)
        else:
            q_batch = self.model.predict_on_batch(np.expand_dims(state, 0))
            return np.argmax(q_batch[0])        
        
    def store_sarst(self, sarst):
        self.experience_replay.store(tuple(sarst))
        
    def accumulate_reward(self, reward):
        self.episode_reward += reward * (self.DISCOUNT ** self.episode_step)
        
    def learn(self, sarst):
        
        self.store_sarst(sarst)
        self.accumulate_reward(sarst[2])
        self.episode_step += 1
        
        
        if (len(self.experience_replay.replay) < self.STARTING_EXPERIENCE):
            return
        
        else:
            exp_batch = self.experience_replay.sample(self.BATCH_SIZE)
            s_batch = np.array([exp[0] for exp in exp_batch])
            a_batch = np.array([exp[1] for exp in exp_batch])
            r_batch = np.array([exp[2] for exp in exp_batch])
            ss_batch = np.array([exp[3] for exp in exp_batch])
            t_batch = np.array([int(exp[4]) for exp in exp_batch])
            
            ss_q_batch = self.target_model.predict_on_batch(ss_batch)
            
            ss_max_q_batch_indices = np.argmax(self.model.predict_on_batch(ss_batch), axis=1)
            ##ss_max_q_batch = np.max(ss_q_batch, axis=1)
            ss_max_q_batch = ss_q_batch[np.arange(self.BATCH_SIZE), ss_max_q_batch_indices]
            s_target_values = r_batch + self.DISCOUNT * ss_max_q_batch * (1 - t_batch)
            s_target_q_batch = self.model.predict_on_batch(s_batch)
            for n in range(self.BATCH_SIZE):
                if s_target_q_batch[n][a_batch[n]] - s_target_values[n] > 1:
                    s_target_q_batch[n][a_batch[n]] -= 1
                elif s_target_q_batch[n][a_batch[n]] - s_target_values[n] < -1:
                    s_target_q_batch[n][a_batch[n]] += 1
                else:
                    s_target_q_batch[n][a_batch[n]] = s_target_values[n]
            
            s_target_q_batch[np.arange(self.BATCH_SIZE), a_batch] = s_target_values
            
            
            self.model.train_on_batch(s_batch, s_target_q_batch)
            self.learn_step += 1
            if self.learn_step % self.TARGET_UPDATE_FREQUENCY == 0:
                self.target_model.set_weights(self.model.get_weights())
            
    def reset_episode(self):
        reward_to_return = self.episode_reward
        self.episode_reward = 0
        self.episode_step = 0
        return reward_to_return
        
        
        
        
        
    
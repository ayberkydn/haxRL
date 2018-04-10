# -*- coding: utf-8 -*-

from keras.models import Sequential
from keras import layers
import keras
import numpy as np
import random
from ExperienceReplay import ExperienceReplay
import matplotlib.pyplot as plt

class ANNAgent():
    def __init__(self, input_shape, num_actions):
        #Parameters        
        self.NUM_ACTIONS = num_actions
        self.INPUT_SHAPE = input_shape
        self.BATCH_SIZE = 32
        self.DISCOUNT = 0.95
        self.EXPERIENCE_REPLAY_CAPACITY = 10 ** 6
        self.STARTING_EXPERIENCE = 500
        self.EPSILON = 0.3
        self.TARGET_UPDATE_FREQUENCY = 100
        
        self.learn_step = 0
        self.episode_step = 0
        self.episode_reward = 0


        #Experience replay
        self.experience_replay = ExperienceReplay(self.EXPERIENCE_REPLAY_CAPACITY)
                
#        
        #Deep Q Network for ANN
        self.model = Sequential()
        self.model.add(layers.Dense(units=50, input_shape = self.INPUT_SHAPE))
        self.model.add(layers.Activation("tanh"))
        self.model.add(layers.Dense(units=50))
        self.model.add(layers.Activation("tanh"))
        self.model.add(layers.Dense(units=self.NUM_ACTIONS))
        self.model.compile(optimizer=keras.optimizers.SGD(),
                           loss='mse')

    
                
#        #Deep Q Network for DQN
#        self.model = Sequential()
#        self.model.add(layers.Conv2D(filters=32, kernel_size=8, strides=4, input_shape = self.INPUT_SHAPE))
#        self.model.add(layers.Activation("relu"))
#        self.model.add(layers.Conv2D(filters=64, kernel_size=4, strides=2))
#        self.model.add(layers.Activation("relu"))
#        self.model.add(layers.Conv2D(filters=64, kernel_size=3, strides=1))
#        self.model.add(layers.Activation("relu"))
#        self.model.add(layers.Flatten())
#        self.model.add(layers.Dense(units=512))
#        self.model.add(layers.Activation("relu"))
#        self.model.add(layers.Dense(units=self.NUM_ACTIONS))
#        self.model.compile(optimizer=keras.optimizers.adam(),
#                           loss='mse')

        #Target Deep Q Network
        self.target_model = keras.models.clone_model(self.model)
        self.target_model.set_weights(self.model.get_weights())
        
        
        

    def act(self, state):
        if random.random() < self.EPSILON:
            return random.randint(0, self.NUM_ACTIONS - 1)
        else:
            q_batch = self.model.predict_on_batch(np.expand_dims(state, 0))
            return np.argmax(q_batch[0])        
        

    def accumulate_reward(self, reward):
        self.episode_reward += reward * (self.DISCOUNT ** self.episode_step)
        
    def learn(self, sarst):
        
        self.experience_replay.store(tuple(sarst))
        self.accumulate_reward(sarst[2])
        self.episode_step += 1
        
        
        if (len(self.experience_replay.replay) < self.STARTING_EXPERIENCE):
            return
        
        else:
#            print("\n-------------------------\n")
            exp_batch = self.experience_replay.sample(self.BATCH_SIZE)
#            print("exp_batch\n", exp_batch)
            
            s_batch = np.array([exp[0] for exp in exp_batch])
#            print("s_batch\n", s_batch)
            
            a_batch = np.array([exp[1] for exp in exp_batch])
#            print("a_batch", a_batch)
            
            r_batch = np.array([exp[2] for exp in exp_batch])
#            print("r_batch", r_batch)
            
            ss_batch = np.array([exp[3] for exp in exp_batch])
#            print("ss_batch\n", ss_batch)
            
            t_batch = np.array([int(exp[4]) for exp in exp_batch])
#            print("t_batch", t_batch)
                        
            target_model_output_on_ss = self.target_model.predict_on_batch(ss_batch)
#            print("target_model_output_on_ss\n", target_model_output_on_ss)
            
            model_output_on_ss = self.model.predict_on_batch(ss_batch)
#            print("model_output_on_ss", model_output_on_ss)
            
            ss_max_q_batch_indices = np.argmax(model_output_on_ss, axis=1) ####TARGET: QN, MODEL:DQN
#            print("ss_max_q_batch_indices\n", ss_max_q_batch_indices)
            
            ss_max_q_batch = target_model_output_on_ss[np.arange(self.BATCH_SIZE), ss_max_q_batch_indices]
#            print("ss_max_q_batch\n", ss_max_q_batch)
                        
            s_target_values = r_batch + self.DISCOUNT * ss_max_q_batch * (1 - t_batch)
#            print("s_target_values\n", s_target_values)
            
            model_output_on_s = self.model.predict_on_batch(s_batch)
#            print("model_output_on_s\n", model_output_on_s)
            
            
            s_target_q_batch = model_output_on_s[:]
            ##loss clipping
            for n in range(self.BATCH_SIZE):
                if s_target_q_batch[n][a_batch[n]] - s_target_values[n] > 1:
                    s_target_q_batch[n][a_batch[n]] -= 1
                elif s_target_q_batch[n][a_batch[n]] - s_target_values[n] < -1:
                    s_target_q_batch[n][a_batch[n]] += 1
                else:
                    s_target_q_batch[n][a_batch[n]] = s_target_values[n]
            
            
#            print("target", s_target_q_batch)
            
            
            self.model.train_on_batch(s_batch, s_target_q_batch)
#            print("model_output_on_s(after training)\n", self.model.predict_on_batch(s_batch))
            
            self.learn_step += 1
            if self.learn_step % self.TARGET_UPDATE_FREQUENCY == 0:
                self.target_model.set_weights(self.model.get_weights())
            
    def reset_episode(self):
        reward_to_return = self.episode_reward
        self.episode_reward = 0
        self.episode_step = 0
        return reward_to_return
                

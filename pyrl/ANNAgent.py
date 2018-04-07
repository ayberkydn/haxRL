# -*- coding: utf-8 -*-

from keras.models import Sequential
from keras import layers
import keras
import numpy as np
import random
from ExperienceReplay import ExperienceReplay
from Agent import Agent
from Action import Action
import math
from Vector import Vector
from config import c_width, c_height, leftright_margin, topbottom_margin


class noANNAgent():
    def __init__(self, input_shape, num_actions):
        #Parameters        
        self.NUM_ACTIONS = num_actions
        self.INPUT_SHAPE = input_shape
        self.BATCH_SIZE = 32
        self.DISCOUNT = 0.95
        self.EXPERIENCE_REPLAY_CAPACITY = 10000
        self.STARTING_EXPERIENCE = 100
        self.EPSILON = 0.1
        self.TARGET_UPDATE_FREQUENCY = 500
        
        self.learn_step = 0
        self.episode_step = 0
        self.episode_reward = 0


        #Experience replay
        self.experience_replay = ExperienceReplay(self.EXPERIENCE_REPLAY_CAPACITY)
                
        
        #Deep Q Network
        self.model = Sequential()
        self.model.add(layers.Flatten(input_shape=self.INPUT_SHAPE))
        self.model.add(layers.Dense(units=200))
        self.model.add(layers.Activation("relu"))
        self.model.add(layers.Dense(units=200))
        self.model.add(layers.Activation("relu"))
        self.model.add(layers.Dense(units=self.NUM_ACTIONS))
        self.model.compile(optimizer=keras.optimizers.rmsprop(0.00025),
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
        
    
    
    
    
    
    
    
    
    
    
    
class ANNAgent(Agent):
    def __init__(self):
        super().__init__()
        self.action_space = 4
        self.state_shape = (12,)



        #Deep Q Network
        self.model = Sequential()
        self.model.add(layers.Dense(units=200, input_shape=self.state_shape))
        self.model.add(layers.Activation("relu"))
        self.model.add(layers.Dense(units=200))
        self.model.add(layers.Activation("relu"))
        self.model.add(layers.Dense(units=self.action_space))
        self.model.compile(optimizer=keras.optimizers.rmsprop(0.00025),
                           loss='mse')

        #Target Deep Q Network
        self.target_model = keras.models.clone_model(self.model)
        self.target_model.set_weights(self.model.get_weights())
     
        
        
        
           


        self.experience_replay_capacity = 10000
        self.experience_replay_starting = 100
        self.batch_size = 32
        self.experience_replay = ExperienceReplay(self.experience_replay_capacity)
        self.discount = 0.8
        self.last_siassiir = {}
        self.action_repeat = 4
        self.target_update_freq = self.experience_replay_starting
        self.epsilon = 0
        self.learn_step = 0
        self.repeat_cooldown = 0
        self.target_update_cooldown = 0
        self.last_action = None
    


    def act(self):
        if (self.repeat_cooldown > 0): #repeat action
            self.repeat_cooldown -= 1
            self.player.apply_action(self.last_action)

        else: #select new action
            self.repeat_cooldown = self.action_repeat
            self.last_siassiir['s'] = self.get_state()
            self.last_siassiir['i'] = self.get_state_info()
            #console.log((self.model.forward([self.last_siassiir.s])[0]).map(x => x.toFixed(2)))


            if random.random() < self.epsilon:
                action_index = math.floor(random.random() * self.action_space)
            else:
                action_index = np.argmax(self.model.predict_on_batch(np.expand_dims(self.last_siassiir['s'], 0))[0])
            
            action = list(Action)[action_index]
            self.last_siassiir['a'] = action_index
            self.player.apply_action(action)
            self.last_action = action
        
    


    def learn(self):
        if self.repeat_cooldown == 0 or self.episode_terminated(): #means new action to be made or terminal state is reached
            self.last_siassiir['ss'] = self.get_state()
            self.last_siassiir['ii'] = self.get_state_info()
            self.last_siassiir['r'] = self.get_reward(self.last_siassiir['s'], self.last_siassiir['i'], self.last_siassiir['a'], self.last_siassiir['ss'], self.last_siassiir['ii'])
            self.experience_replay.add_experience(self.last_siassiir)
            if (len(self.experience_replay.replay) < self.experience_replay_starting):
                return
            
            exp_batch = self.experience_replay.sample_experience(self.batch_size)
            s_batch, a_batch, ss_batch, ii_batch, r_batch = exp_batch['s_batch'], exp_batch['a_batch'], exp_batch['ss_batch'], exp_batch['ii_batch'], exp_batch['r_batch']
            t_batch = []
            for n in range(self.batch_size):
                print(ii_batch)
                t_batch.append(1 if ii_batch[n]['terminal_state'] else 0)
            
            s_batch = np.array(s_batch)
            ss_batch = np.array(ss_batch)
            t_batch = np.array(t_batch)
            r_batch = np.array(r_batch)
            a_batch = np.array(a_batch)            
            
            ss_q_batch = self.target_model.predict_on_batch(ss_batch)
            
            ss_max_q_batch_indices = np.argmax(self.model.predict_on_batch(ss_batch), axis=1)
            ##ss_max_q_batch = np.max(ss_q_batch, axis=1)
            ss_max_q_batch = ss_q_batch[np.arange(self.batch_size), ss_max_q_batch_indices]
            s_target_values = r_batch + self.discount * ss_max_q_batch * (1 - t_batch)
            s_target_q_batch = self.model.predict_on_batch(s_batch)
            
            for n in range(self.batch_size):
                s_target_q_batch[n][a_batch[n]] = s_target_values[n]
            
            s_target_q_batch[np.arange(self.batch_size), a_batch] = s_target_values
            
            self.model.train_on_batch(s_batch, s_target_q_batch)
            
            self.learn_step += 1
            if self.epsilon > 0.001:
                self.epsilon -= 0.00001
            else:
                self.epsilon = 0.001

            if self.target_update_cooldown == 0:
                self.target_model.set_weights(self.model.get_weights())
                self.target_update_cooldown = self.target_update_freq
            else:
                self.target_update_cooldown -= 1
            
            
    def get_state(self):
        s_info = self.get_state_info()
        center = Vector.add(self.goal.center, self.opponent.goal.center).div(2)
        fwd_norm_fact = 1 / (c_width / 2 - leftright_margin)
        up_norm_fact = 1 / (c_height / 2 - topbottom_margin)
        vel_norm_fact = 0.2

        player_rel_loc = Vector.sub(s_info['player_location'], center)
        opponent_rel_loc = Vector.sub(s_info['opponent_location'], center)
        ball_rel_loc = Vector.sub(s_info['ball_location'], center)

        player_rel_forward = Vector.dot(player_rel_loc, self.forward_vec) * fwd_norm_fact
        player_rel_up = Vector.dot(player_rel_loc, self.up_vec) * up_norm_fact

        opponent_rel_forward = Vector.dot(opponent_rel_loc, self.forward_vec) * fwd_norm_fact
        opponent_rel_up = Vector.dot(opponent_rel_loc, self.up_vec) * up_norm_fact

        ball_rel_forward = Vector.dot(ball_rel_loc, self.forward_vec) * fwd_norm_fact
        ball_rel_up = Vector.dot(ball_rel_loc, self.up_vec) * up_norm_fact

        player_vel_forward = Vector.dot(s_info['player_velocity'], self.forward_vec) * vel_norm_fact
        player_vel_up = Vector.dot(s_info['player_velocity'], self.up_vec) * vel_norm_fact

        opponent_vel_forward = Vector.dot(s_info['opponent_velocity'], self.forward_vec) * vel_norm_fact
        opponent_vel_up = Vector.dot(s_info['opponent_velocity'], self.up_vec) * vel_norm_fact

        ball_vel_forward = Vector.dot(s_info['ball_velocity'], self.forward_vec) * vel_norm_fact
        ball_vel_up = Vector.dot(s_info['ball_velocity'], self.up_vec) * vel_norm_fact

        #print(player_rel_forward, player_rel_up, opponent_rel_forward, opponent_rel_up, ball_rel_forward, ball_rel_up, player_vel_forward, player_vel_up, opponent_vel_forward, opponent_vel_up, ball_vel_forward, ball_vel_up)
        return [player_rel_forward, player_rel_up, opponent_rel_forward, opponent_rel_up, ball_rel_forward, ball_rel_up, player_vel_forward, player_vel_up, opponent_vel_forward, opponent_vel_up, ball_vel_forward, ball_vel_up]

    

    def get_state_info(self):
        return {
            "terminal_state": self.episode_terminated(),
            "player_location": self.player.center.copy(),
            "opponent_location": self.opponent.player.center.copy(),
            "ball_location": self.ball.center.copy(),
            "player_velocity": self.player.velocity.copy(),
            "opponent_velocity": self.opponent.player.velocity.copy(),
            "ball_velocity": self.ball.velocity.copy(),
        }

    def episode_terminated(self):
        return self.env.episode_end

    def get_reward(self, s, i, a, ss, ii):
        goal = ss[4] > 1
        ball_fwd = ss[10] > 0.2
        s_dist_to_ball = Vector.dist(Vector(s[4], s[5]), Vector(s[0], s[1]))
        ss_dist_to_ball = Vector.dist(Vector(ss[4], ss[5]), Vector(ss[0], ss[1]))
        closing = ss_dist_to_ball + 0.02 < s_dist_to_ball
        reward = goal * 5 + ball_fwd * 0.2 + closing * 0.2 - 0.1
        return reward

    
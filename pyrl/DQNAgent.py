from DQN import DQN
import numpy as np
from ExperienceReplay import ExperienceReplay
from ModelParametersCopier import ModelParametersCopier
import tensorflow as tf


class DQNAgent:
    def __init__(self, 
                 num_actions, 
                 experience_replay_capacity, 
                 frame_skip, starting_experience, 
                 discount, batch_size, 
                 update_frequency, 
                 target_update_frequency,
                 starting_epsilon,
                 final_epsilon,
                 final_epsilon_frame
                 ):
        self.num_actions = num_actions
        self.model = DQN("value_network", num_actions)
        self.target_model = DQN("target_network", num_actions)
        self.experience_replay_capacity = experience_replay_capacity
        self.experience_replay = ExperienceReplay(self.experience_replay_capacity)
        self.model_parameters_copier = ModelParametersCopier(self.model, self.target_model)
        self.frame_skip = frame_skip
        self.starting_experience = starting_experience 
        self.discount = discount
        self.batch_size = batch_size
        self.update_frequency = update_frequency
        self.target_update_frequency = target_update_frequency
        self.starting_epsilon = starting_epsilon
        self.final_epsilon = final_epsilon
        self.final_epsilon_frame = final_epsilon_frame
        self.epsilon_annealing_rate = (self.final_epsilon - self.starting_epsilon) / (self.final_epsilon_frame * self.frame_skip)
        
        self.epsilon = self.starting_epsilon
        self.learn_step = 0
        self.act_step = 0
        self.frame = 0
        
    def select_action(self, sess, state):
        self.act_step += 1
        self.frame += self.frame_skip
        
        if self.epsilon > self.final_epsilon:
            self.epsilon -= self.frame_skip * self.epsilon_annealing_rate
        else:
            self.epsilon = self.final_epsilon
        
        if np.random.random() < self.epsilon:
            return np.random.randint(0, self.num_actions)
        else:
            preds = self.model.predict(sess, state)
            return np.argmax(preds, axis=1)[0]
        
    def _store_exp(self, state, action, reward, state_prime, done):
        exp = (state, action, reward, state_prime, done)
        self.experience_replay.store(exp)
        
    def learn(self, sess, state, action, reward, state_prime, done):            
        
        
        self._store_exp(state, action, reward, state_prime, done)
        
        if len(self.experience_replay.replay) < self.starting_experience:
            return
        elif self.act_step % self.update_frequency != 0:
            return
        else:
            self.learn_step += 1
        
        
        exp_batch = self.experience_replay.sample(self.batch_size)
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
        
#        model_output_on_ss = self.model.predict(sess, ss_batch)
#        
#        action_indices_to_calculate_y = np.argmax(model_output_on_ss, axis = 1)
#        target_qs_on_ss = self.target_model.predict_with_actions(sess, ss_batch, action_indices_to_calculate_y)
#        y_batch = r_batch + self.discount * target_qs_on_ss * (1 - t_batch)
#    
        
        target_model_output_on_ss = self.target_model.predict(sess, ss_batch)
        y_batch = r_batch + self.discount * np.max(target_model_output_on_ss, axis=1) * (1 - t_batch)
        loss = self.model.train_step(sess, s_batch, a_batch, y_batch)
        print(loss)
        
        if self.learn_step % self.target_update_frequency == 0:
            self.model_parameters_copier.copy(sess)
    
        
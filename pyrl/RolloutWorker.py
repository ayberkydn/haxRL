from Hyperparameters import GAMMA, LAMBDA, RENDER, ACTIONS
import numpy as np
from StateProcessor import StateProcessor
from StateSequence import StateSequence
import matplotlib.pyplot as plt
from Hyperparameters import INPUT_SHAPE, STATE_TYPE
import tensorflow as tf

class RolloutWorker:
    def __init__(self, agent, env_maker, env_maker_arg):
        self.agent = agent
        self.sequence = StateSequence(INPUT_SHAPE)
        self.processor = StateProcessor(state_type=STATE_TYPE)
        
        self.env = env_maker(env_maker_arg)
        self.env._max_episode_steps = float('inf')
        self.reset()
                
        
    def rollout(self, sess, max_timesteps):
        states = [self.last_state[:]] 
        actions = []
        rewards = []
        
        for n in range(max_timesteps):
            action = self.agent.policy_net.select_action(sess, self.last_state)
            actions.append(action)
            obs, reward, done, info = self.env.step(ACTIONS[action])
            obs = self.processor.process(sess, obs)
            self.sequence.append_obs(obs)
            state = self.sequence.get_sequence()
            rewards.append(reward)
            states.append(state)
            self.last_state = state
            self.discounted_sum += reward * (GAMMA ** self.step)
            self.undiscounted_sum += reward
            self.step += 1
            
            if RENDER:
                self.env.render()
            if done:
                print(self.undiscounted_sum)
                self.reset()
                break
                
            
            
        states = np.array(states)
        actions = np.array(actions)
        rewards = np.array(rewards)

        
 
        num_states = len(states)
        predicted_values = self.agent.value_net.predict_batch(sess, states)
        if done:
            predicted_values[-1] = 0
          
        ##Value estimation
        returns = np.zeros(num_states - 1)
        R = 0 if done else predicted_values[-1]

        
        for t in reversed(range(num_states - 1)):
            R = rewards[t] + GAMMA * R
            returns[t] += R

            
#        ##Duz advantage estimation
#        advantages = returns - predicted_values[:-1]
#        
 
        ##Generalized advantage estimation
        deltas = rewards + GAMMA * predicted_values[1:] - predicted_values[:-1]
        
        
        advantage_coefficients = (LAMBDA * GAMMA) ** np.arange(num_states - 1)
        
        advantages = np.zeros_like(deltas)
        
        for n in range(len(advantages)):
            advantages[n] += np.sum(deltas[n:] * advantage_coefficients[:len(advantages) - n])

        
        
        
        return states[:-1], actions, returns, advantages, rewards      
        
            
    def reset(self):
        self.sequence.reset()
        obs = self.env.reset()
        with tf.Session() as sess2:
            processed = self.processor.process(sess2, obs)
        
        for n in range(self.sequence.length):
            self.sequence.append_obs(processed)
        self.last_state = self.sequence.get_sequence()
        self.discounted_sum = 0
        self.undiscounted_sum = 0
        self.step = 0
        
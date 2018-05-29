from Hyperparameters import GAMMA, LAMBDA, RENDER, ACTIONS, INPUT_SHAPE, STATE_TYPE
import numpy as np
import torch
import matplotlib.pyplot as plt
import gym
from atari_wrappers import make_atari, wrap_deepmind
from utils import to_pytorch, flatten
from Environments import HaxballEnvironment

class RolloutWorker:
    def __init__(self, agent, env_id, num_envs, timesteps):
        self.agent = agent
        self.num_actions = len(ACTIONS)
        self.num_envs = num_envs
        self.envs = []
        self.timesteps = timesteps
        
        self.states       = np.zeros(shape=[num_envs, timesteps + 1, *INPUT_SHAPE], 
                                     dtype=np.uint8)
        self.actions      = np.zeros(shape=[num_envs, timesteps],
                                     dtype=np.uint8)
        self.action_log_probs = np.zeros(shape=[num_envs, timesteps],
                                     dtype=np.float32)
        self.rewards      = np.zeros(shape=[num_envs, timesteps],
                                     dtype=np.float32)
        self.returns      = np.zeros(shape=[num_envs, timesteps],
                                   dtype=np.float32)
        self.advantages   = np.zeros(shape=[num_envs, timesteps],
                                     dtype=np.float32)
        self.values       = np.zeros(shape=[num_envs, timesteps + 1],
                                     dtype=np.float32)
        self.news         = np.zeros(shape=[num_envs, timesteps + 1],
                                     dtype=np.uint8)
        
        self.last_states     = np.zeros([num_envs, *INPUT_SHAPE], dtype = np.uint8)
        
        self.last_states_new = np.zeros(num_envs, dtype=np.uint8)
        
        
        
        for n in range(num_envs):    
#            env = make_atari(env_id)
#            env = wrap_deepmind(env, frame_stack=True, scale=False)
            env = HaxballEnvironment()
            self.envs.append(env)
            state = env.reset()
            self.last_states[n] = to_pytorch(state)
            self.last_states_new[:] = 1
            
        
    def rollout(self, train_mode=True):
        self.states[:, 0] = self.last_states[:]
        self.news[:, 0]   = self.last_states_new[:]
        
        for t in range(self.timesteps):
            
            values_t, actions_t, action_log_probs_t = self.agent.select_act(self.last_states, train_mode)
            rewards_t = torch.empty(size=[self.num_envs], dtype=torch.float32)
            
            for n in range(self.num_envs):
                state_n_t_, reward_n_t, done_n_t_, info = self.envs[n].step(ACTIONS[actions_t[n]])
                self.envs[n].render()
                if done_n_t_:
                    state_n_t_ = self.envs[n].reset()
                    
                state_n_t_ = to_pytorch(state_n_t_)
                self.last_states[n] = state_n_t_[:]
                self.last_states_new[n] = torch.tensor(done_n_t_)
                rewards_t[n] = reward_n_t
#            plt.imshow(self.last_states[0]); plt.show(); print("")
                
            
            
            self.action_log_probs[:,t] = action_log_probs_t
            self.actions[:,t]  = actions_t
            self.rewards[:,t]  = rewards_t
            self.values[:, t] = values_t
            self.states[:,t+1] = self.last_states
            self.news[:,t+1]   = self.last_states_new
            
        values_t, _, _ = self.agent.select_act(self.last_states)
        self.values[:, -1] = values_t #last states values
            
        return self._process()

    def _process(self):
        states = self.states
        actions = self.actions
        action_log_probs = self.action_log_probs
        rewards = self.rewards
        news = self.news
        values = self.values
        advantages = self.advantages
        returns = np.empty_like(advantages)
        
        for n in range(self.num_envs):
            last_advantage = 0
            for t in reversed(range(self.timesteps)):
                nonterminal = 1-news[n,t+1]
                delta = rewards[n,t] + GAMMA * values[n,t+1] * nonterminal - values[n,t]
                advantages[n,t] = last_advantage = delta + GAMMA * LAMBDA * nonterminal * last_advantage
            
            returns[n, :] = advantages[n, :] + values[n, :-1]

            
        
               
        return flatten(states[:,:-1]), flatten(actions), flatten(action_log_probs), \
               flatten(returns), flatten(advantages)
        
        
        
        

env = make_atari("PongNoFrameskip-v4")
env = wrap_deepmind(env, frame_stack=True, scale=False)
state = env.reset()
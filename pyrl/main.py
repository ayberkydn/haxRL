import gym
import time
import numpy as np
from ANNAgent import ANNAgent
from StateSequence import StateSequence
from funcs import preprocess_state, show
import matplotlib.pyplot as plt
from Environment import HaxballEnvironment
from time import sleep
import random





#env = HaxballEnvironment(random_start=False, step_limit=1000, state_output_mode='pixels', action_repeat=4)
scores_my = np.zeros(500)

for n in range(30):
    env = gym.make('CartPole-v0')
    INPUT_SHAPE = [4]
    NUM_ACTIONS = env.action_space.n
    agent = ANNAgent(INPUT_SHAPE, NUM_ACTIONS)
    
    
    for episode in range(500):
        env.reset()
        state_seq = StateSequence(shape=INPUT_SHAPE)
        state_prime = env.reset()
        episode_step = 0
        while True:
            episode_step += 1
            state = state_prime[:]
            action = agent.act(state)
            frame, reward, done, _ = env.step(action)
            
            #plt.imshow(preprocess_state(frame)); plt.show()
            state_prime = frame
            #1env.render()
            agent.learn([state[:], action, reward, state_prime[:], done])
            
            if done:
                episode_score = agent.reset_episode()
                print("episode: {} , score: {}".format(episode, episode_step))
                scores_my[episode] += episode_step        
                break
    print(n)
    env.close()
scores_my /= 30




import chainer
import chainer.functions as F
import chainer.links as L
import chainerrl
import gym
import numpy as np
scores_chainer = np.zeros(500)


for n in range(30):
    env = gym.make('CartPole-v0')
    
    obs = env.reset()
    
    action = env.action_space.sample()
    obs, r, done, info = env.step(action)
    
    
    class QFunction(chainer.Chain):
    
        def __init__(self, obs_size, n_actions, n_hidden_channels=50):
            super().__init__()
            with self.init_scope():
                self.l0 = L.Linear(obs_size, n_hidden_channels)
                self.l1 = L.Linear(n_hidden_channels, n_hidden_channels)
                self.l2 = L.Linear(n_hidden_channels, n_actions)
    
        def __call__(self, x, test=False):
            """
            Args:
                x (ndarray or chainer.Variable): An observation
                test (bool): a flag indicating whether it is in test mode
            """
            h = F.tanh(self.l0(x))
            h = F.tanh(self.l1(h))
            return chainerrl.action_value.DiscreteActionValue(self.l2(h))
    
    obs_size = env.observation_space.shape[0]
    n_actions = env.action_space.n
    q_func = QFunction(obs_size, n_actions)
    
    
    # Use Adam to optimize q_func. eps=1e-2 is for stability.
    optimizer = chainer.optimizers.SGD()
    optimizer.setup(q_func)
    
    # Set the discount factor that discounts future rewards.
    gamma = 0.95
    
    # Use epsilon-greedy for exploration
    explorer = chainerrl.explorers.ConstantEpsilonGreedy(
        epsilon=0.3, random_action_func=env.action_space.sample)
    
    # DQN uses Experience Replay.
    # Specify a replay buffer and its capacity.
    replay_buffer = chainerrl.replay_buffer.ReplayBuffer(capacity=10 ** 6)
    
    # Since observations from CartPole-v0 is numpy.float64 while
    # Chainer only accepts numpy.float32 by default, specify
    # a converter as a feature extractor function phi.
    phi = lambda x: x.astype(np.float32, copy=False)
    
    # Now create an agent that will interact with the environment.
    agent = chainerrl.agents.DoubleDQN(
        q_func, optimizer, replay_buffer, gamma, explorer,
        replay_start_size=500, update_interval=1,
        target_update_interval=100, phi=phi)
    
    n_episodes = 500
    max_episode_len = 200
    for i in range(n_episodes):
        obs = env.reset()
        reward = 0
        done = False
        R = 0  # return (sum of rewards)
        t = 0  # time step
        while not done and t < max_episode_len:
            # Uncomment to watch the behaviour
#            env.render()
            action = agent.act_and_train(obs, reward)
            obs, reward, done, _ = env.step(action)
            R += reward
            t += 1
        
        print('episode:', i,
              'R:', R)
        agent.stop_episode_and_train(obs, reward, done)
        scores_chainer[i] += R
        
    print(n)
    env.close()
    

scores_chainer /= 30
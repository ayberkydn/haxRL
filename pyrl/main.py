import gym
import time
import numpy as np
from DQNAgent import DQNAgent
from DQNAgentNoClip import DQNAgentNoClip
from ANNAgent import ANNAgent
from StateSequence import StateSequence
from funcs import preprocess_state, show
import matplotlib.pyplot as plt
import scipy
import pickle
from Environment import HaxballEnvironment
from RandomAgent import ForwardAgent
from HumanAgent import HumanAgent
from Side import Side
from time import sleep
import pygame
# Parameters




env = HaxballEnvironment(render = True, sound = False, reset_delay = False, random_start = False)
env.add_agent(HumanAgent(pygame.K_UP, pygame.K_DOWN, pygame.K_LEFT, pygame.K_RIGHT, pygame.K_x), Side.red);
env.add_agent(ANNAgent(), Side.blue);


for n in range(5000):
    env.update()
    


#
#
#env = gym.make('Pong-v4')
#
#agent = DQNAgent([84,84,4], 6)
#scores = []
#action_count = 0
#for episode in range(1000):
#    print("total actions made: {}".format(action_count))
#    env.reset()
#    state_seq = StateSequence(shape=[84,84,4])
#    state_prime = state_seq.get_sequence()
#    while True:
#        action_count += 1
#        state = state_prime[:]
#        action = agent.act(state)
#        frame, reward, done, _ = env.step(action)
#        state_seq.append_state(preprocess_state(frame))
#        state_prime = state_seq.get_sequence() 
#        agent.learn([state[:], action, reward, state_prime[:], done])
#        env.render()
#        if done:
#            episode_score = agent.reset_episode()
#            print("episode: {} , score: {}".format(episode, episode_score))
#            scores.append(episode_score)
#            break
#
#
#with open("results.txt", "wb") as file:
#    pickle.dump(scores, file)
#
#

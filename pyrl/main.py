import gym
import time
import numpy as np
from ANNAgent import ANNAgent
from StateSequence import StateSequence
from funcs import preprocess_state, show
import matplotlib.pyplot as plt
import scipy
from Environment import HaxballEnvironment
from time import sleep



INPUT_SHAPE = [84, 84, 4]
NUM_ACTIONS = 4


env = HaxballEnvironment(random_start=False, step_limit=1000, state_output_mode='pixels', action_repeat=4)
agent = ANNAgent(INPUT_SHAPE, NUM_ACTIONS)

scores = []
action_count = 0
for episode in range(1000):
    print("total actions made: {}".format(action_count))
    env.reset()
    state_seq = StateSequence(shape=INPUT_SHAPE)
    state_prime = state_seq.get_sequence()
    while True:
        action_count += 1
        state = state_prime[:]
        action = agent.act(state)
        frame, reward, done, _ = env.step(action)
        agent.accumulate_reward(reward)
        state_prime = state_seq.get_sequence() 
        agent.learn([state[:], action, reward, state_prime[:], done])
        if done:
            episode_score = agent.reset_episode()
            print("episode: {} , score: {}".format(episode, episode_score))
            scores.append(episode_score)        
            break


#

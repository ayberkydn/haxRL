import tensorflow as tf
import numpy as np
import gym
from PPOAgent import PPOAgent
from A3CAgent import A3CAgent
from Hyperparameters import EPOCHS    

tf.reset_default_graph()
agent = PPOAgent()


sess = tf.InteractiveSession()
sess.run(tf.global_variables_initializer())


for n in range(50000):
    states, actions, target_values, advantages, _ = agent.rollout(sess)
    agent.train(sess, states, actions, target_values, advantages, EPOCHS)
        

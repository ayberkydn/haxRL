import tensorflow as tf
import numpy as np
import gym
from time import sleep



a = tf.range(8)

sess = tf.InteractiveSession()

a = sess.run(tf.nn.moments(a, 1))
from Environments import PenaltyEnvironment, HaxballEnvironment
from time import sleep
from DQNPlatform import DQNPlatform
from ANNPlatform import ANNPlatform
import matplotlib.pyplot as plt
import tensorflow as tf

tf.reset_default_graph()
platform= ANNPlatform()

with tf.Session() as sess:
    sess.run(tf.global_variables_initializer())
    platform.train(sess)
import tensorflow as tf
import numpy as np
class StateProcessor:
    def __init__(self):
        with tf.variable_scope("state_processor"):
            self.input_state = tf.placeholder(shape=[210, 160, 3], dtype = tf.uint8)
            self.output = tf.image.rgb_to_grayscale(self.input_state)
            self.output = tf.image.resize_images(self.output, [84, 84])
            self.output = tf.squeeze(self.output)
            self.output = tf.cast(self.output, tf.uint8)
            
    def process(self, sess, state):
        return sess.run(self.output, {self.input_state: state})
        


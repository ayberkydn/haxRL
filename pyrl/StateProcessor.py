import tensorflow as tf
import numpy as np
class StateProcessor:
    def __init__(self, state_type):
        with tf.variable_scope("state_processor"):
            if state_type == "PIXELS":
                self.input_state = tf.placeholder(shape=[210, 160, 3], dtype = tf.uint8)
                self.output = tf.image.rgb_to_grayscale(self.input_state)
                self.output = tf.image.resize_images(self.output, [84, 84])
                self.output = self.output / 255
                self.output = tf.squeeze(self.output)
            
            elif state_type == "RAM":
                self.input_state = tf.placeholder(shape=[128], dtype = tf.uint8)
                self.output = self.input_state / 255
                
            elif state_type == "OTHER":
                self.input_state = tf.placeholder(shape=[None], dtype = tf.float32)
                self.output = self.input_state
            
    def process(self, sess, state):
        return sess.run(self.output, {self.input_state: state})
        


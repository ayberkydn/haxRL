import tensorflow as tf
import numpy as np


class ValueCNN:
    def __init__(self, scope, input_shape, is_trainable=True):
        with tf.variable_scope(scope):
            self.scope = scope
            self.states_ph = tf.placeholder(dtype=tf.float32, 
                                        shape=[None, *input_shape], ###################### 
                                        name="state")
            
            self.conv1 = tf.layers.conv2d(inputs=self.states_ph, 
                                           filters=32, 
                                           kernel_size=[8, 8], 
                                           strides=4, 
                                           padding="valid", 
                                           activation=tf.nn.relu,
                                           trainable=is_trainable,
                                           name="conv1")
            
            self.conv2 = tf.layers.conv2d(inputs=self.conv1, 
                                           filters=64, 
                                           kernel_size=[4, 4], 
                                           strides=2, 
                                           padding="valid", 
                                           activation=tf.nn.relu, 
                                           trainable=is_trainable,
                                           name="conv2")
            
            self.conv3 = tf.layers.conv2d(inputs=self.conv2, 
                                           filters=64, 
                                           kernel_size=[3, 3], 
                                           strides=1, 
                                           padding="valid", 
                                           activation=tf.nn.relu, 
                                           trainable=is_trainable,
                                           name="conv3")
            
            self.flatten = tf.layers.flatten(inputs=self.conv3,
                                             name="flatten")
            
            self.dense1 = tf.layers.dense(inputs=self.flatten,
                                          units=512,
                                          activation=tf.nn.relu,
                                          trainable=is_trainable,
                                          name="dense1")
            
            self.values = tf.layers.dense(inputs=self.dense1, 
                                          units=1, 
                                          trainable=is_trainable,
                                          name="value")

            self.values = tf.squeeze(self.values)
            
                    
            self.values_ph = tf.placeholder(dtype=tf.float32,
                                            shape=[None],
                                            name="values_ph")
        
            
            
            self.params = tf.get_collection(key=tf.GraphKeys.GLOBAL_VARIABLES, 
                                            scope=scope)
            
    def predict_batch(self, sess, states):
        return sess.run(self.values, {self.states_ph: states})
    
    def predict_single(self, sess, state):
        states = np.expand_dims(state, axis=0)
        return self.predict_batch(sess, states)[0]

import tensorflow as tf
import numpy as np


class ValueANN:
    def __init__(self, scope, input_shape, is_trainable=True):
        with tf.variable_scope(scope):
            self.scope = scope
            self.states_ph = tf.placeholder(dtype=tf.float32, 
                                        shape=[None, *input_shape], ###################### 
                                        name="state")
            
            self.flatten = tf.layers.flatten(self.states_ph)
            
            self.layer1 = tf.layers.dense(inputs=self.flatten, 
                                          units=300, 
                                          activation=tf.nn.tanh,
                                          trainable=is_trainable,
                                          name="layer1")
            
            self.layer2 = tf.layers.dense(inputs=self.layer1, 
                                          units=300, 
                                          activation=tf.nn.tanh, 
                                          trainable=is_trainable,
                                          name="layer2")
            
            self.values = tf.layers.dense(inputs=self.layer2, 
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

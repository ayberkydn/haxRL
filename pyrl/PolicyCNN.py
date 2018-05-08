import tensorflow as tf
import numpy as np

class PolicyCNN:
    def __init__(self, scope, input_shape, num_actions, is_trainable=True):
        with tf.variable_scope(scope):
            self.scope = scope
            self.states_ph = tf.placeholder(dtype=tf.float32, 
                                        shape=[None, *input_shape], 
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
            
            self.policy = tf.layers.dense(inputs=self.dense1, 
                                          units=num_actions, 
                                          activation=tf.nn.softmax,
                                          trainable=is_trainable,
                                          name="policy")
            
            
            self.actions_ph = tf.placeholder(dtype=tf.int32,
                                             shape=[None],
                                             name="actions_ph")

            #this is going to be used for selecting specific 
            #actions' probabilities
            self.reshaped_policy = tf.reshape(self.policy, [-1])

            #indices for selected actions at reshaped policy
            self.indices = tf.range(0, tf.shape(self.actions_ph)[0]) * tf.shape(self.policy)[1] + self.actions_ph
            
            
            # probabilities of each action of input actions 
            # batch at input states batch
            self.actions_prob = tf.gather(params=self.reshaped_policy, 
                                          indices=self.indices,
                                          name="actions_prob")
            
            self.actions_log_prob = tf.log(self.actions_prob)
            
            
            self.params = tf.get_collection(key=tf.GraphKeys.GLOBAL_VARIABLES, 
                                            scope=scope)
            

    def predict_action_probabilities(self, sess, states, actions):
        return sess.run(self.actions_prob, {self.states_ph:  states,
                                            self.actions_ph: actions})
    
    def predict_batch(self, sess, states):
        return sess.run(self.policy, {self.states_ph: states})
    
    def predict_single(self, sess, state):
        states = np.expand_dims(state, axis=0)
        return self.predict_batch(sess, states)[0]
    
    def select_action(self, sess, state):
        probs = self.predict_single(sess, state)
        action = np.random.choice(np.arange(probs.shape[0]), p=probs)
        return action        
        
        
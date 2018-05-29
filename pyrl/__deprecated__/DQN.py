import tensorflow as tf
import numpy as np
class DQN:
    def __init__(self, scope, num_actions):
        self.scope = scope
        self.num_actions = num_actions
        with tf.variable_scope(scope):
            self._build_model()
            

    def _build_model(self):
        self.X_pl = tf.placeholder(shape = [None, 84, 84, 4], dtype=tf.uint8, name="X")
        self.y_pl = tf.placeholder(shape = [None], dtype=tf.float32, name="y")
        self.actions_pl = tf.placeholder(shape=[None], dtype=tf.int32, name="actions")
        
        X = tf.to_float(self.X_pl) / 255.0
        batch_size = tf.shape(self.X_pl)[0]
        
        conv1 = tf.layers.conv2d(
            X, 32, 8, 4, activation=tf.nn.relu)
        conv2 = tf.layers.conv2d(
            conv1, 64, 4, 2, activation=tf.nn.relu)
        conv3 = tf.layers.conv2d(
            conv2, 64, 3, 1, activation=tf.nn.relu)

        flattened = tf.layers.flatten(conv3)
        fc1 = tf.layers.dense(flattened, 512)
        self.predictions = tf.layers.dense(fc1, self.num_actions) 
        
        self.gather_indices = tf.range(batch_size) * tf.shape(self.predictions)[1] + self.actions_pl ##############deneme
        self.action_predictions = tf.gather(tf.reshape(self.predictions, [-1]), self.gather_indices)
        
        self.loss = tf.losses.huber_loss(self.y_pl, self.action_predictions)
        self.optimizer = tf.train.RMSPropOptimizer(learning_rate=0.00025, 
                                                   decay=0.95,
                                                   momentum=0.95, 
                                                   epsilon=0.01)
        self.train_op = self.optimizer.minimize(self.loss)
        
    def predict(self, sess, s):
        if len(s.shape) == 3:
            s = np.expand_dims(s, 0)
        return sess.run(self.predictions, {self.X_pl: s})
    
    def predict_with_actions(self, sess, s, a):
        return sess.run(self.action_predictions, {self.X_pl: s, self.actions_pl:a})
    
    def train_step(self, sess, s, a, y):
        feed_dict = {self.X_pl:s, self.y_pl: y, self.actions_pl: a}
        _, loss = sess.run([self.train_op, self.loss], feed_dict)
        return loss
        


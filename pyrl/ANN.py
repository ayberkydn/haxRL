import tensorflow as tf
import numpy as np
class ANN:
    def __init__(self, scope, input_shape, num_actions):
        self.scope = scope
        self.input_shape = input_shape
        self.num_actions = num_actions
        with tf.variable_scope(scope):
            self._build_model()
            

    def _build_model(self):
        self.X_pl = tf.placeholder(shape = [None, *self.input_shape], dtype=tf.uint8, name="X")
        self.y_pl = tf.placeholder(shape = [None], dtype=tf.float32, name="y")
        self.actions_pl = tf.placeholder(shape = [None], dtype=tf.int32, name="actions")
        
        X = tf.to_float(self.X_pl) / 255.0
        batch_size = tf.shape(self.X_pl)[0]
        
        flattened = tf.layers.flatten(X)
        hidden1 = tf.layers.dense(inputs = flattened, units = 256, activation=tf.nn.relu)
        hidden2 = tf.layers.dense(inputs = hidden1, units = 256, activation=tf.nn.relu)
        hidden3 = tf.layers.dense(inputs = hidden2, units = 256, activation=tf.nn.relu)
        
        self.predictions = tf.layers.dense(inputs=hidden3, units=self.num_actions) 
        
        self.gather_indices = tf.range(batch_size) * tf.shape(self.predictions)[1] + self.actions_pl ##############deneme
        self.action_predictions = tf.gather(tf.reshape(self.predictions, [-1]), self.gather_indices)
        
        self.loss = tf.losses.huber_loss(self.y_pl, self.action_predictions)
        self.optimizer = tf.train.RMSPropOptimizer(learning_rate=0.00025, 
                                                   decay=0.95,
                                                   momentum=0.95, 
                                                   epsilon=0.01)
        self.train_op = self.optimizer.minimize(self.loss)
        
    def predict(self, sess, s):
        if len(s.shape) == 2:
            s = np.expand_dims(s, 0)
        return sess.run(self.predictions, {self.X_pl: s})
    
    def predict_with_actions(self, sess, s, a):
        return sess.run(self.action_predictions, {self.X_pl: s, self.actions_pl:a})
    
    def train_step(self, sess, s, a, y):
        feed_dict = {self.X_pl:s, self.y_pl: y, self.actions_pl: a}
        _, loss = sess.run([self.train_op, self.loss], feed_dict)
        return loss
        
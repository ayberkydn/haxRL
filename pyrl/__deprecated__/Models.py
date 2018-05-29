import torch
from torch.autograd import Variable
import torch.nn as nn
import torch.nn.functional as F
import tensorflow as tf
import numpy as np

class ANN(nn.Module):
    def __init__(self):
        super().__init__()

        self.input_shape = [4, 6]
        self.input_size = self.input_shape[0] * self.input_shape[1]
        self.hidden_size = 300
        self.output_size = 5
        
        
        self.fc1 = nn.Linear(self.input_size, self.hidden_size)
        self.fc2 = nn.Linear(self.hidden_size, self.hidden_size)
        self.fc3 = nn.Linear(self.hidden_size, self.hidden_size)
        self.fc4 = nn.Linear(self.hidden_size, self.hidden_size)
        self.out= nn.Linear(self.hidden_size, self.output_size)
        
        for param in self.parameters():
            param.require_grad = False
        
    def forward(self, x):
        x = x.contiguous()
        x = x.view(x.size(0), -1)
        x = self.fc1(x)
        x = F.relu(x)
        x = self.fc2(x)
        x = F.relu(x)
        x = self.fc3(x)
        x = F.relu(x)
        x = self.fc4(x)
        x = F.relu(x)
        x = self.out(x)
        return x
    
    def copy(self):
        new_model = ANN()
        new_model.load_state_dict(self.state_dict())
        return new_model
    
    def noise_params(self, std):
        for param in self.parameters():
            param.data += torch.randn(param.shape) * std
        

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
        
        X = tf.to_float(self.X_pl) / 255.0 ##################deneme
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
        self.optimizer = tf.train.RMSPropOptimizer(0.00025, 0.99, 0.0, 1e-6)
        self.train_op = self.optimizer.minimize(self.loss)
        
    def predict(self, sess, s):
        return sess.run(self.predictions, {self.X_pl: s})
    
    def train_step(self, sess, s, a, y):
        feed_dict = {self.X_pl:s, self.y_pl: y, self.actions_pl: a}
        _, loss = sess.run([self.train_op, self.loss], feed_dict)
        return loss
        

        









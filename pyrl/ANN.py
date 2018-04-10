import tensorflow as tf
import numpy as np

class ANN:
    def __init__(self, name):
        assert type(name) is str
        self.sess = tf.InteractiveSession()
        
        with tf.name_scope(name):
            self.X = tf.placeholder(dtype = tf.float32, 
                                    shape = [None, 4], 
                                    name = "X")
            self.y = tf.placeholder(dtype = tf.float32,
                                    shape = [None, 2],
                                    name = "y")
            
            self.hidden1 = tf.layers.dense(inputs = self.X,
                                           units = 50,
                                           activation = tf.nn.relu,
                                           name = "hidden1")
            
            self.hidden2 = tf.layers.dense(inputs = self.hidden1,
                                           units = 50,
                                           activation = tf.nn.relu,
                                           name = "hidden2")
            
            self.out = tf.layers.dense(inputs = self.hidden2,
                                       units = 2)
            
            
            self.sess.run(tf.global_variables_initializer())
    
            
            
    def predict(self, input_tensor):
        
        return self.sess.run(self.out, feed_dict = {self.X: input_tensor})
        
    
    
    
a = ANN("asd")

data = np.random.randn(20,4)
b = a.predict(data)
import tensorflow as tf
from DQNPlatform import DQNPlatform
tf.reset_default_graph()



platform = DQNPlatform() 

with tf.Session() as sess:
    sess.run(tf.global_variables_initializer())
    platform.train(sess)
    input("Press a key to test")
    platform.test(sess)
        
    
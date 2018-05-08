from PolicyANN import PolicyANN
from ValueANN import ValueANN
from PolicyCNN import PolicyCNN
from ValueCNN import ValueCNN
from RolloutWorker import RolloutWorker
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from Hyperparameters import LEARNING_RATE, BATCH_SIZE, EPSILON, NUM_WORKERS, \
T, C1, C2, ENV_MAKER, ENV_NAME, INPUT_SHAPE, ACTIONS, LR_ANNEALING_RATE, EPSILON_ANNEALING_RATE

class PPOAgent:
    def __init__(self):
        self._build_graph()
        self.rollout_workers = []
        self.train_history = {
                "average_reward": [],
                "average_returns": [],
                "frames_trained": 0,
                }
        
        self.num_workers = NUM_WORKERS
        for n in range(self.num_workers):
            self.rollout_workers.append(RolloutWorker(agent=self,
                                                      env_maker=ENV_MAKER, 
                                                      env_maker_arg=ENV_NAME))


    def _build_graph(self):
        self.policy_net = PolicyANN("policy_net", 
                                        input_shape = INPUT_SHAPE,
                                        num_actions = len(ACTIONS))
        
        self.old_policy_net = PolicyANN("old_policy_net", 
                                        input_shape = INPUT_SHAPE, 
                                        num_actions = len(ACTIONS),
                                        is_trainable = False)
        
        
        self.value_net = ValueANN("value_net",
                                  input_shape = INPUT_SHAPE)
        
        self.advantages_ph = tf.placeholder(dtype=tf.float32, 
                                            shape = [None],
                                            name = "advantages_ph")
        
        
        self.r = self.policy_net.actions_prob / (self.old_policy_net.actions_prob + 1e-8)
        
        self.clipped_r = tf.clip_by_value(self.r, 1-EPSILON, 1+EPSILON)
        
        self.L_CLIP_batch= tf.minimum(self.r * self.advantages_ph, 
                                      self.clipped_r * self.advantages_ph)
        
        self.L_CLIP = -tf.reduce_mean(self.L_CLIP_batch)
        
        self.L_ENT_batch = -tf.reduce_sum(self.policy_net.policy * tf.log(self.policy_net.policy), 
                                          axis = 1)
        
        self.L_ENT = -tf.reduce_mean(self.L_ENT_batch, 
                                     axis = 0)
        
        
        self.L_VF  = tf.losses.mean_squared_error(labels = self.value_net.values_ph, 
                                                  predictions = self.value_net.values)
                                                 
      
        self.loss = self.L_CLIP + C1 * self.L_VF + C2 * self.L_ENT
       
        self.learning_rate = tf.Variable(initial_value = LEARNING_RATE, 
                                         dtype = tf.float32, 
                                         trainable = False)
        
        self.epsilon = tf.Variable(initial_value = EPSILON, 
                                   dtype = tf.float32, 
                                   trainable = False)
        
        self.anneal_learning_rate = tf.assign_sub(self.learning_rate, 
                                                  LR_ANNEALING_RATE)
        self.anneal_epsilon = tf.assign_sub(self.epsilon, 
                                            EPSILON_ANNEALING_RATE)
        
        self.optimizer = tf.train.AdamOptimizer(self.learning_rate)
        self.optimize_op = self.optimizer.minimize(self.loss)
        
        self.copy_ops = []
        for ref, value in zip(self.old_policy_net.params, self.policy_net.params):
            self.copy_ops.append(tf.assign(ref, value))
        
        
    def rollout(self, sess):
        
        states = []
        actions = []
        returns = []
        advantages = []
        rewards = []
        
        for worker in self.rollout_workers:
            data_generated = 0
            
            while data_generated < T:    
                states_roll, \
                actions_roll, \
                returns_roll, \
                advantages_roll, \
                rewards_roll = worker.rollout(sess, max_timesteps=T-data_generated)
                
                data_generated += states_roll.shape[0]
                [states.append(state) for state in states_roll]
                [actions.append(action) for action in actions_roll]
                [returns.append(return_) for return_ in returns_roll]
                [advantages.append(advantage) for advantage in advantages_roll]
                [rewards.append(reward) for reward in rewards_roll]
            
            self.train_history['frames_trained'] += data_generated
        
        
        states = np.array(states)
        actions = np.array(actions)
        returns = np.array(returns)
        advantages = np.array(advantages)
        advantages -= advantages.mean()
        advantages /= advantages.std() + 1e-6
        

        rewards = np.array(rewards)
        
        self.train_history["average_reward"].append(np.mean(rewards))
        self.train_history["average_returns"].append(np.mean(returns))
        
        
        print("frames trained:", self.train_history['frames_trained'])
        print("average reward:", self.train_history['average_reward'][-1])
        print("average values:", self.train_history['average_returns'][-1])
        
        return states, actions, returns, advantages, rewards
        
    
        
    
    def train(self, sess, states, actions, target_values, advantages, epochs):
        sess.run(self.copy_ops)
        
        
        
        for epoch in range(epochs):
            dataset_size = states.shape[0]
            iterations = dataset_size // BATCH_SIZE
            for n in range(iterations):
                random_indices = np.random.choice(np.arange(dataset_size), size=BATCH_SIZE)
                states_batch = states[random_indices]
                actions_batch = actions[random_indices]
                advantages_batch = advantages[random_indices]
                target_values_batch = target_values[random_indices]
                _, = sess.run([self.optimize_op], 
                                   feed_dict= {
                                           self.policy_net.states_ph: states_batch,
                                           self.old_policy_net.states_ph: states_batch,
                                           self.value_net.states_ph: states_batch,
                                           self.policy_net.actions_ph: actions_batch,
                                           self.old_policy_net.actions_ph: actions_batch,
                                           self.advantages_ph: advantages_batch,
                                           self.value_net.values_ph: target_values_batch,
                                           }
                                   )
             
        
        self.anneal(sess)
        
            
    def anneal(self, sess):
        a,b = sess.run([self.anneal_learning_rate, self.anneal_epsilon])
        print(a,b)
        
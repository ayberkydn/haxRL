from ActorCritic import ActorCritic
from RolloutWorker import RolloutWorker
import numpy as np
import torch
import matplotlib.pyplot as plt
from Hyperparameters import LEARNING_RATE, NUM_MINIBATCHES, EPSILON, NUM_WORKERS, \
T, C1, C2, ENV_ID, INPUT_SHAPE, ACTIONS, LR_ANNEALING_RATE, \
NUM_EPOCHS, EPSILON_ANNEALING_RATE, CLIP_VALUE_LOSS, MAX_GRAD_NORM
from utils import to_pytorch
import os



class PPOAgent:
    def __init__(self):
        
        self.train_history = dict()

        if os.path.isfile("./checkpoints/model.pt"):
            self.model = torch.load("./checkpoints/model.pt")
            self.train_history['frames_trained'] = torch.load("./checkpoints/frames_trained.pt")
            self.train_history['average_entropy'] = torch.load("./checkpoints/average_entropy.pt")
            self.train_history['average_values'] = torch.load("./checkpoints/average_values.pt")
            print("Model loaded from last checkpoint.")
        else:
            self.model = ActorCritic(num_actions = len(ACTIONS))
            self.train_history['frames_trained'] = torch.tensor(0)
            self.train_history['average_entropy'] = torch.tensor([0], dtype=torch.float)
            self.train_history['average_values'] = torch.tensor([0], dtype=torch.float)
            print("New model created.")
        self.model.to("cuda")
        
        self.worker = RolloutWorker(self, ENV_ID, NUM_WORKERS, T)
        

        
        
    def select_act(self, states, train_mode=True):
        states              = torch.tensor(states).to("cuda")
        prob_dists, values  = self.model(states)
        if train_mode:
            actions = prob_dists.sample()
        else:
            actions = torch.argmax(prob_dists.probs, dim=1)
            
        action_log_probs = prob_dists.log_prob(actions)

        values = values.data.cpu().numpy()
        actions = actions.data.cpu().numpy()
        action_log_probs = action_log_probs.data.cpu().numpy()
        return values, actions, action_log_probs        
    
    
    def train_step(self):
        states, actions, old_action_log_probs, returns, advantages \
        = self.worker.rollout()
        
        states    = torch.tensor(states).to("cuda")
        actions   = torch.tensor(actions).to("cuda")
        old_action_log_probs = torch.tensor(old_action_log_probs).to("cuda")
        returns    = torch.tensor(returns).to("cuda")
        advantages = torch.tensor(advantages).to("cuda")
        
        optimizer = torch.optim.Adam(self.model.parameters(), lr=LEARNING_RATE, eps=1e-5)
        
        loss_surr = self._surrogate_loss(states, actions, old_action_log_probs, advantages)
        loss_surr_before = loss_surr.data.cpu().numpy()
                
        loss_value = self._value_loss(states,
                                      returns)
        loss_value_before = loss_value.data.cpu().numpy()        
        
        loss_ent = self._entropy_loss(states)
        loss_ent_before = loss_ent.data.cpu().numpy()
        
        for epoch in range(NUM_EPOCHS):
            dataset_size = states.shape[0]
            batch_size = dataset_size // NUM_MINIBATCHES
            random_indices = torch.randperm(dataset_size, device="cpu").to("cuda")
            
            
            for n in range(NUM_MINIBATCHES):
                batch_indices = random_indices[n * batch_size: n * batch_size + batch_size]
                states_batch = states[batch_indices]
                old_action_log_probs_batch = old_action_log_probs[batch_indices]
                actions_batch = actions[batch_indices]
                advantages_batch = advantages[batch_indices]
                returns_batch = returns[batch_indices]
                
                advantages_batch = (advantages_batch - advantages_batch.mean()) / (advantages_batch.std() + 1e-6)
                
                loss_surr_batch = self._surrogate_loss(states_batch, 
                                                       actions_batch, 
                                                       old_action_log_probs_batch, 
                                                       advantages_batch)
                
                loss_value_batch = self._value_loss(states_batch,
                                                    returns_batch)
                
                loss_ent_batch = self._entropy_loss(states_batch)
                
                loss_batch = loss_surr_batch + C1 * loss_value_batch + C2 * loss_ent_batch
                
                
                
#                loss_batch_np = loss_batch.data.cpu().numpy()

                
                optimizer.zero_grad()
                loss_batch.backward()
                torch.nn.utils.clip_grad_norm_(self.model.parameters(), MAX_GRAD_NORM)
                optimizer.step()
                pass
                
            
        loss_surr = self._surrogate_loss(states, actions, old_action_log_probs, advantages)
        loss_surr_after = loss_surr.data.cpu().numpy()
                
        loss_value = self._value_loss(states,
                                      returns)
        loss_value_after = loss_value.data.cpu().numpy()        
        
        loss_ent = self._entropy_loss(states)
        loss_ent_after = loss_ent.data.cpu().numpy()
        
        self.train_history['frames_trained'] += 4 * states.shape[0]
        self.train_history['average_entropy'] = torch.cat((self.train_history['average_entropy'], torch.tensor([float(loss_ent_after)])))
        self.train_history['average_values']  = torch.cat((self.train_history['average_values'], torch.tensor([returns.mean()])))
        
        print("Frames trained: ", self.train_history['frames_trained'].cpu().numpy())
        print("Loss before: {: .6f} {:.6f} {:.6f}".format(loss_surr_before, loss_value_before, loss_ent_before))
        print("Loss after : {: .6f} {:.6f} {:.6f}".format(loss_surr_after, loss_value_after, loss_ent_after))
        torch.save(self.model, "./checkpoints/model.pt")
        torch.save(self.train_history['frames_trained'], "./checkpoints/frames_trained.pt") 
        torch.save(self.train_history['average_entropy'],  "./checkpoints/average_entropy.pt")
        torch.save(self.train_history['average_values'], "./checkpoints/average_values.pt")
    def test_step(self):
        self.worker.rollout(train_mode = False)
    
    def _surrogate_loss(self, states, actions, old_action_log_probs, advantages):
        advantages -= advantages.mean()
        advantages /= advantages.std() + 1e-8
#        advantages_np = advantages.data.cpu().numpy()
        
        pd, _ = self.model(states)
        
        action_log_probs = pd.log_prob(actions)
#        action_log_probs_np = action_log_probs.data.cpu().numpy()


        r = torch.exp(action_log_probs - old_action_log_probs)
#        r_np = r.data.cpu().numpy()


        r_clip = torch.clamp(r, 1 - EPSILON, 1 + EPSILON)
#        r_clip_np = r_clip.data.cpu().numpy()


        surr1 = r * advantages
#        surr1_np = surr1.data.cpu().numpy()

        surr2 = r_clip * advantages
#        surr2_np = surr2.data.cpu().numpy()

        loss_policy_batch = -torch.min(surr1, surr2)
#        loss_policy_batch_np = loss_policy_batch.data.cpu().numpy()
                
        loss_policy = torch.mean(loss_policy_batch, dim=0)
#        loss_policy_np = loss_policy.data.cpu().numpy()
        
        
        return loss_policy
    
    def _entropy_loss(self, states):
        
        pd, _ = self.model(states)
        loss_entropy_batch = -pd.entropy()
#        loss_entropy_batch_np = loss_entropy_batch.data.cpu().numpy()
        
        loss_entropy = torch.mean(loss_entropy_batch)
#        loss_entropy_np = loss_entropy.data.cpu().numpy()

        return loss_entropy
    
    def _value_loss(self, states, returns):
        
        _, values = self.model(states)
#        values_np = values.data.cpu().numpy()
            
        loss_value_batch = (returns - values)**2
#        loss_value_batch_np = loss_value_batch.data.cpu().numpy()
        
        loss_value = 0.5 * torch.mean(loss_value_batch, dim=0)
#        loss_value_np = loss_value.data.cpu().numpy()

        return loss_value
    
    


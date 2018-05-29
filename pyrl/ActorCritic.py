import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.distributions import Categorical
import numpy as np


class ActorCritic(nn.Module):
    def __init__(self, num_actions):
        super().__init__()
         
        self.conv1 = nn.Conv2d(in_channels=4, out_channels=32, kernel_size=8, stride=4)
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=4, stride=2)
        self.conv3 = nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3, stride=1)

        self.fc1 = nn.Linear(in_features=64 * 7 * 7, out_features=512)
        self.fc_policy = nn.Linear(in_features=512, out_features=num_actions)
        self.fc_value =  nn.Linear(in_features=512, out_features=1)
        
    def forward(self, x):
        #normalize states
        x = x.float()
        x = x / 255.
        #conv base
        x = self.conv1(x)
        x = F.relu(x)
        x = self.conv2(x)
        x = F.relu(x)
        x = self.conv3(x)
        x = F.relu(x)
        
        #dense
        x = x.view(-1, 64 * 7 * 7)
        x = self.fc1(x)
        x = F.relu(x)
        x_policy = self.fc_policy(x)
        x_policy = F.softmax(x_policy, dim=1)
        x_policy = Categorical(probs=x_policy)
        
        x_value = self.fc_value(x)
        x_value = torch.squeeze(x_value)
        return x_policy, x_value
        
        


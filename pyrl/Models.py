import torch
from torch.autograd import Variable
import torch.nn as nn
import torch.nn.functional as F

class ANN(nn.Module):
    def __init__(self):
        super().__init__()

        self.input_size = 6
        self.hidden_size = 200
        self.output_size = 5
        
        self.fc1 = nn.Linear(self.input_size, self.hidden_size)
        self.out= nn.Linear(self.hidden_size, self.output_size)
        
        for param in self.parameters():
            param.require_grad = False
        
    def forward(self, input_tensor):
        x = input_tensor
        x = self.fc1(x)
        x = F.tanh(x)
        x = self.out(x)
        return x
    
    def copy(self):
        new_model = ANN()
        new_model.load_state_dict(self.state_dict())
        return new_model
    
    def noise_params(self, std):
        for param in self.parameters():
            param.data += torch.randn(param.shape) * std
        

        
class DQN(nn.Module):

    def __init__(self):
        super(DQN, self).__init__()
        self.conv1 = nn.Conv2d(4, 32, kernel_size=8, stride=4)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=4, stride=2)
        self.conv3 = nn.Conv2d(64, 64, kernel_size=3, stride=1)
        self.fc = nn.Linear(3136, 512)
        self.out = nn.Linear(512, 5)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.relu(self.conv2(x))
        x = F.relu(self.conv3(x))
        x = self.fc(x.view(x.size(0), -1))
        x = self.out(x)
        return x
    
    def copy(self):
        new_model = DQN()
        new_model.load_state_dict(self.state_dict())
        return new_model
    
    def noise_params(self, std):
        for param in self.parameters():
            param.data += torch.randn(param.shape) * std
        

        









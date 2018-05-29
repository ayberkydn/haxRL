from PPOAgent import PPOAgent
import torch

torch.set_default_tensor_type(torch.cuda.FloatTensor)

agent = PPOAgent()
for n in range(1000):
    agent.train_step()



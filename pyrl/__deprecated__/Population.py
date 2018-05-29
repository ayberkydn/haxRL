from GeneticAgent import GeneticAgent
from Tournament import Tournament
from Models import ANN, DQN
import numpy as np
import random
from queue import Queue
import multiprocessing as mp

class Population:
    def __init__(self, size):
        self.members = []
        self.size = 0
        for n in range(size):
            #self.add_member(GeneticAgent(model = DQN()))
            self.add_member(GeneticAgent(model = ANN()))
            
    def add_member(self, member):
        self.members.append(member)
        self.size += 1
        
            
    def create_offspring(self):
        tournament = Tournament(np.random.choice(self.members, 4))
        winner = tournament.conduct()
        
        return winner
        
        
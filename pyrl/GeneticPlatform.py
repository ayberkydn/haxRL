from Population import Population
from GeneticAgent import GeneticAgent
from Models import ANN, DQN
import multiprocessing as mp

class GeneticPlatform:
    def __init__(self, pop_size):
        self.generation = Population(pop_size)
        self.generation_no = 0
    
    def progress_gen(self):
        print("Generation: {}".format(self.generation_no))
        print("Generation size: {}".format(self.generation.size))
        next_gen = Population(0)
        
        while next_gen.size < self.generation.size:
            offspring = self.generation.create_offspring()
            next_gen.add_member(offspring)
            next_gen.add_member(offspring.copy().mutate(0.3))
            next_gen.add_member(offspring.copy().mutate(1))
            
#            next_gen.add_member(GeneticAgent(model = DQN()))
            next_gen.add_member(GeneticAgent(model = ANN()))
            
        self.generation = next_gen
        


class GeneticPlatformAsync:
    def __init__(self, pop_size):
        self.generation = Population(pop_size)
        self.generation_no = 0
        
        
    
    def progress_gen(self):
        next_gen = Population(0)
        
        while next_gen.size < self.generation.size:        
            output = mp.Queue()
            processes = [mp.Process(target=self.generation.create_offspring_async, args=[output]) for x in range(4)]
            
            for p in processes:
                p.start()
            
            for p in processes:
                p.join()
        
            offspring = output.get()
            next_gen.add_member(offspring)
            next_gen.add_member(offspring.copy().mutate(0.3))
            next_gen.add_member(offspring.copy().mutate(1))

#            next_gen.add_member(GeneticAgent(model = DQN()))
            next_gen.add_member(GeneticAgent(model = ANN()))
            

        self.generation = next_gen
        
        
        
        
        
        
platform = GeneticPlatformAsync(50)
for n in range(500):
    platform.progress_gen()
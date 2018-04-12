from Match import Match
import numpy as np
class Tournament:
    def __init__(self, members_list):
        self.participants = members_list
        self.points = [0] * len(members_list)
    
    def conduct(self):
        for n in range(len(self.participants)):
            for i in range(len(self.participants)):
                if n == i:
                    continue
                else:
                    match = Match(self.participants[n], self.participants[i])
                    winner_bool = match.play()
                    if winner_bool == 0:
                        self.points[n] += 1
                    elif winner_bool == 1:
                        self.points[i] += 1
                    else:
                        raise Exception
        
        return self.participants[np.argmax(self.points)]
class ActionSpace:
    def __init__(self, actions_list):
        self.n = len(actions_list)
        self.actions = actions_list
        
    def __getitem__(self, n):
        return self.actions[n]
from Environment import HaxballEnvironment
from StateSequence import StateSequence
class Match:
    def __init__(self, member1, member2):
        self.member1 = member1
        self.member2 = member2
        
    def play(self):
        env = HaxballEnvironment(random_start = False, step_limit=5000, state_output_mode='pixels', rendering=True)
        done = False
        state_seq1 = StateSequence([84,84], 4, "CHW")
        state_seq2 = StateSequence([84,84], 4, "CHW")
        obs1, obs2 = env.reset()
        state_seq1.append_obs(obs1)
        state_seq2.append_obs(obs2)
        
        while not done:
            action1 = self.member1.select_action(state_seq1.get_sequence()) 
            action2 = self.member2.select_action(state_seq2.get_sequence())
            obs, _, done, info = env.step(action1, action2)
            obs1 = obs[0]
            obs2 = obs[1]
            
            state_seq1.append_obs(obs1 / 255)
            state_seq2.append_obs(obs2 / 255)
        
            if info['goal'][0] == True:
                winner = 0
                break
            elif info['goal'][1] == True:
                winner = 1
                break
        
        if info['ball_at_side'] == 0:
            winner = 1
        elif info['ball_at_side'] == 1:
            winner = 0
        else: #ball at center
            winner = info['closer_player_to_ball']
        
        env.close()
        return winner

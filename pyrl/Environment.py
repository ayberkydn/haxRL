from Box import Box
from Vector import Vector
from Goal import Goal
from Disc import Disc
from Ball import Ball
from Scene import Scene
from Color import Color
from Way import Way
from VerticalBorder import VerticalBorder
from HorizontalBorder import HorizontalBorder
import random
from Player import Player
from Action import Action
from Side import Side
import numpy as np
from config import c_width, c_height, middle_field_radius, topbottom_margin, \
leftright_margin, border_restitution, goal_length, ball_radius, ball_mass, \
ball_restitution, ball_damping, player_radius, player_mass, player_restitution, \
player_damping, player_kick_damping, player_kick_power



        
        

        
        
class HaxballEnvironment :
    def __init__(self, random_start = True, step_limit = 3000, state_output_mode = 'pixels', rendering = True, action_repeat=4):
        #self.episode_endChecker = () => (self.scene.check_goals() && !self.episode_end)
        self.step_limit = step_limit
        self.state_output_mode = state_output_mode
        self.rendering = rendering
        if state_output_mode == 'pixels': self.rendering = True
        self.step_count = 0
        self.random_start = random_start
        self.action_repeat = action_repeat
        self.episode_end_checker = lambda : (self.scene.check_goals() or self.step_count >= step_limit)
        
    
        self.scene =  Scene(c_width, c_height)
        self.scene.add_object(Box(0, c_width, 0, c_height - 0, 0))
        self.scene.add_object(Disc(c_width / 2, c_height / 2, middle_field_radius, 10, 1, 1, Color.white).make_ghost().make_hollow().set_outer_color(Color.border))
        self.scene.add_object(VerticalBorder(c_width / 2, c_height / 2, c_height - 2 * topbottom_margin, None).make_ghost())


        self.scene.add_object(HorizontalBorder(c_width / 2, topbottom_margin, c_width - 2 * leftright_margin, border_restitution).extend_to(Way.up).set_collision_mask([Ball]))
        self.scene.add_object(HorizontalBorder(c_width / 2, c_height - topbottom_margin, c_width - 2 * leftright_margin, border_restitution).extend_to(Way.down).set_collision_mask([Ball]))
        self.scene.add_object(VerticalBorder(leftright_margin, (c_height / 2 - goal_length / 2 + topbottom_margin) / 2, c_height / 2 - topbottom_margin - goal_length / 2, border_restitution).extend_to(Way.left).set_collision_mask([Ball]))
        self.scene.add_object(VerticalBorder(leftright_margin, c_height - (c_height / 2 - goal_length / 2 + topbottom_margin) / 2, c_height / 2 - topbottom_margin - goal_length / 2, border_restitution).extend_to(Way.left).set_collision_mask([Ball]))
        self.scene.add_object(VerticalBorder(c_width - leftright_margin, (c_height / 2 - goal_length / 2 + topbottom_margin) / 2, c_height / 2 - topbottom_margin - goal_length / 2, border_restitution).extend_to(Way.right).set_collision_mask([Ball]))
        self.scene.add_object(VerticalBorder(c_width - leftright_margin, c_height - (c_height / 2 - goal_length / 2 + topbottom_margin) / 2, c_height / 2 - topbottom_margin - goal_length / 2, border_restitution).extend_to(Way.right).set_collision_mask([Ball]))
        self.scene.add_object(Goal(leftright_margin, c_height / 2, Way.left, goal_length))
        self.scene.add_object(Goal(c_width - leftright_margin, c_height / 2, Way.right, goal_length))
       
        self.player1 = Player(120, c_height / 2, player_radius, player_mass, \
                                     player_restitution, player_damping, player_kick_damping, player_kick_power, Side.red)
       
        self.player2 = Player(c_width - 120, c_height / 2, player_radius, player_mass, \
                                     player_restitution, player_damping, player_kick_damping, player_kick_power, Side.blue)
       
        self.ball = Ball(c_width / 2, c_height / 2, ball_radius, ball_mass, ball_restitution, ball_damping)
        
        self.scene.add_object(self.player1)
        self.scene.add_object(self.player2)
        self.scene.add_object(self.ball)
        
        
        
    def step(self, action_red, action_blue = -1):
        actions = list(Action)
        for n in range(self.action_repeat):
            self.player1.apply_action(actions[action_red])
            self.player2.apply_action(actions[action_blue])
            self.scene.update()
            self.step_count += 1

        if self.rendering == True:
            self.render()
        
        return self._get_state_reward_done_info()
    
    
    def render(self):
        self.scene.draw()
        
    def reset(self):
        self.scene.reset()
        
        self.episode_end = False
        if (self.random_start) :
            self.scene.meta_objects['balls'][0].apply_impulse(Vector(random.random() - 0.5, random.random() - 0.5).mult(20))
        self.step_count = 0
        
        return self._get_state_reward_done_info()

    def _get_state_reward_done_info(self):
        state = self._calculate_state()
        reward = self._calculate_reward()
        
        done = self.episode_end_checker()
        
        info = {}
        
        return [np.array(state), reward, done, info]
    
    def _calculate_reward(self):
        reward = self.ball.velocity.x - 1
        return reward

        
    def _calculate_state(self):
        if self.state_output_mode == 'locations':    
            state = [self.player1.center.x, self.player1.center.y, self.ball.center.x,\
                    self.ball.center.y, self.player2.center.x, self.player2.center.y]
        elif self.state_output_mode == 'pixels':    
            state = self.scene.get_scene_as_array()
        else:
            raise Exception('invalid state output mode: {}'.format(self.state_output_mode))
        return state
        
        
        
        
        
#class HaxballEnvironment :
#    def __init__(self, render = True, sound = True, random_start = True):
#        self.render = render
#        self.sound = sound
#        self.random_start = random_start
#        self.agents = []
#        self.episode_end = False
#        #self.episode_endChecker = () => (self.scene.check_goals() && !self.episode_end)
#        self.episode = 1
#        self.episode_end_checker = lambda : (self.scene.check_goals() or self.step_count == 3000)
#        self.step_count = 0
#
#        self.scene =  Scene(c_width, c_height)
#        self.scene.add_object(Box(0, c_width, 0, c_height - 0, 0))
#        self.scene.add_object(Disc(c_width / 2, c_height / 2, middle_field_radius, 10, 1, 1, Color.white).make_ghost().make_hollow().set_outer_color(Color.border))
#        self.scene.add_object(VerticalBorder(c_width / 2, c_height / 2, c_height - 2 * topbottom_margin, None).make_ghost())
#
#
#        self.scene.add_object(HorizontalBorder(c_width / 2, topbottom_margin, c_width - 2 * leftright_margin, border_restitution).extend_to(Way.up).set_collision_mask([Ball]))
#        self.scene.add_object(HorizontalBorder(c_width / 2, c_height - topbottom_margin, c_width - 2 * leftright_margin, border_restitution).extend_to(Way.down).set_collision_mask([Ball]))
#        self.scene.add_object(VerticalBorder(leftright_margin, (c_height / 2 - goal_length / 2 + topbottom_margin) / 2, c_height / 2 - topbottom_margin - goal_length / 2, border_restitution).extend_to(Way.left).set_collision_mask([Ball]))
#        self.scene.add_object(VerticalBorder(leftright_margin, c_height - (c_height / 2 - goal_length / 2 + topbottom_margin) / 2, c_height / 2 - topbottom_margin - goal_length / 2, border_restitution).extend_to(Way.left).set_collision_mask([Ball]))
#        self.scene.add_object(VerticalBorder(c_width - leftright_margin, (c_height / 2 - goal_length / 2 + topbottom_margin) / 2, c_height / 2 - topbottom_margin - goal_length / 2, border_restitution).extend_to(Way.right).set_collision_mask([Ball]))
#        self.scene.add_object(VerticalBorder(c_width - leftright_margin, c_height - (c_height / 2 - goal_length / 2 + topbottom_margin) / 2, c_height / 2 - topbottom_margin - goal_length / 2, border_restitution).extend_to(Way.right).set_collision_mask([Ball]))
#        self.scene.add_object(Goal(leftright_margin, c_height / 2, Way.left, goal_length))
#        self.scene.add_object(Goal(c_width - leftright_margin, c_height / 2, Way.right, goal_length))
#        self.scene.add_object(Ball(c_width / 2, c_height / 2, ball_radius, ball_mass, ball_restitution, ball_damping))
#    
#
#    def add_agent(self, agent, side):
#        agent.env = self
#        agent.set_side(side)
#        self.agents.append(agent)
#        self.scene.add_object(agent.player)
#        agent.ball = self.scene.meta_objects['balls'][0]
#        if len(self.agents) == 2 :
#            self.agents[0].opponent = self.agents[1]
#            self.agents[1].opponent = self.agents[0]
#        
#    
#
#
#    def reset_scene(self):
#        self.scene.reset()
#        self.episode_end = False
#        if (self.random_start) :
#            self.scene.meta_objects['balls'][0].apply_impulse(Vector(random.random() - 0.5, random.random() - 0.5).mult(20))
#        self.step_count = 0
#    
#
#    def update(self):
#        for agent in self.agents:
#            agent.act()
#        
#        self.scene.update()
#
#        if self.episode_end_checker():
#            self.episode_end = True
#
#        for agent in self.agents:
#            agent.learn()
#        
#
#        if self.episode_end == True:
#            self.reset_scene()
#            
#
#        if self.render: self.scene.draw()
#
#        self.step_count += 1
#    
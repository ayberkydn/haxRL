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

from config import c_width, c_height, middle_field_radius, topbottom_margin, \
leftright_margin, border_restitution, goal_length, ball_radius, ball_mass, \
ball_restitution, ball_damping

class Environment :
    def __init__(self, render = True, sound = True, reset_delay = True, random_start = True):
        self.render = render
        self.sound = sound
        self.reset_delay = reset_delay
        self.random_start = random_start
        self.agents = []
        self.episode_end = False
        #self.episode_endChecker = () => (self.scene.check_goals() && !self.episode_end)
        self.episode = 1
        self.episode_end_checker = lambda : (self.scene.check_goals() or self.step == 1000)
        self.step = 0

        self.scene =  Scene()
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
        self.scene.add_object(Ball(c_width / 2, c_height / 2, ball_radius, ball_mass, ball_restitution, ball_damping))
    

    def add_agent(self, agent, side):
        agent.env = self
        agent.set_side(side)
        self.agents.append(agent)
        self.scene.add_object(agent.player)
        agent.ball = self.scene.meta_objects['balls'][0]
        if len(self.agents) == 2 :
            self.agents[0].opponent = self.agents[1]
            self.agents[1].opponent = self.agents[0]
        
    


    def reset_scene(self):
        self.scene.reset()
        self.episode_end = False
        if (self.random_start) :
            self.scene.meta_objects['balls'][0].applyImpulse(Vector(random.random() - 0.5, random.random() - 0.5).mult(20))
        self.step = 0
    

    def update(self):
        for agent in self.agents:
            agent.act()
        
        self.scene.update()

        if self.episode_end_checker():
            self.episode_end = True

        for agent in self.agents:
            agent.learn()
        

        if self.episode_end == True:
            if self.reset_delay:
                print("delay not implemented")
                self.reset_scene()
            else:
                self.reset_scene()
            
            if (self.sound == True) :
                 #Audio("goalsound.mp3").play()
                 print("sound not implemented")
        

        self.draw()

        self.step += 1
    

    def draw(self):
        pass
        
        #if (self.render == True) :
         #   self.scene.draw()
        
    
# -*- coding: utf-8 -*-


from Vector import Vector
from Way import Way
from Disc import Disc
import math
from Color import Color
from VerticalBorder import VerticalBorder
from HorizontalBorder import HorizontalBorder
from Ball import Ball

class Goal:
    def __init__(self, center_x, center_y, way, length, post_radius):
        self.center = Vector(center_x, center_y)
        self.way = way
        self.length = length
        self.depth = 30
        
        if self.way == Way.left:
            self.depth_margin = self.depth
        elif self.way == Way.right:
            self.depth_margin = -self.depth
            
        self.top_post = Disc(center_x, center_y - self.length / 2, post_radius, math.inf, 0.2, 0).set_color(Color.border)
        self.bottom_post = Disc(center_x, center_y + self.length / 2, post_radius, math.inf, 0.2, 0).set_color(Color.border)
        self.goal_line = VerticalBorder(center_x, center_y, self.length, 1)
        
        self.net_back = VerticalBorder(center_x - self.depth_margin, center_y, self.length, 0).set_color(Color.black).set_collision_mask([Ball]).extend_to(self.way)
        
        self.net_top = HorizontalBorder(center_x - self.depth_margin / 2, center_y - self.length / 2, self.depth, 0).set_color(Color.black).set_collision_mask([Ball]).extend_to(self.way)
        self.net_bottom = HorizontalBorder(center_x - self.depth_margin / 2, center_y + self.length / 2, self.depth, 0).set_color(Color.black).set_collision_mask([Ball]).extend_to(self.way)

        def check_goal(self, ball):
            if not isinstance(ball, Ball):
                return False
            
            if self.way == Way.left:
                
                if ball.center.x < self.center.x and ball.center.y > self.top_post.center.y and ball.center.y < self.bottom_post.center.y:
                    return True
                else:
                    return False
                
            elif self.way == Way.right:
                
                if ball.center.x > self.center.x and ball.center.y > self.top_post.center.y and ball.center.y < self.bottom_post.center.y:
                    return True
                else:
                    return False
                    

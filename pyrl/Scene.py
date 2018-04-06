from funcs import get_collision
from Disc import Disc
from Player import Player
from Ball import Ball
from Box import Box
from Goal import Goal
from Border import Border


class Scene:
    def __init__(self):
        self.objects = {
            "borders": [],
            "discs": [],
        }

        self.meta_objects = {
            "boxes": [],
            "goals": [],
            "balls": [],
            "centers": [],
            "players": [],
        }

        self.collisions = []
    

    def add_object(self, obj):
        if isinstance(obj, Disc):
            self.objects['discs'].append(obj)

        if isinstance(obj, Player):
            self.objects['discs'].append(obj.kicker)
            self.meta_objects['players'].append(obj)
            
        elif isinstance(obj, Ball):
            self.meta_objects['balls'].append(obj)
        elif isinstance(obj, Border):
            self.objects['borders'].append(obj)
        elif isinstance(obj, Box):
            self.meta_objects['boxes'].append(obj)
            for border_key in obj.borders:
                self.objects['borders'].append(obj.borders[border_key])
    
        elif isinstance(obj, Goal):
            self.meta_objects['goals'].append(obj)
            self.objects['borders'].append(obj.goal_line)
            self.objects['borders'].append(obj.net_top)
            self.objects['borders'].append(obj.net_bottom)
            self.objects['borders'].append(obj.net_back)
            self.objects['discs'].append(obj.top_post)
            self.objects['discs'].append(obj.bottom_post)
            if (len(self.meta_objects['goals']) == 2):
                goal1_center = self.meta_objects['goals'][0].center
                goal2_center = self.meta_objects['goals'][1].center
                self.meta_objects['centers'].append(goal1_center.add(goal2_center).div(2))

        obj.scene = self


    def get_collisions(self):

        # Disc-Border collisions
        for disc in self.objects['discs']:
            for border in self.objects['borders']:
                cls = get_collision(disc, border)
                if cls:
                    self.collisions.append(cls)
             

        #Disc-Disc collisions
        for i in range(len(self.objects['discs'])):
            for j in range(i + 1, len(self.objects['discs'])):
                disc1 = self.objects['discs'][i]
                disc2 = self.objects['discs'][j]
                cls = get_collision(disc1, disc2)
                if (cls):
                    self.collisions.append(cls)
                

    def resolve_collisions(self):
        while len(self.collisions) > 0:
            collision = self.collisions.pop()
            collision.resolve()
        
    

    def check_goals(self):
        for goal in self.meta_objects['goals']:
            for ball in self.objects['discs']:
                if goal.check_goal(ball):
                    return True
        return False
    
    
    def update(self):
        for object_key in self.objects:
            object_list = self.objects[object_key]
            for obj in object_list:
                obj.update()
            

        #Iterate 10 times for collisions
        for i in range(10):
            self.get_collisions()
            self.resolve_collisions()


    def reset(self):

        self.red_start_x = 100
        self.blue_start_x = 700
        self.meta_objects['players'][0].reset_position()
        self.meta_objects['players'][0].velocity = self.meta_objects['players'][0].velocity.mult(0)
        self.meta_objects['players'][1].reset_position()
        self.meta_objects['players'][1].velocity = self.meta_objects['players'][1].velocity.mult(0)
        self.meta_objects['balls'][0].reset_position()
        self.meta_objects['balls'][0].velocity = self.meta_objects['balls'][0].velocity.mult(0)
        
#
#    draw() {
#        ctx.fillStyle = bgColor
#        ctx.fillRect(0, 0, cWidth, cHeight)
#        for (let objectKey in self.objects) {
#            let objectList = self.objects[objectKey]
#            for (let object of objectList) {
#                object.draw()
#            }
#        }
#    }
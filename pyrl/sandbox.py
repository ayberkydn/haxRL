class Anan:
    def __init__(self):
        self.x = 1
        
    def upx(self):
        self.x += 1
        
    def uppx(self):
        self.upx()
        
    def defy(self, y):
        self.y = y
a = Anan()
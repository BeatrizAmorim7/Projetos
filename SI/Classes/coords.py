import math

class Coords:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distance_to(self, other):
        return math.sqrt((self.x - other.x)**2 + (self.y - other.y)**2)

    def __repr__(self):
        return f"Coords(x={self.x}, y={self.y})"
    
    def __eq__(self, other):
        if isinstance(other, Coords):
            return self.x == other.x and self.y == other.y
        return False

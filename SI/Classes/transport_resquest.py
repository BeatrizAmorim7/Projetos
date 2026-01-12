from Classes.coords import Coords
from Classes.transplant import TransplantInfo


class TransportRequest:
    def __init__(self, start: Coords, finish: Coords, transplant_info: TransplantInfo, object: int, pos: int):
        self.start = start
        self.finish = finish
        self.transplant_info = transplant_info
        self.object = object
        self.pos = pos

    def getStart(self):
        return self.start

    def setStart(self, start: Coords):
        self.start = start

    def getFinish(self):
        return self.finish

    def setFinish(self, finish: Coords):
        self.finish = finish

    def getTransplantInfo(self):
        return self.transplant_info

    def setTransplantInfo(self, transplant_info: TransplantInfo):
        self.transplant_info = transplant_info

    def getObject(self):
        return self.object

    def setObject(self, object: int):
        self.object = object

    def getPos(self):
        return self.pos

    def setPos(self, pos: int):
        self.pos = pos

    def toString(self):
        return "Transport Request [start=" + self.start.toString() + ", finish=" + self.finish.toString() + ", transplant=" + self.transplant_info.toString() +  ", object=" + self.object.toString() + ", posicao=" + self.pos.toString() + "]"
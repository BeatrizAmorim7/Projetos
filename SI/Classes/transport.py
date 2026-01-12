from Classes.coords import Coords


class Transporte:
    def __init__(self, jid:str, location: Coords, available: bool):
        self.jid = jid
        self.location = location
        self.available = available

    def getAgent(self):
            return self.jid

    def get_location(self):
        return self.location

    def set_location(self, new_location: Coords):
        self.location = new_location

    
    def is_available(self):
        return self.available

    def set_available(self, status: bool):
        self.available = status

    def __str__(self):
        return f"TransportAgent(jid={self.jid}, location={self.location}, available={self.available})"

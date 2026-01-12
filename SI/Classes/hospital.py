from Classes.coords import Coords

class Hospital:
    def __init__(self, jid:str, location:Coords):
        self.jid = jid
        self.location = location

    def get_Location(self):
        return self.location

    def set_Location(self, location: Coords):
        self.location = location

    def get_JID(self):
        return self.jid
    
    def __eq__(self, other):
        if isinstance(other, Hospital):
            return self.jid == other.jid and self.location == other.location
        return False

    def __str__(self):
        return f"Hospital(JID={self.jid}, Location={self.location})"

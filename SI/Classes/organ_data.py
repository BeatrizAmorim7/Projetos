from Classes.coords import Coords
from Classes.hospital import Hospital


class OrganData:
    def __init__ (self, organ_type: str, blood_type: str, hospital: Hospital, agent_jid: str):
        self.organ_type = organ_type
        self.blood_type = blood_type
        self.hospital = hospital
        self.agent_jid = agent_jid


    def get_OrganType(self):
        return self.organ_type
    
    def set_OrganType(self, organ_type: str):
        self.organ_type = organ_type
    
    def get_BloodType(self):
        return self.blood_type
    
    def set_BloodType(self, blood_type: str):
        self.blood_type = blood_type
    
    def get_Hospital(self):
        return self.hospital
    
    def set_Hospital(self, hospital: str):
        self.hospital = hospital

    def getAgent(self):
        return self.agent_jid

    def __str__(self):
        return (f"OrganData(OrganType={self.organ_type}, BloodType={self.blood_type}, "
                f"Hospital={self.hospital}, JID={self.agent_jid}, Location={self.hospital.location})")
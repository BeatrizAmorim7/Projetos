from Classes.coords import Coords
from Classes.hospital import Hospital


class RecipientData:
    def __init__ (self, organ_type: str, blood_type: str, urgency: int, hospital: Hospital, agent_jid: str):
        self.organ_type = organ_type
        self.blood_type = blood_type
        self.urgency = urgency
        self.hospital = hospital # Classe Hospital inclui o jid e a localizaçao
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

    def get_Urgency(self):
        return self.urgency
    
    def set_Urgency(self, urgency: int):
        self.urgency = urgency

    def getAgent(self):
        return self.agent_jid



    def __str__(self):
        return (f"RecipientData(OrganType={self.organ_type}, BloodType={self.blood_type}, "
                f"Urgency={self.urgency}, Hospital={self.hospital},"
                f"JID={self.agent_jid}, Location={self.hospital.location})")
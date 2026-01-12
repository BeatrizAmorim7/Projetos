from Classes.organ_data import OrganData
from Classes.recipient_data import RecipientData


class TransplantInfo:
    def __init__ (self, donor: OrganData, recipient: RecipientData):
        self.donor = donor
        self.recipient = recipient

    def get_Donor(self):
        return self.donor
    
    def set_Donor(self, donor: OrganData):
        self.donor = donor
    
    def get_Recipient(self):
        return self.recipient
    
    def set_Recipient(self, recipient: RecipientData):
        self.recipient = recipient
    

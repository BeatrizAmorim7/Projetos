from spade.behaviour import OneShotBehaviour
from spade.message import Message

import random

from Classes.coords import Coords
from Classes.organ_data import OrganData
import jsonpickle

# behaviour do agente doador

class Donation(OneShotBehaviour):
    async def on_start(self):
        print("organNotif behaviour starting...")

        self.organs = self.get("choose_organ")
        self.blood_types = self.get("choose_bt")
        self.hospitals = self.get("choose_hospital")

    async def run(self):

        organ_type = random.choice(self.organs)
        blood_type = random.choice(self.blood_types)
        
        # estes são só para forçar compatibilidade e ver como o transporte funciona 
        # organ_type = 'heart'
        # blood_type = 'A'

        # Escolher hospital aleatório da lista de hospitais criados
        hospital = (random.choice(self.hospitals)).get('hospital') 
        organ_donation = OrganData(organ_type, blood_type, hospital, str(self.agent.jid))

        msg = Message(to=self.agent.get("transplant_agent_jid"))
        msg.body = jsonpickle.encode(organ_donation)
        msg.set_metadata("performative", "subscribe")                     

        print("Agent {}:".format(str(self.agent.jid)) + " new organ available for donation with details: {}".format((organ_type, blood_type, hospital.__str__())))

        await self.send(msg)
        

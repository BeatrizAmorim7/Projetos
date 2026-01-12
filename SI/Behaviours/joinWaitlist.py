from spade.behaviour import OneShotBehaviour
from spade.message import Message
from Classes.coords import Coords
from Classes.hospital import Hospital
from Classes.recipient_data import RecipientData
import jsonpickle
import random

from Classes.recipient_data import RecipientData
import jsonpickle

# behaviour do agente recetor

class RequestOrgan(OneShotBehaviour):
    async def on_start(self):
        print("JoinRecWaitlist behaviour starting...")

        self.organs = self.get("choose_organ")
        self.blood_types = self.get("choose_bt")
        self.hospitals = self.get("choose_hospital")

    async def run(self):

        
        urgency = random.randint(1, 5) # urgência em níveis de 1 a 5 
        #urgency = 5

        organ_type = random.choice(self.organs)
        blood_type = random.choice(self.blood_types)

        # estes são só para forçar compatibilidade e ver como o transporte funciona 
        # organ_type = 'heart'
        # blood_type = 'A'

        # Escolher hospital aleatório da lista de hospitais criados
        hospital = (random.choice(self.hospitals)).get('hospital')  # para ir buscar o objeto Hospital
        recipient_data = RecipientData(organ_type, blood_type, urgency, hospital, str(self.agent.jid))

        msg = Message(to=self.agent.get("transplant_agent_jid"))
        msg.body = jsonpickle.encode(recipient_data)
        msg.set_metadata("performative", "request")

        print("Agent {}:".format(str(self.agent.jid)) + " needs organ donation with details: {}".format((organ_type, blood_type, urgency, hospital.__str__())))

        await self.send(msg)
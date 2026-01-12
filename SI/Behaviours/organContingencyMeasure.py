from spade.behaviour import PeriodicBehaviour
from spade.message import Message

import jsonpickle

# behaviour do agente transplante

class ResendOrgan(PeriodicBehaviour):
    async def on_start(self):
        print("ResendOrgan behaviour starting...")

    async def run(self):

        for organ in self.agent.donorList: # só estão na donorList os órgãos que não foram alocados à chegada

            resend_msg = Message(to=str(self.agent.jid))
            resend_msg.body = jsonpickle.encode(organ)
            resend_msg.set_metadata("performative", "subscribe")      

            organ_type = organ.get_OrganType()
            blood_type = organ.get_BloodType()
            hospital = organ.get_Hospital()

           
            print("Agent {}:".format(str(self.agent.jid)) + " resending organ donation with details: {}".format((organ_type, blood_type, hospital.__str__())))

            await self.send(resend_msg)

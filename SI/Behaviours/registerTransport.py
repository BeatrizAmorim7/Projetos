from spade.behaviour import OneShotBehaviour
from spade.message import Message
from Classes.coords import Coords
from Classes.transport import Transporte
import jsonpickle
import random



# behaviour do agente transporte

class TransportSubscribe(OneShotBehaviour):
    async def on_start(self):
        print("TransportSubscribe behaviour starting...")

    
    async def run(self):

        transport_location = Coords(random.randint(0, 100), random.randint(0, 100))
        transport = Transporte(str(self.agent.jid),transport_location,True)

        msg = Message(to=self.agent.get("transplant_agent_jid"))
        msg.body = jsonpickle.encode(transport)
        msg.set_metadata("performative", "inform")


        print("Agent {}:".format(str(self.agent.jid)) + " Transport Agent informing Transplant Agent {}".format(str(self.agent.get('transplant_agent_jid'))))

        await self.send(msg)
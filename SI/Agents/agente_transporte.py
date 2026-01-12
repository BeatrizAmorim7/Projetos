from spade import agent
from Behaviours.transportOrgan import TransportOrgan
from Behaviours.registerTransport import TransportSubscribe

class TransportAgent(agent.Agent):

    async def setup(self):

        print("Agent {}".format(str(self.jid)) + " starting...")
        
        a = TransportSubscribe()
        self.add_behaviour(a)

        b = TransportOrgan()
        self.add_behaviour(b)
from spade import agent
from Behaviours.hospitalAvailability import HospitalAvailable


class HospitalAgent(agent.Agent):

    async def setup(self):

        print("Agent {}".format(str(self.jid)) + " starting...")
        
        b = HospitalAvailable()
        self.add_behaviour(b)
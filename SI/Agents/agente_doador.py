from spade import agent

from Behaviours.organNotif import Donation

class DonorAgent(agent.Agent):

    async def setup(self):

        print("Agent {}".format(str(self.jid)) + " starting...")

        a = Donation()
        self.add_behaviour(a)
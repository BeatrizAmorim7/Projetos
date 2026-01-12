from spade import agent

from Behaviours.joinWaitlist import RequestOrgan
from Behaviours.receivePatient import PatientReceives

class RecipientAgent(agent.Agent):

    async def setup(self):

        print("Agent {}".format(str(self.jid)) + " starting...")

        a = RequestOrgan()
        self.add_behaviour(a)

        b = PatientReceives()
        self.add_behaviour(b)
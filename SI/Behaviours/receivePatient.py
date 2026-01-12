from spade.behaviour import CyclicBehaviour


class PatientReceives(CyclicBehaviour):

    async def on_start(self):
        print("PatientReceives behaviour starting...")

    async def run(self):

        msg = await self.receive(timeout=10) 

        if msg:
            performative = msg.get_metadata("performative")

            if performative == "confirm":
                print("Agent {}:".format(str(self.agent.jid)) + " Received organ transport confirmation!")
            elif performative == "inform":
                print("Agent {}:".format(str(self.agent.jid)) + " Waiting for organ!")
            else:
                print("Agent {}:".format(str(self.agent.jid)) + " Message not understood!")

    
  
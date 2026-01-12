from spade.behaviour import CyclicBehaviour
from spade.message import Message
import random
import jsonpickle

class HospitalAvailable (CyclicBehaviour):
    async def on_start(self):
        print("HospitalAvailability behaviour starting...")

    
    async def run(self):
        msg = await self.receive(timeout=10)

        if msg:
            performative = msg.get_metadata("performative")

            if performative == "request":

                # para debug:
                print(f"Hospital {self.agent.jid} received message from: {msg.sender}")

                transplant_info = jsonpickle.decode(msg.body)
                donor_info = transplant_info.get_Donor()
                recipient_info = transplant_info.get_Recipient()

                print(f"Hospital {self.agent.jid}: Checking availability for transplant from {donor_info.getAgent()} to {recipient_info.getAgent()}")

                available = random.choice([True, False]) 

                hospital_response = Message(to=str(msg.sender))
                
                if available:
                    hospital_response.set_metadata("performative", "confirm")
                    print(f"Hospital {self.agent.jid} has available resources for transplant from {donor_info.getAgent()} to {recipient_info.getAgent()}.")
                    hospital_response.body = jsonpickle.encode(transplant_info)

                else:
                    hospital_response.set_metadata("performative", "refuse")
                    print(f"Hospital {self.agent.jid} does not have available resources for transplant from {donor_info.getAgent()} to {recipient_info.getAgent()}.")
                    hospital_response.body = jsonpickle.encode(transplant_info)


                await self.send(hospital_response)

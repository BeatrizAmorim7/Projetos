from spade.behaviour import CyclicBehaviour
from spade.message import Message
import time
import jsonpickle


class TransportOrgan(CyclicBehaviour):
    async def run(self):

        msg = await self.receive(timeout=10)

        if msg and msg.get_metadata("performative") == "request":
            
            transport_data = jsonpickle.decode(msg.body)
            print(f"Transport Agent: Received transport request")

            donor_location = transport_data.getStart()
            recipient_location = transport_data.getFinish()
            transplant_info = transport_data.getTransplantInfo()
            organ_type = (transplant_info.get_Donor()).get_OrganType()
            
            print(f"Transport Agent: Transporting {organ_type} from {donor_location} to {recipient_location}")
            
            # Simular transporte com um tempo de espera
            time.sleep(5)  # Simula o transporte do órgão

            # Informar o Agente Transplante de que o transporte foi concluído
            response = Message(to=str(msg.sender))
            response.set_metadata("performative", "confirm")
            response.body = jsonpickle.encode(transport_data)
            await self.send(response)



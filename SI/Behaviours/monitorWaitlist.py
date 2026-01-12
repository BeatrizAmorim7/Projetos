from spade.behaviour import PeriodicBehaviour
from spade.message import Message
from Classes.transport_resquest import TransportRequest

import jsonpickle

# behaviour do agente transplante

class MonitoringWaitlist(PeriodicBehaviour):
    async def on_start(self):
        print("MonitoringWaitlist behaviour starting...")

    async def run(self):

        if not self.agent.waitingList:
            print("Waiting list is empty.")
            
        else:

            # Iterar sobre a lista de espera
            for idx, info in enumerate(self.agent.waitingList):

                donor_info = info.get_Donor()
                recipient_info = info.get_Recipient()

                pos = -1
                closest_transport = None
                min_distance = 1000000000

                for id, transport_agent in enumerate(self.agent.transportList):
                    distance = donor_info.hospital.get_Location().distance_to(transport_agent.get_location())
                    if distance < min_distance and transport_agent.is_available():
                        closest_transport = transport_agent
                        min_distance = distance
                        pos = id
                
                if closest_transport:
                    print(f"Transport found for item {idx} in the waiting list. Transport Agent selected:  {closest_transport.jid}")
                    transport_jid = closest_transport.getAgent()
                    transport_msg = Message(to=str(transport_jid))

                    transport_msg.set_metadata("performative", "request")

                    donor_location = donor_info.hospital.get_Location()
                    recipient_location = recipient_info.hospital.get_Location()
                    object = 0 # transporte de orgão

                    transport_data = TransportRequest(donor_location, recipient_location, info, object, pos)
                    transport_msg.body = jsonpickle.encode(transport_data)

                    await self.send(transport_msg)

                    print(f"Agent {str(self.agent.jid)} sent transport request to transport {transport_jid} for organ {donor_info.get_OrganType()} for recipient {recipient_info.getAgent()}.")

                    # Atualizar estado do transporte
                    self.agent.transportList[pos].set_available(False) 

                    # Remover da lista de espera
                    self.agent.waitingList.remove(info)

                    print(f"Item {idx} removed from waiting list.")
                    break  # Processa apenas um item por execução para evitar conflitos

                else:
                    print(f"No transport yet available for item {idx}. Retrying later.")

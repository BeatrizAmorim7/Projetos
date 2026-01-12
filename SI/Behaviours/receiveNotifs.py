from spade.behaviour import CyclicBehaviour
from spade.message import Message
from Classes.transport_resquest import TransportRequest
from Classes.transplant import TransplantInfo

import jsonpickle
import random

# behaviour do agente transplante

class ReceiveInfo(CyclicBehaviour):
    async def on_start(self):
        print("ReceiveInfo behaviour starting...")

    async def run(self):

        msg = await self.receive(timeout=10)

        if msg:
            performative = msg.get_metadata("performative")

            if performative == "request":  # Mensagem do recetor
                recipient_info = jsonpickle.decode(msg.body)
                self.agent.recipientList.append(recipient_info)
                print(f"Agent {self.agent.jid}: Recipient {msg.sender} info registered!")

            elif performative == "inform": # Mensagem do transporte
                transport_info = jsonpickle.decode(msg.body)
                self.agent.transportList.append(transport_info)
                print(f"Agent {self.agent.jid}: Transport {msg.sender} info registered!")


            elif performative == "subscribe":  # Mensagem do doador / reenvio da mensagem do dador
                
                organ_info = jsonpickle.decode(msg.body)

                if "donor" in str(msg.sender): # se for um órgão novo, adicionar à lista de dadores
                    self.agent.donorList.append(organ_info)
                    print(f"Agent {self.agent.jid}: Donor {msg.sender} info registered!")

                elif "transplant" in str(msg.sender): # se for um reenvio, não é preciso adicionar porque já lá está
                    print(f"Organ reallocation - Agent {self.agent.jid}: Donor {msg.sender} already registered!")

                # alocação do órgão

                if not self.agent.recipientList:
                    print("No recipients in need of organs")
                    # medida de contingência no outro behaviour para não se perder o órgão

                else:

                    # Filtrar recetores compatíveis
                    compatible_recipients = [
                        patient for patient in self.agent.recipientList
                        if patient.get_BloodType() == organ_info.get_BloodType() and patient.get_OrganType() == organ_info.get_OrganType()
                    ]

                    if not compatible_recipients:  # Se não houver recetores compatíveis
                        print(f"Não há recetores compatíveis para o órgão {organ_info.get_OrganType()} de tipo sanguíneo {organ_info.get_BloodType()}.")
                        # Continua para o próximo órgão, não interrompe todo o loop

                    else:
                        print(f"Há recetores compatíveis para o órgão {organ_info.get_OrganType()} de tipo sanguíneo {organ_info.get_BloodType()}.")

                        # só para testar
                        print("Recetores compatíveis antes da ordenação:")
                        for recipient in compatible_recipients:
                            print(f"Recipient: {recipient.getAgent()}, Urgency: {recipient.get_Urgency()}, Distance: {organ_info.hospital.get_Location().distance_to(recipient.hospital.get_Location())}")

                        # Ordenar por urgência (decrescente) e distância (crescente)
                        # ordenar por urgencia e distancias ao mesmo tempo - a urgencia tem prioridade à distancia - se tiver 2 urgencias iguais escolhe o hospital mais próximo, do resto escolhe sempre o que tiver maior prioridade
                        compatible_recipients.sort(key=lambda p: (-p.get_Urgency(), organ_info.hospital.get_Location().distance_to(p.hospital.get_Location())))

                        #só para testar
                        print("Recetores compatíveis depois da ordenação:")
                        for recipient in compatible_recipients:
                            print(f"Recipient: {recipient.getAgent()}, Urgency: {recipient.get_Urgency()}, Distance: {organ_info.hospital.get_Location().distance_to(recipient.hospital.get_Location())}")

                        # escolher o primeiro da lista 
                        select_recipient = compatible_recipients[0]

                        # Pedir disponibilidade ao hospital do recetor
                        hospital_agent = select_recipient.hospital.get_JID()
                        hospital_msg = Message(to=hospital_agent)
                        hospital_msg.set_metadata("performative", "request")

                        transplant_info = TransplantInfo(organ_info, select_recipient)
                        hospital_msg.body = jsonpickle.encode(transplant_info)

                        await self.send(hospital_msg)

                        print("Agent {}:".format(str(self.agent.jid)) + " sent availability request to hospital {}".format(hospital_agent))


            elif performative == "confirm" and "hospital" in str(msg.sender): # mensagem de confirmação de disponibilidade do hospital
                
                hospital_agent = msg.sender
                info = jsonpickle.decode(msg.body)
                donor_info = info.get_Donor()
                recipient_info = info.get_Recipient()

                print(f"Organ {donor_info.get_OrganType()} from {donor_info.getAgent()} allocated to recipient {recipient_info.getAgent()} at {hospital_agent}.")

                # Enviar dados para transporte
                if donor_info.get_Hospital() != recipient_info.get_Hospital() and self.agent.transportList:

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
                        print(f"Transport Agent selected:  {closest_transport.jid}")
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

                        self.agent.transportList[pos].set_available(False)      

                        # informar o paciente
                        patient_msg = Message(to=recipient_info.getAgent())
                        patient_msg.set_metadata("performative", "confirm")
                        patient_msg.body = "Organ is on its way. Please prepare for surgery."
                        await self.send(patient_msg) 

                    else:
                        print("Agent {}:".format(str(self.agent.jid)) + " No transports available at the moment! Adding to the waiting list.")
                        
                        # hospital já disse que estava disponível, apenas não há ambulâncias naquele preciso momento
                        
                        print("No transports available. Adding to the waiting list.")
                        self.agent.waitingList.append(info)

                        # informar atraso para o paciente
                        patient_msg = Message(to=recipient_info.getAgent())
                        patient_msg.set_metadata("performative", "inform")
                        patient_msg.body = "Transport temporarily unavailable for organ donation. Please prepare for delays."
                        await self.send(patient_msg)      
     

                else:
                    print("Donor and recipient are already in the same hospital!")
                    print(f"Removing organ {donor_info.getAgent()} and recipient {recipient_info.getAgent()} from lists.")
                    for donor in self.agent.donorList:
                        if donor.getAgent() == donor_info.getAgent():
                            self.agent.donorList.remove(donor)
                    
                    for recipient in self.agent.recipientList:
                        if recipient.getAgent() == recipient_info.getAgent():
                            self.agent.recipientList.remove(recipient)

            
            elif performative == "refuse" and "hospital" in str(msg.sender): # mensagem de recusa de disponibilidade do hospital
                
                hospital_agent = msg.sender
                info = jsonpickle.decode(msg.body)
                donor_info = info.get_Donor()
                recipient_info = info.get_Recipient()
                hospital_agent_jid = recipient_info.hospital.get_JID() # para comparar tem de ser este, o outro não dá por causa do str()
        
                print(f"Hospital {hospital_agent} unavailable to receive organ {donor_info.get_OrganType()} transplant from {donor_info.getAgent()} to {recipient_info.getAgent()}.")

                if recipient_info.get_Urgency() == 5:
                    # tentar outro hospital 
                    print(f"Urgency level 5 for recipient {recipient_info.getAgent()}. Checking other hospitals for availability...")

                    # lista de hospitais excluindo o hospital que já recusou
                    alternative_hospitals = [h for h in self.agent.hospitalList if h.get_JID() != hospital_agent_jid]

                    # lista de hospitais por ordem crescente de distância ao paciente
                    alternative_hospitals.sort(
                        key=lambda h: recipient_info.hospital.get_Location().distance_to(h.get_Location()))

                    if not alternative_hospitals:
                        print("No alternative hospitals available.")

                    else:
                        for hospital in alternative_hospitals:

                            new_hospital_agent = hospital.get_JID()

                            # Enviar mensagem ao hospital para verificar disponibilidade
                            hospital_msg = Message(to=new_hospital_agent)
                            hospital_msg.set_metadata("performative", "request")

                            transplant_info = TransplantInfo(donor_info, recipient_info)
                            hospital_msg.body = jsonpickle.encode(transplant_info)

                            await self.send(hospital_msg)
                            print(f"Agent {str(self.agent.jid)} sent availability request to hospital {new_hospital_agent} for recipient {recipient_info.getAgent()}.")

                            response = await self.receive(timeout=10)

                            if response and response.get_metadata("performative") == "confirm":
                                print(f"Hospital {hospital_agent} confirmed availability for recipient {recipient_info.getAgent()}.")

                                if self.agent.transportList:           
                                    # 2 transportes: 1 para transportar o orgao e outro para transportar o recetor
                                
                                    donor_location = donor_info.hospital.get_Location()
                                    target_location = hospital.get_Location()
                                    patient_location = recipient_info.hospital.get_Location()

                                    pos_t_organ = -1
                                    pos_t_recipient = -1
                                    closest_organ_transport = None
                                    closest_recipient_transport = None
                                    min_distance_organ = 10000000000
                                    min_distance_recipient =  1000000000

                                    for id, transport_agent in enumerate(self.agent.transportList):
                                        if transport_agent.is_available():
                                            distance_organ = donor_location.distance_to(transport_agent.get_location())
                                            if distance_organ < min_distance_organ:
                                                closest_organ_transport = transport_agent
                                                min_distance_organ = distance_organ
                                                pos_t_organ = id

                                    for id, transport_agent in enumerate(self.agent.transportList):
                                        if transport_agent.is_available() and transport_agent != closest_organ_transport:
                                            distance_recipient = patient_location.distance_to(transport_agent.get_location())
                                            if distance_recipient < min_distance_recipient:
                                                closest_recipient_transport = transport_agent
                                                min_distance_recipient = distance_recipient
                                                pos_t_recipient = id

                                    if closest_organ_transport and closest_recipient_transport:
                                        print(f"Organ transport agent: {closest_organ_transport.jid}")
                                        print(f"Patient transport agent: {closest_recipient_transport.jid}")

                                        organ_transport_data = TransportRequest(donor_location, target_location, info, 0, pos_t_organ)
                                        organ_transport_msg = Message(to=str(closest_organ_transport.getAgent()))
                                        organ_transport_msg.set_metadata("performative", "request")
                                        organ_transport_msg.body = jsonpickle.encode(organ_transport_data)
                                        await self.send(organ_transport_msg)

                                        print(f"Agent {str(self.agent.jid)} sent transport request to transport {closest_organ_transport.jid} for organ {donor_info.get_OrganType()} for recipient {recipient_info.getAgent()}.")

                                        self.agent.transportList[pos_t_organ].set_available(False)  

                                        patient_transport_data = TransportRequest(patient_location, target_location, info, 1, pos_t_recipient)
                                        recipient_transport_msg = Message(to=str(closest_recipient_transport.getAgent()))
                                        recipient_transport_msg.set_metadata("performative", "request")
                                        recipient_transport_msg.body = jsonpickle.encode(patient_transport_data)
                                        await self.send(recipient_transport_msg)

                                        print(f"Agent {str(self.agent.jid)} sent transport request to transport {closest_organ_transport.jid} for recipient {recipient_info.getAgent()}.")

                                        self.agent.transportList[pos_t_recipient].set_available(False) 

                                        break # não consulta mais hospitais

                        # se nenhum dos hospitais tiver disponibilidade, o orgão dador é reenviado

                elif recipient_info.get_Urgency() < 5:
                    # passa para o próximo paciente compatível

                    compatible_recipients = [
                    patient for patient in self.agent.recipientList
                    if patient.get_BloodType() == donor_info.get_BloodType() and patient.get_OrganType() == donor_info.get_OrganType()
                    ]
                    
                    compatible_recipients.sort(key=lambda p: (-p.get_Urgency(), donor_info.hospital.get_Location().distance_to(p.hospital.get_Location())))
                    
                    # Remove o paciente atual
                    compatible_recipients = [p for p in compatible_recipients if p.getAgent() != recipient_info.getAgent()]

                    if not compatible_recipients:
                        print("No more compatible recipients available. Donor organ will be reevaluated shortly.")

                    else:
                        print("Trying next compatible recipient...")

                        next_recipient = compatible_recipients[0]

                        # Pedir disponibilidade ao hospital do recetor
                        hospital_agent = next_recipient.hospital.get_JID()
                        hospital_msg = Message(to=hospital_agent)
                        hospital_msg.set_metadata("performative", "request")

                        transplant_info = TransplantInfo(donor_info, next_recipient)
                        hospital_msg.body = jsonpickle.encode(transplant_info)

                        await self.send(hospital_msg)

                        print("Agent {}:".format(str(self.agent.jid)) + " sent availability request to hospital {}".format(hospital_agent))


            elif performative == "confirm" and "transport" in str(msg.sender): # mensagem de confirmação de disponibilidade do transporte

                transport_data = jsonpickle.decode(msg.body)
                donor_data = (transport_data.getTransplantInfo()).get_Donor()
                recipient_data = (transport_data.getTransplantInfo()).get_Recipient()
                transport_pos = transport_data.getPos()
                
                if transport_data.getObject() == 1: # transporte do paciente para outro hospital
                    print("Patient transport succesful!")
                      
                elif transport_data.getObject() == 0: # transporte de orgaos 
                    print("Organ transport succesful!")
                    for donor in self.agent.donorList:
                        if donor.getAgent() == donor_data.getAgent():
                            self.agent.donorList.remove(donor)
                    
                    for recipient in self.agent.recipientList:
                        if recipient.getAgent() == recipient_data.getAgent():
                            self.agent.recipientList.remove(recipient)

                print(f"Removing organ {donor_data.getAgent()} and recipient {recipient_data.getAgent()} from lists.")

                self.agent.transportList[transport_pos].set_available(True)
                self.agent.transportList[transport_pos].set_location(transport_data.getFinish())        

                                    
            else:
                print("Agent {}:".format(str(self.agent.jid)) + 
                      "Message not understood - performative different from request, subscribe, inform, confirm or refuse")
        
        else:
            print("Message not received")




            





            


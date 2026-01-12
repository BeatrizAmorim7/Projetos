import time
from spade import quit_spade

from Agents.agente_doador import DonorAgent
from Agents.agente_hospital import HospitalAgent
from Agents.agente_recetor import RecipientAgent
from Agents.agente_transplante import TransplantAgent
from Agents.agente_transporte import TransportAgent
from Classes.coords import Coords
import random

from Classes.hospital import Hospital
from Classes.organ_data import OrganData
from Classes.recipient_data import RecipientData
from Classes.transport import Transporte


XMPP_SERVER = 'desktop-rea97l5'
#XMPP_SERVER = 'laptop-0f9j9kmr'
#XMPP_SERVER = 'desktop-qvpgebn'
PASSWORD = 'NOPASSWORD'

# variáveis globais com max orgãos, max recipientes e max hospitais
max_donations = 30
max_recipients = 30
max_hospitals = 3
max_transport = 5


if __name__ == '__main__':
    donor_agents_list = []
    recipient_agents_list = []
    hospital_agents_list = []
    transport_agents_list = []

    organs = ['Heart', 'Kidney', 'Liver']
    blood_types = ['A', 'B', 'O', 'AB']


    # Inicializar o Agente Transplante
    transplant_agent_jid = 'transplant@' + XMPP_SERVER
    transplant_agent = TransplantAgent(transplant_agent_jid, PASSWORD)
    t = transplant_agent.start()
    t.result()

    for j in range(1, max_hospitals + 1):

        hospital_jid = 'hospital' + str(j) + '@' + XMPP_SERVER
        hospital_location = Coords(random.randint(0, 100), random.randint(0, 100))  # Localização aleatória para o hospital
        # Criar um objeto Hospital
        hospital = Hospital(hospital_jid, hospital_location)

        # Criar o HospitalAgent
        hospital_agent = HospitalAgent(hospital_jid, PASSWORD)
        hospital_agent.set('transplant_agent_jid', transplant_agent_jid)
        hospital_agent.set('hospital', hospital)  # Associar o hospital real (Hospital) ao agente
        h = hospital_agent.start()
        h.result()
        hospital_agents_list.append(hospital_agent)
        transplant_agent.hospitalList.append(hospital)


    # Inicializar o Agente Transporte
    for i in range(1, max_transport + 1):

        transport_agent_jid = 'transport' + str(i) + '@' + XMPP_SERVER

        transport_agent = TransportAgent(transport_agent_jid, PASSWORD)

        transport_agent.set('transplant_agent_jid', transplant_agent_jid)
        tr = transport_agent.start()
        tr.result()
        transport_agents_list.append(transport_agent) 


    recipient_counter = 0
    donor_counter = 0

    while recipient_counter < max_recipients or donor_counter < max_donations:
        if recipient_counter < max_recipients:

            recipient_jid = 'recipient' + str(recipient_counter + 1) + '@' + XMPP_SERVER
            recipient = RecipientAgent(recipient_jid, PASSWORD)

            recipient.set('transplant_agent_jid', transplant_agent_jid)
            recipient.set('choose_organ', organs)  # Associar os dados ao recetor
            recipient.set('choose_bt', blood_types)
            recipient.set('choose_hospital', hospital_agents_list)

            r = recipient.start()
            r.result()
            recipient_agents_list.append(recipient)
            recipient_counter += 1

        if donor_counter < max_donations:


            donor_jid = 'donor' + str(donor_counter + 1) + '@' + XMPP_SERVER
            donor = DonorAgent(donor_jid, PASSWORD)

            donor.set('transplant_agent_jid', transplant_agent_jid)
            donor.set('choose_organ', organs)
            donor.set('choose_bt', blood_types)
            donor.set('choose_hospital', hospital_agents_list)

            d = donor.start()
            d.result()
            donor_agents_list.append(donor)
            donor_counter += 1


    # for k in range(1, max_recipients + 1):
    #
    #     # if i % 10 == 0:
    #     #     time.sleep(1)
    #
    #     recipient_jid = 'recipient' + str(k) + '@' + XMPP_SERVER
    #
    #     recipient = RecipientAgent(recipient_jid, PASSWORD)
    #     recipient.set('transplant_agent_jid', transplant_agent_jid)
    #     recipient.set('choose_organ', organs)  # Associar os dados ao recetor
    #     recipient.set('choose_bt', blood_types)
    #     recipient.set('choose_hospital', hospital_agents_list)
    #
    #     r = recipient.start()
    #     r.result()
    #     recipient_agents_list.append(recipient)
    #
    # for i in range(1, max_donations + 1):
    #
    #     # if i % 10 == 0:
    #     #     time.sleep(1)
    #
    #     donor_jid = 'donor' + str(i) + '@' + XMPP_SERVER
    #
    #     donor = DonorAgent(donor_jid, PASSWORD)
    #     donor.set('transplant_agent_jid', transplant_agent_jid)
    #     donor.set('choose_organ', organs)
    #     donor.set('choose_bt', blood_types)
    #     donor.set('choose_hospital', hospital_agents_list)
    #
    #     d = donor.start()
    #     d.result()
    #     donor_agents_list.append(donor)
    #

    while transplant_agent.is_alive():
        try:
            time.sleep(1)
        except KeyboardInterrupt:  
            for recipient in recipient_agents_list: 
                recipient.stop()

            for donor in donor_agents_list: 
                donor.stop()

            for hospital in hospital_agents_list: 
                hospital.stop()

            for transport in transport_agents_list:
                transport_agent.stop()  

            break
    print('Agents finished')

    quit_spade()
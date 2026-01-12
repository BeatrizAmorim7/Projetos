from spade import agent

from Behaviours.receiveNotifs import ReceiveInfo
from Behaviours.monitorWaitlist import MonitoringWaitlist
from Behaviours.organContingencyMeasure import ResendOrgan

class TransplantAgent(agent.Agent):

    donorList = [] # lista de organ_data
    recipientList = [] # lista de recipient_data
    
    hospitalList = []
    transportList = []

    waitingList = [] # para quando não há transportes imediatamente disponíveis
    
    async def setup(self):

        print("Agent {}".format(str(self.jid)) + " starting...")

        a = ReceiveInfo() # alocação imediata quando chega um orgão dador
        self.add_behaviour(a)

        b = MonitoringWaitlist(period = 10)
        self.add_behaviour(b)

        # medida de contingência para os órgãos dadores que não têm compatibilidade com recetores à chegada
        c = ResendOrgan(period = 10)
        self.add_behaviour(c)

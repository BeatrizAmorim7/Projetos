# Sistema Multiagente para Gestão de Transplantes de Órgãos

**Unidade Curricular:** Sistemas Inteligentes (SI)

**Mestrado em Engenharia Biomédica | Informática Médica**

**Universidade do Minho** - 2024/2025

Este repositório apresenta o desenvolvimento e a implementação de um sistema multiagente.
O sistema tem como objetivo apoiar e otimizar a **gestão do processo de transplante de órgãos**, coordenando doadores, recetores, hospitais e meios de transporte, tendo em conta critérios como compatibilidade biológica, urgência clínica e logística.

---

## Contexto e Motivação

O transplante de órgãos é um processo altamente complexo e sensível ao tempo, envolvendo múltiplos intervenientes e restrições críticas, tais como:
- Tempo de viabilidade do órgão;
- Compatibilidade entre dador e recetor;
- Grau de urgência clínica;
- Proximidade geográfica;
- Disponibilidade hospitalar e de transporte.

Este projeto propõe uma abordagem baseada em **agentes inteligentes**, capazes de comunicar, cooperar e tomar decisões distribuídas, de forma a aumentar a eficiência do processo e reduzir o desperdício de órgãos.

---

## Objetivos do Projeto

- Desenvolver um sistema multiagente para **alocação eficiente de órgãos**;
- Considerar **compatibilidade, urgência e logística** na tomada de decisão;
- Coordenar automaticamente a **disponibilidade hospitalar** e de **transportes**;
- Implementar **mecanismos de contingência** para falhas logísticas ou indisponibilidade;
- Maximizar o número de transplantes bem-sucedidos.

---

## Arquitetura do Sistema

O sistema foi desenvolvido com recurso à plataforma **SPADE**, utilizando comunicação baseada no protocolo **FIPA-ACL**.

### Tipos de Agentes
- **DonorAgent** – Notifica a disponibilidade de órgãos para doação;
- **RecipientAgent** – Solicita órgãos e gere a receção de informação;
- **HospitalAgent** – Gere a disponibilidade hospitalar para transplantes;
- **TransportAgent** – Gere o transporte de órgãos (e pacientes, em casos críticos);
- **TransplantAgent** – Agente central responsável pela coordenação e tomada de decisões.

---

## 🧩 Estrutura do Sistema

### Classes Principais
- `Coords` – Representação de coordenadas geográficas;
- `Hospital` – Informação e localização hospitalar;
- `OrganData` – Dados associados a um órgão disponível;
- `RecipientData` – Dados do recetor e nível de urgência;
- `TransportRequest` – Pedido de transporte;
- `Transporte` – Estado e localização de meios de transporte;
- `TransplantInfo` – Associação entre dador e recetor.

---

## Behaviours Implementados

Alguns dos comportamentos principais incluem:

- **HospitalAvailable** – Verifica a disponibilidade hospitalar;
- **Donation** – Regista a doação de um órgão;
- **RequestOrgan** – Pedido de órgão por um recetor;
- **ReceiveInfo** – Gestão central de mensagens e alocações;
- **TransportOrgan** – Simulação do transporte do órgão;
- **ResendOrgan** – Medida de contingência para órgãos não alocados;
- **MonitoringWaitlist** – Gestão de listas de espera por falta de transporte;
- **PatientReceives** – Receção de notificações pelo recetor.



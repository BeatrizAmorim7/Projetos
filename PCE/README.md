# Aplicação de Monitorização e Gestão da Dor

**Mestrado em Engenharia Biomédica | Informática Médica** **Universidade do Minho** - 2024/2025

Este projeto consiste numa aplicação _web/mobile_ desenvolvida para permitir o registo estruturado, monitorização e acompanhamento de episódios de dor (aguda e crónica). A solução foca-se na interoperabilidade semântica, utilizando modelação **OpenEHR** e normas **FHIR**.

## Funcionalidades Principais

* **Registo e Autenticação:**
* _Onboarding_ com recolha de dados clínicos e demográficos.
* _Login_ simplificado com o número de utente.


* **Gestão da Dor e Medicação:**
* Formulários clínicos estruturados baseados em templates _OpenEHR_.
* Registo de localização, intensidade, fatores precipitantes e de alívio.
* _Upload_ de conteúdos multimédia (ex: fotos de lesões).


* **Dashboard e Visualização:**
* **Calendário Interativo:** Visualização temporal dos episódios.
* **Mapa Corporal (Body Map):** Destaque visual da última zona de dor registada.
* **Gráficos:** Análise de sintomas frequentes e evolução do estado emocional.


* **Monitorização de Saúde Mental (PHQ-6):**
* Adaptação do questionário PHQ-9 para monitorizar impacto emocional.
* Recomendações personalizadas (sistema de cores) baseadas no _score_ de depressão.


* **Sugestões Inteligentes:**
* Dicas personalizadas baseadas nos fatores de alívio e agravamento mais frequentes.


* **Notificações e Alertas:**
* Lembretes semanais personalizáveis para garantir a continuidade dos registos.


* **Interoperabilidade:**
* Exportação de dados clínicos (paciente, dor, medicação) para formato **FHIR** através do **Mirth Connect**.



## Arquitetura

A aplicação segue uma arquitetura de três camadas:

* **Frontend:**
* [React.js](https://reactjs.org/)
* `protected-aidaforms` (Renderização de templates OpenEHR)
* `react-calendar` & `recharts` (Visualização de dados)


* **Backend:**
* [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
* API RESTful


* **Base de Dados:**
* [PostgreSQL](https://www.postgresql.org/)


* **Integração:**
* Axios para comunicação HTTP
* Mirth Connect (Intermediário FHIR)



## Modelação Clínica (OpenEHR)

A estrutura dos dados foi desenhada utilizando o **Archetype Designer**, garantindo consistência semântica. Foram utilizados/adaptados vários arquétipos:

1. **Pessoa:** `openEHR-EHR-CLUSTER.person_name`, `address`, `telecom_details`.
2. **Dor (Self Reported Data):**
* `openEHR-EHR-CLUSTER.symptom_sign` (Sintomas, Localização, Ocorrência).
* `openEHR-EHR-OBSERVATION.abbey_pain_scale` (Escala de dor).
* `openEHR-EHR-OBSERVATION.phq_9` (Saúde mental - adaptado).
* `openEHR-EHR-CLUSTER.media_file` (Evidências multimédia).


3. **Medicação:**
* `openEHR-EHR-COMPOSITION.medication_list`.
* `openEHR-EHR-OBSERVATION.medication_use_statement`.



## Interoperabilidade FHIR

O sistema converte os dados relacionais para recursos FHIR JSON, organizados em **Bundles**:

* **Bundle Pessoal:** Recursos `Patient`, `Address`, `Contact`.
* **Bundle Dor:** Recursos `Condition`, `Observation` (Sintomas, PHQ-9), `DocumentReference`.
* **Recurso Medicação:** `MedicationStatement`.

## Como Executar

### Pré-requisitos

* Node.js (v14+)
* PostgreSQL
* Mirth Connect (Opcional, para testar exportação FHIR)

### Instalação

1. **Clonar o repositório:**
```bash
git clone https://github.com/exemplo/pain-monitor-app.git
cd pain-monitor-app

```


2. **Configurar a Base de Dados:**
* Crie uma base de dados no PostgreSQL.
* Execute os scripts SQL disponíveis na pasta `/database` para criar as tabelas (`personal_info`, `composition`, `body_sites`, etc.).


3. **Backend:**
```bash
cd backend
npm install
# Configurar variáveis de ambiente (.env) com credenciais da BD e porta
npm start

```


4. **Frontend:**
```bash
cd frontend
npm install
npm start

```

A aplicação deverá estar acessível em `http://localhost:3000`.

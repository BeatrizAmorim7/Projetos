# Aplicação de Monitorização e Gestão da Dor

**Mestrado em Engenharia Biomédica | Informática Médica**
**Universidade do Minho — Ano letivo 2024/2025**

Esta aplicação _web/mobile_ foi desenvolvida com o objetivo de permitir o registo estruturado, a monitorização contínua e o acompanhamento clínico de episódios de dor aguda e crónica.
A solução distingue-se pela aposta na interoperabilidade semântica, recorrendo à modelação clínica _OpenEHR_ e às normas FHIR, promovendo a partilha segura e normalizada de dados de saúde.

## Funcionalidades Principais

### Registo e Autenticação

* Processo de _onboarding_ com recolha de dados clínicos e demográficos.
* Autenticação simplificada através do número de utente.

### Gestão da Dor e Medicação

* Formulários clínicos estruturados baseados em templates OpenEHR.
* Registo de localização, intensidade da dor, fatores de agravamento e de alívio.
* _Upload_ de conteúdos multimédia, como imagens de lesões por exemplo.

### Dashboard e Visualização

* Calendário interativo para visualização temporal dos episódios de dor.
* Mapa corporal (_Body Map_) com destaque visual da última zona de dor registada.
* Gráficos para análise de sintomas frequentes e evolução do estado emocional.

### Monitorização da Saúde Mental (PHQ-6)

* Adaptação do questionário PHQ-9 para avaliação do impacto emocional.
* Sistema de recomendações personalizadas baseado num código de cores, de acordo com o _score_ de depressão.

### Sugestões Inteligentes

* Recomendações personalizadas com base nos fatores de alívio e agravamento mais frequentes.

### Notificações e Alertas

* Lembretes semanais personalizáveis para incentivar a continuidade dos registos.

### Interoperabilidade

* Exportação de dados clínicos (paciente, dor e medicação) em formato FHIR.
* Integração com o _Mirth Connect _como intermediário de interoperabilidade.



## Arquitetura da Aplicação

A aplicação segue uma arquitetura de três camadas:

### Frontend

* _React.js_
* _protected-aidaforms_ (renderização de _templates_ _OpenEHR_)
* _react-calendar_ e _recharts_ (visualização de dados)

### Backend

* _Node.js_ e _Express_
*_API RESTful_

### Base de Dados

* _PostgreSQL_

### Integração

* Axios para comunicação HTTP
*_Mirth Connect_ para conversão e envio de recursos FHIR


## Modelação Clínica (OpenEHR)

A estrutura dos dados foi concebida com recurso ao _Archetype Designer_, garantindo consistência semântica e conformidade com standards clínicos internacionais. Foram utilizados e adaptados vários arquetipos.


## Interoperabilidade FHIR

Os dados armazenados na base relacional são convertidos para recursos FHIR em formato JSON, organizados em _Bundles_:

* _Bundle_ Pessoal: _Patient, Address, Contact_
* _Bundle_ Dor: _Condition_, _Observation_ (sintomas, PHQ-9), _DocumentReference_
* Medicação: _MedicationStatement_



## Como Executar o Projeto

### Pré-requisitos

* _Node.js_ (v14 ou superior)
* _PostgreSQL_
* _Mirth Connect_ (opcional, para testes de exportação FHIR)

### Instalação

1. Clonar o repositório

```bash
git clone https://github.com/exemplo/pain-monitor-app.git
cd pain-monitor-app
```

2. Configurar a Base de Dados

* Criar uma base de dados _PostgreSQL_.
* Executar os scripts SQL disponíveis para criar as tabelas (_personal_info, composition, body_sites_, entre outras).

3. Backend

```bash
cd backend
npm install
# Configurar o ficheiro .env com as credenciais da base de dados e a porta
npm start
```

4. Frontend

```bash
cd frontend
npm install
npm start
```

A aplicação ficará disponível em `http://localhost:3000`.

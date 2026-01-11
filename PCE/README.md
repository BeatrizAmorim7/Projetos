# Aplicação de Monitorização e Gestão da Dor

**Unidade Curricular:** Análise e Extração de Conhecimento (AEC)

**Mestrado em Engenharia Biomédica | Informática Médica**

**Universidade do Minho** (2024/2025)

# Sobre o projeto

Este projeto consiste numa aplicação _web/mobile_ desenvolvida com o objetivo de permitir o registo estruturado, a monitorização contínua e o acompanhamento clínico de episódios de dor aguda e crónica dos utilizadores. A solução distingue-se pela aposta na interoperabilidade semântica, que é conseguida através da modelação clínica _OpenEHR_ e das normas FHIR, promovendo a partilha segura e normalizada dos dados de saúde.


## Funcionalidades principais

### Registo e autenticação

* Processo de *onboarding* com recolha de dados clínicos do utilizador.
* Autenticação simplificada através do número de utente.

### Gestão da dor e medicação

* Formulários clínicos estruturados baseados em *templates OpenEHR*.
* Registo de localização, intensidade da dor, fatores de agravamento e de alívio.
* *Upload* de conteúdos multimédia, como imagens de lesões.

### Dashboard e visualização

* Calendário interativo para visualização temporal dos episódios de dor.
* Mapa corporal (*Body Map*) com destaque visual da última zona de dor registada.
* Gráficos para análise de sintomas frequentes e evolução do estado emocional.

### Monitorização da saúde mental (PHQ-6)

* Adaptação do questionário *PHQ-9* para avaliação do impacto emocional.
* Sistema de recomendações personalizadas baseado num código de cores, de acordo com o *score* de depressão.

### Sugestões inteligentes

* Recomendações personalizadas com base nos fatores de alívio e agravamento mais frequentes.

### Notificações e alertas

* Lembretes semanais personalizáveis para incentivar a continuidade dos registos.

### Interoperabilidade

* Exportação de dados clínicos (paciente, dor e medicação) em formato *FHIR*.
* Integração com o *Mirth Connect* como intermediário de interoperabilidade.

## Arquitetura da aplicação

### Frontend

* *React.js*
* *protected-aidaforms* (renderização de *templates OpenEHR*)
* *react-calendar* e *recharts* (visualização de dados)

### Backend

* *Node.js* e *Express*
* *API RESTful*

### Base de dados

* *PostgreSQL*

### Integração

* *Axios* para comunicação HTTP
* *Mirth Connect* para conversão e envio de recursos *FHIR*

## Modelação clínica (OpenEHR)

A estrutura dos dados foi criada com recurso ao *Archetype Designer*, de modo a garantir consistência semântica e conformidade com _standards_ clínicos internacionais. Foram utilizados e adaptados vários arquétipos.

## Interoperabilidade FHIR

Os dados armazenados na base relacional são convertidos para recursos *FHIR* em formato *JSON*, organizados em *Bundles*:

* *Bundle* Pessoal: *Patient*, *Address*, *Contact*
* *Bundle* Dor: *Condition*, *Observation* (sintomas, *PHQ-9*), *DocumentReference*
* Medicação: *MedicationStatement*


## Como executar o projeto

### Pré-requisitos

* *Node.js* (v14 ou superior)
* *PostgreSQL*
* *Mirth Connect* (opcional, para testes de exportação FHIR)

### Instalação

1. **Clonar o repositório**

```bash
git clone https://github.com/exemplo/pain-monitor-app.git
cd pain-monitor-app
```

2. **Configurar a base de dados**

* Criar uma base de dados *PostgreSQL*.
* Executar os scripts SQL disponíveis para criar as tabelas (*personal_info*, *composition*, *body_sites*, entre outras).

3. **Backend**

```bash
cd backend
npm install
# Configurar o ficheiro .env com as credenciais da base de dados e a porta
npm start
```

4. **Frontend**

```bash
cd frontend
npm install
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

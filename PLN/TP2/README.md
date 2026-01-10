# Plataforma de Enriquecimento e Visualização de Terminologia Médica
Projeto desenvolvido no âmbito da UC de **Processamento de Linguagem Natural em Engenharia Biomédica** (Universidade do Minho, 2024/2025).

## Objetivo
Este projeto tinha como objetivo expandir o _dataset_ criado no TP1 através do **enriquecimento semântico** com fontes externas, cálculo de **similaridade semântica** (BERT) e desenvolvimento de uma **aplicação _Web_ (_Flask_)** para consulta, edição e gestão de termos médicos.

## Funcionalidades Principais

### 1. Enriquecimento de Dados (_Web Scraping_)
Foram desenvolvidos _scrapers_ para extrair definições e novos termos de três fontes fidedignas:
* **JornalismoPortoNet (JPN):** Extração de HTML estático.
* **Hospital da Luz:** Utilização de uma API interna e _parsing_ de JSON/HTML dinâmico.
* **Centro Hospitalar Lisboa Ocidental (CHLO):** Navegação por paginação em tabelas HTML.

### 2. Processamento
* **Modelo:** Utilização do `bert-base-portuguese-cased`.
* **Similaridade:** Cálculo de _embeddings_ e similaridade do cosseno para sugerir os 5 termos mais relacionados semanticamente a cada entrada.
* **Categorização Automática:** Classificação de termos em categorias (e.g., "Diagnóstico", "Farmacologia") comparando _embeddings_ dos termos com vetores médios de categorias.

### 3. Aplicação _Web_ (_Flask_)
Interface interativa que permite:
* **Navegação:** Por índice alfabético ou por categorias temáticas.
* **Pesquisa Avançada:** Suporte a *Keywords* e _Regex_.
* **CRUD:** Adicionar, ler, editar e remover termos.
* **Redirecionamento:** Gestão inteligente de termos em outras línguas (ex: Catalão) para o termo principal em Português.

## Estrutura de Dados
O _dataset_ final foi normalizado para corrigir inconsistências do TP1:
* **Chave Primária:** Termos em português (pt_PT/pt_BR).
* **Campos Normalizados:** Fusão de `Sinónimos`/`Remissivas` e limpeza de redundâncias.

## Tecnologias utilizadas
* _**Backend:** Python 3, Flask, Jinja2_
* _**Frontend:** HTML5, Bootstrap, JavaScript_
* _Transformers (Hugging Face), BeautifulSoup4, Requests_

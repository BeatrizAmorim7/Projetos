# Extração de Terminologia Médica (PLN)

Projeto desenvolvido na UC de **Processamento de Linguagem Natural em Engenharia Biomédica** (Universidade do Minho, 2024/2025).

## 🎯 Objetivo
[cite_start]Extrair, estruturar e normalizar terminologia médica a partir de documentos PDF não estruturados, gerando um `corpus` unificado em formato **JSON** para reutilização em sistemas de saúde[cite: 17, 19].

## 📂 Corpus Processado
1.  [cite_start]**Dicionário Multilingue da COVID-19:** 10 línguas, anotações morfológicas e definições[cite: 24].
2.  [cite_start]**Glossário de Neologismos da Saúde Humana:** Contexto, citações e traduções (EN/ES)[cite: 28].
3.  [cite_start]**Glossário de Termos Médicos Técnicos e Populares:** Mapeamento técnico ↔ popular[cite: 30].
4.  [cite_start]**Glossário Temático (Monitoramento e Avaliação):** Gestão de saúde pública e remissivas[cite: 31].

## ⚙️ Pipeline
1.  [cite_start]**Conversão:** Utilização de `pdftohtml` e `pdftotext` para converter PDFs em XML/TXT.
2.  [cite_start]**Limpeza:** Remoção de cabeçalhos, rodapés e correção de formatação de colunas[cite: 78, 186].
3.  [cite_start]**Extração:** Parsing baseado em **Expressões Regulares (Regex)** para identificar conceitos, categorias e traduções[cite: 19, 84].
4.  [cite_start]**Fusão:** Algoritmo de merge para consolidar entradas duplicadas num JSON final único[cite: 290, 291].

## 👥 Autores
* Beatriz Amorim (PG56112)
* Carolina Santos (PG56116)
* Catarina Nunes (PG56117)

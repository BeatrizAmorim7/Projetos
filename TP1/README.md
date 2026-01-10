# Extração de Terminologia Médica (PLN)

Projeto desenvolvido na UC de **Processamento de Linguagem Natural em Engenharia Biomédica** (Universidade do Minho, 2024/2025).

## 🎯 Objetivo
Extrair, estruturar e normalizar terminologia médica a partir de documentos PDF não estruturados. O objetivo final foi obter uma estrutura unificada em formato **JSON** para a sua reutilização em sistemas de saúde.

## 📂 Fontes Processadas
1.  **Dicionário Multilingue da COVID-19:** 10 línguas, anotações morfológicas e definições.
2.  **Glossário de Neologismos da Saúde Humana:** Contexto, citações e traduções (EN/ES).
3.  **Glossário de Termos Médicos Técnicos e Populares:** Conceitos técnicos ↔ populares.
4.  **Glossário Temático (Monitorização e Avaliação):** Gestão de saúde pública e remissivas.

## ⚙️ Pipeline
1.  **Conversão:** Utilização de `pdftohtml` e `pdftotext` para converter PDFs em XML/TXT.
2.  **Limpeza:** Remoção de cabeçalhos, rodapés e correção de formatação de colunas.
3.  **Extração:** Parsing baseado em **Expressões Regulares (Regex)** para identificar conceitos, categorias e traduções.
4.  **Fusão:** Algoritmo de merge para consolidar entradas duplicadas num JSON final único.

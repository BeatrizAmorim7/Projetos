# Previsão de Doença Renal Crónica (CKD) com Data Mining

**Unidade Curricular:** Análise e Extração de Conhecimento (AEC)

**Mestrado em Engenharia Biomédica | Informática Médica**

**Universidade do Minho** (2024/2025)

## Sobre o Projeto

A Doença Renal Crónica (CKD) é uma condição progressiva cuja deteção precoce é crucial para evitar falência renal. Este projeto aplica técnicas de **Data Mining** para identificar padrões clínicos e prever o diagnóstico da doença, seguindo a metodologia **CRISP-DM** (_Cross-Industry Standard Process for Data Mining)_.
O objetivo principal é auxiliar a decisão clínica, minimizando falsos negativos e permitindo intervenções mais atempadas.

## Ferramentas Utilizadas

1. **Altair AI Studio (RapidMiner):** Utilizado para a componente de *Visual Data Science*, nomeadamente para análise estatística avançada, cálculo de matrizes de correlação visual e extração de regras de associação (FP-Growth).

2. **Python (Jupyter Notebook):** Utilizado para a implementação do _pipeline_ de _Machine Learning_, desde o pré-processamento até à avaliação dos modelos, permitindo maior flexibilidade na manipulação dos dados.

## Estrutura do Repositório

* **`relatorio_AEC.pdf`**: Relatório científico completo com a análise exploratória, discussão clínica dos atributos e comparação detalhada de resultados.
* **`trabalho.ipynb`**: _Notebook_ com a implementação da _pipeline_ em Python.
* **`ckd_uci.csv`**: _Dataset_ 


## Metodologia e Pipeline

O processamento dos dados seguiu etapas rigorosas para garantir a robustez dos modelos:

### 1. Compreensão e Preparação dos Dados

* **Limpeza:** Tratamento de valores em falta através da substituição pela média/moda e remoção de atributos com >30% de *missing values*.

* **Feature Selection:** Identificação de atributos críticos (ex: Hemoglobina, Glóbulos Vermelhos) e remoção de redundâncias.

* **Balanceamento:** O dataset original apresentava desequilíbrio (62.5% CKD vs 37.5% Não-CKD). Foi aplicada a técnica **SMOTE** para gerar amostras sintéticas da classe minoritária.

* **Normalização:** Aplicação de *Min-Max Scaling* e *Standardization* para modelos sensíveis à escala.


### 2. Modelação

Foram desenvolvidos e avaliados 5 algoritmos de classificação supervisionada:

* Random Forest Classifier
* Support Vector Machine (SVM)
* Logistic Regression
* Decision Tree
* K-Nearest Neighbors (KNN)

Adicionalmente, foi testada uma abordagem não supervisionada com **K-Means Clustering**.

## Resultados Principais

O modelo **Random Forest** demonstrou ser o mais eficaz e robusto, especialmente quando combinado com técnicas de balanceamento de dados.

**Insights Clínicos:**
A análise permitiu confirmar fortes correlações entre a CKD e comorbilidades como a hipertensão e diabetes, bem como a importância vital dos níveis de hemoglobina como biomarcador.

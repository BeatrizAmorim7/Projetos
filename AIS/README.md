# 🤰 Assistente Virtual de Aconselhamento Pré-Natal (IA)

**Unidade Curricular:** Ambientes Inteligentes para a Saúde (AIS)

**Mestrado em Engenharia Biomédica | Informática Médica**

**Universidade do Minho** - 2024/2025

Este repositório contém a documentação e análise do desenvolvimento de um **assistente virtual baseado em LLMs (Large Language Models)**, desenhado para prestar esclarecimentos e apoio durante a gravidez. O projeto utiliza a framework **Ollama** para comparar o desempenho de diferentes modelos na resposta a questões sobre desenvolvimento fetal, nutrição e cuidados pré-natais.

## 📄 Sobre o Projeto

A gravidez é uma fase marcada por dúvidas e ansiedade. O objetivo deste trabalho foi criar um assistente capaz de fornecer informações rápidas, acessíveis e fundamentadas, complementando (sem substituir) o acompanhamento médico tradicional.

O foco principal foi o **Fine-Tuning de parâmetros** (via Modelfile) e a **Engenharia de Prompt** para garantir que o assistente fosse não só preciso clinicamente, mas também empático e seguro.

## 🎯 Objetivos

* **Desenvolver** um assistente virtual focado no contexto clínico pré-natal.
* **Comparar** o comportamento de diferentes LLMs (pequena e média escala).
* **Otimizar** as respostas ajustando parâmetros como `temperature`, `top_k` e `seed`.
* **Avaliar** a precisão clínica, clareza e empatia das respostas geradas.

## 🛠️ Tecnologias Utilizadas

* **Framework:** [Ollama](https://ollama.com/) (Execução local de LLMs).
* **Interface:** [Open WebUI](https://docs.openwebui.com/) (Interação gráfica com os modelos).
* **Engenharia de Prompt:** Definição de *System Prompts* específicos para criar uma persona "empática e baseada em evidências".

## 🤖 Modelos Avaliados

Foram testados quatro modelos distintos, escolhidos pelo equilíbrio entre desempenho e eficiência computacional:

1. **Phi3 (3.8B):** Modelo leve, focado em eficiência.
2. **LLaMA 3.2 (3B):** Modelo da Meta otimizado para instruções.
3. **Gemma-3 (4B):** Modelo aberto da Google.
4. **Mistral (7B):** Modelo conhecido pela fluidez comunicativa.

> 
> **Nota:** Modelos maiores (como LLaMA 3.1 8B) foram excluídos devido a limitações de recursos computacionais.
> 
> 

## ⚙️ Configuração e Parâmetros

A personalização foi feita através do **Modelfile** do Ollama, ajustando as seguintes variáveis para controlar a criatividade e consistência:

* **Temperature:** Variou entre 0.3 e 0.5 (Controlo de aleatoriedade).
* **Top_k:** Variou entre 30 e 45 (Seleção de tokens prováveis).
* **Seed:** Fixada em 35 para reprodutibilidade.
* **System Prompt:** Instruções estritas para manter um tom empático, evitar diagnósticos médicos e não usar adjetivos subjetivos exagerados (ex: "wonderful", "amazing").

## 📊 Resultados e Conclusões

Os modelos foram submetidos a um conjunto de 8 perguntas-chave e 3 cenários clínicos complexos.

| Modelo | Avaliação Geral |
| --- | --- |
| **Phi3** | **Fraco.** Apresentou várias imprecisões técnicas (alucinações sobre marcos gestacionais). |
| **LLaMA** | **Médio.** Boa estrutura, mas propenso a erros graves com temperaturas mais altas (ex: sugeriu alimentos inseguros). |
| **Mistral** | **Bom.** Excelente capacidade comunicativa e educativa, mas por vezes superficial tecnicamente. |
| **Gemma** | **Excelente (Vencedor).** Foi o modelo mais equilibrado. Combinou rigor técnico, clareza e o nível certo de empatia ("Your little one"). |

**Conclusão Principal:**
O modelo **Gemma** destacou-se como a melhor opção para este domínio. Contudo, o trabalho evidenciou que LLMs genéricos, sem acesso a bases de conhecimento externas (RAG), têm limitações em casos clínicos complexos e necessitam de supervisão humana.

## 🔮 Trabalho Futuro

* Implementação de **RAG (Retrieval-Augmented Generation)** para ligar o modelo a guidelines clínicas oficiais e atualizadas.
* Validação clínica rigorosa das respostas.
* Integração em plataformas móveis.

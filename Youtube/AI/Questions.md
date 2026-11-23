# 1] I Faced 20+ MNC AI Interviews — Here Are 100+ Questions They Asked (Part 1)

Source: https://www.youtube.com/watch?v=QqagUPASVQc

## Scenario Questions

- You need to send ₹5,000 to Ravi for rent. It works 99% of the time and fails 1% of the time. Daily volume is 10 crore transactions, with 10 lakh wrong or double transfers and cases like reading "Ravi" as "Ravi K". How do you solve this using **probabilistic and deterministic methods**?
- Token costs balloon as usage grows. **How do you keep agent costs under control?**

## LLM Fundamentals

1. How do **Transformers** work in LLMs? Take a sentence and explain it end to end.
2. How does the **attention mechanism** work in LLMs?
3. What are **embeddings** and the **embedding matrix**?
4. What do the numbers **1536 or 3072** mean in embeddings?
5. What are **Top-K, Top-P and Temperature** in LLMs?
6. What is **Softmax** in LLMs?
7. What is an **AI agent**, actually? How do you define an agent?
8. What is **cosine similarity** all about?
9. What is **context**, and what is the **context window**?
10. What is a **jailbreak**?
11. What is **zero-shot prompting** and **few-shot prompting**?

## Python

12. What are **immutable** and **mutable** types in Python?
13. What is a **closure** in Python?

## RAG, Prompting & Fine-tuning

14. What is **RAG**, and how do you stop it from **hallucinating**?
15. Explain the difference between **fine-tuning, RAG and prompting**.
16. What is **system prompt caching**? How does it work, and how does it help enterprises?
17. What is **prompt injection**?
18. How do you manage **prompt versioning**?
19. What are **guardrails**, and how do they help in agent architecture?
20. What is **context engineering**?

## AI Agents in Production

21. What are some **bottlenecks of AI agents**? How do you manage a **multi-agent architecture**?
22. If you have **100 tools**, what techniques do you apply so the tools don't hallucinate?
23. How do you prevent prompt injection with **XML tags and delimiters**?
24. What is the **role of Pydantic**?
25. **How often do tools fail in production? How do you figure out which tool fails?**
26. How do you handle **RBAC and tool-calling security**?
27. Tell me about **prompt evaluation and optimization**. How do you optimize a prompt?

## Advanced RAG

28. Which **chunking strategy** is the best?
29. What are **Graph RAG, Agentic RAG, Adaptive RAG and Corrective RAG**?
30. What are **citation, grounding and abstaining** in RAG?
31. How do you **evaluate RAG**, and what are the **metrics**?
32. How do you **secure RAG**?

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------

# 2] AI Engineer at Deloitte USI | Interview Process and Preparation

Source: https://www.youtube.com/watch?v=B1PUBlhd9Yg

## Round 1 – Resume & Projects

1. What challenges did you face while building the POC, and while converting the POC into a production-level project?
2. What issues came up when moving to production?
3. How does each technology on your resume work? (e.g. LangGraph: what are nodes and edges?)

## Round 2 – Technical

4. Everyone knows machine learning, but **how does it actually work**?
5. What is **backpropagation**? What is **forward propagation**?
6. How does the **change of derivatives** work in backpropagation?
7. What are **neurons**?
8. Why did you choose **U-Net++ instead of YOLO**?
9. What is the difference between **Decision Trees, Random Forest and XGBoost**?
10. What is the difference between **MCP, LangGraph and LangChain**? Which is better?
11. How can **LangGraph and MCP be used together**?
12. What is the difference between **Generative AI and Agentic AI**?
13. Why do we use **RAG** if we can just upload a document to an LLM (ChatGPT / Gemini) and ask questions? Why is RAG considered better?
14. What do you mean by **Top-N** and **Top-K**?
15. What is **similarity search**? What is **cosine similarity**?
16. How do you **test a RAG** system? What **metrics or scores** do you use to check the accuracy of RAG-based answers?
17. What are **BLEU** and **ROUGE** scores?
18. What are **Recall** and **Precision**?
19. In which scenario will you use **Recall**?
20. *(Scenario)* Which model would you use, and how would you implement the agent? What is **orchestration of agents**?

## Situation-Based

21. We already have APIs, so **why was MCP introduced**? What are the reasons?
22. A company has deterministic, highly secured documents, and employees use an enterprise-level LLM by uploading those documents to get answers. What are your views, and how can employees get answers from the enterprise LLM **without uploading the highly secured documents**?
23. Why was RAG introduced when we already have the option to attach our documents to an LLM?

## Coding (Python)

24. You have three lists with different numbers. How do you get the **union** of them?
25. You have **two hash maps**. Merge **only the distinct keys** into one hash map.
26. Given a list, **flatten it** so that it is consumable by an ML model.
27. **Leaders in an array** (LeetCode).

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------

# 3] AI Engineer Interview Questions | Top Questions and Answers to Crack AI Job Interviews (Simplilearn)

Source: https://www.youtube.com/watch?v=jHrM0uUMxdg

## Scenario (Intro)

- A chatbot is giving customers wrong information. Tell us how you would fix it.

## Beginner Level

1. What does an **AI engineer** actually deliver?
2. How do the roles of **AI, Machine Learning and Data Science** differ?
3. How do you choose a **learning approach** (supervised, unsupervised, reinforcement)?
4. How do you prepare data **without causing data leakage**?
5. Why do we use **training, validation and test** datasets?
6. How do you detect and reduce **overfitting**?
7. Why are **Precision, Recall and F1** important?
8. How do you deal with **imbalanced classification** tasks?
9. How do **backpropagation and gradient descent** work together?
10. How do you choose the **first model** for a new problem?

## Intermediate Level

11. How do **tokens, attention and context** affect a Large Language Model?
12. How do **embeddings** enable **semantic search**?
13. How would you build a **RAG system on top of company documents**?
14. How do you improve **poor retrieval** in a RAG system?
15. How do **LoRA and QLoRA** reduce fine-tuning costs?
16. How do you make **prompts and outputs reliable**?
17. When should you use a **workflow instead of an agent**?
18. How do you implement **tool calls safely**?
19. How do you **evaluate an LLM application before release**?
20. How do you **deploy a model as a reliable API**?

## Advanced Level

21. How would you **design an AI system for customer support**?
22. The API returns **HTTP 200, but the AI's answer is wrong**. How do you fix that?
23. How do you **reduce the latency and cost** of LLMs?
24. How do you choose between **hosted and self-hosted** models?
25. Explain **in-context learning**. How do LLMs adapt without fine-tuning?
26. How do you detect and respond to **model drift**?
27. How do you defend against **prompt injection**?
28. How do you assess **fairness** and **explain** a model's decisions?
29. How do you make AI releases **reproducible and reversible**?

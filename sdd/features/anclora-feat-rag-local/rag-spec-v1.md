# ANCLORA-FEAT-RAG-LOCAL: Motor de Embeddings Zero-Cost e Inferencia LLM

## Descripción General
Para garantizar privacidad y control de costes, esta feature implementa el procesamiento de embeddings directamente en el entorno del servidor (Node.js) usando la librería Transformers.js de HuggingFace. Evitamos el uso de APIs externas de embeddings como OpenAI para la capa fundacional de RAG (Retrieve-Augmented Generation).

## Requisitos
1. **Generación Local:** Emplear `@huggingface/transformers` con el pipeline `feature-extraction`.
2. **Modelo Eficiente:** Utilizar `Xenova/all-MiniLM-L6-v2` como predeterminado (pequeño y rápido).
3. **Agrupación de Clientes LLM:** Proveer una capa de abstracción para conectar opcionalmente con Groq, Ollama (Local) y Anthropic (solo master copy).
4. **Metodología SDD:** Tests y documentación asegurados.

## Reglas de Arquitectura
- El pipeline de Transformers.js debe configurarse como un Singleton usando patrón de Factory instanciado una sola vez en memoria, ya que la carga del modelo es costosa y asíncrona.
- Omitir librerías de dependencias locales C++ (ONNX Runtime natively) en dev si dan problemas y usar el fallback WASM si fuera necesario, priorizando la ejecución de JS puro de Transformers.js v3+.

## Criterio de Aceptación
- [ ] Implementado singleton de embeddings en `src/lib/rag/embeddings.ts`.
- [ ] Implementada base de clientes AI en `src/lib/rag/pipeline.ts`.
- [ ] `npm run build` tiene éxito sin colgarse en tiempo de importación de Transformers.js.
- [ ] Commits aislados `feat: [ANCLORA-FEAT-RAG-LOCAL]`.

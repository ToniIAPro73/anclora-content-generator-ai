# Regla de Feature: Scalable RAG Adapters

- La abstracción debe reducir acoplamiento, no introducir complejidad innecesaria
- `pgvector` sigue siendo la fuente de verdad operativa del retrieval
- Las integraciones futuras deben entrar por adaptadores, no por cambios transversales

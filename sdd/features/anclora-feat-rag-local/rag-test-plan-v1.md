# TEST PLAN: ANCLORA-FEAT-RAG-LOCAL

## Entorno Local
1. Proveer al entorno con `NX_DAEMON=false` o variables necesarias si Transformers intenta descargar modelos de HuggingFace Hub.
2. Ejecutar script de test de embeddings (o en un Server Action via UI) y verificar que los embeddings devuelven un array de `384` dimensiones flotantes (para `all-MiniLM-L6-v2`).

## Verificación de Código Estático
1. `npm run lint` ejecuta sin violar normas (como el uso correcto de patrones Singleton o warnings sobre tipos `any`).
2. `npm run build` debe transpirar correctamente a Vercel/Node o en Docker.

## Criterios de Calidad
1. La primera llamada de red (carga de modelo) será lenta, la segunda debe ser inmediata (Caché en memoria).
2. Se debe controlar las fallas de red de inicialización.

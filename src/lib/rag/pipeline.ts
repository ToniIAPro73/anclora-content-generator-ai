import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'

// 1. Cliente Groq (compatible con OpenAI SDK)
export const groqClient = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY || 'dummy_groq_key',
})

// 2. Cliente Ollama Local (compatible con OpenAI SDK nativamente o con endpoint local)
export const ollamaClient = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
  apiKey: 'ollama', // Ollama no requiere key real
})

// 3. Cliente Anthropic (Master Copy)
export const anthropicClient = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_anthropic_key',
})

/**
 * Retorna el modelo de inferencia adecuado según el nivel de complejidad requerido.
 * @param speed Nivel de inferencia deseado
 */
export function getModel(speed: 'fast-local' | 'fast-cloud' | 'reasoning' = 'fast-cloud') {
  switch (speed) {
    case 'fast-local':
      // Ideal para formateo de metadatos o chunks ligeros (Zero Cost)
      return ollamaClient('llama3') 
    case 'reasoning':
      // Ideal para la redacción final del artículo comercial (Claude 3.5 Sonnet)
      return anthropicClient('claude-3-5-sonnet-20240620')
    case 'fast-cloud':
    default:
      // Ideal para ingestas pesadas, extraer entidades de Idealista, etc. (High rate limit, low latency)
      return groqClient('llama3-70b-8192')
  }
}

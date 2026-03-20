/**
 * ANCLORA CONTENT GENERATOR AI - Generate Content API (Neon)
 * Feature: ANCLORA-FEAT-API-ROUTES
 * Endpoint: POST /api/content/generate-neon
 * Description: Genera contenido usando RAG + LLM con Neon DB
 * Author: Anclorabot
 * Date: 2026-03-19
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/neon'
import { contentTemplates, generatedContent, microZones } from '@/lib/db/schema'
import { generateContentWithRAG } from '@/lib/rag/pipeline'
import { eq, and } from 'drizzle-orm'
import type { ContentType } from '@/lib/db/types'
import { getAuthenticatedWorkspace, isUuid, WorkspaceAuthError } from '@/lib/auth/workspace'

export const runtime = 'nodejs'

interface GenerateRequest {
  templateId?: string
  contentType: ContentType
  title: string
  userPrompt: string
  ragQuery?: string
  microZoneId?: string
  modelConfig?: {
    temperature?: number
    maxTokens?: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()

    // Parsear request body
    const body: GenerateRequest = await request.json()

    if (!body.contentType || !body.title || !body.userPrompt) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: contentType, title, userPrompt' },
        { status: 400 }
      )
    }

    // Obtener template (si se especificó)
    let systemPrompt = ''
    let templateConfig: { temperature?: number; max_tokens?: number } = {}

    if (body.templateId && isUuid(body.templateId)) {
      const template = await db.query.contentTemplates.findFirst({
        where: and(
          eq(contentTemplates.id, body.templateId),
          eq(contentTemplates.workspaceId, workspaceId)
        ),
        columns: {
          systemPrompt: true,
          config: true
        }
      })

      if (!template) {
        return NextResponse.json(
          { error: 'Template no encontrado' },
          { status: 404 }
        )
      }

      systemPrompt = template.systemPrompt
      templateConfig = template.config as { temperature?: number; max_tokens?: number }
    } else {
      // System prompt por defecto
      systemPrompt = getDefaultSystemPrompt(body.contentType)
    }

    // Obtener contexto de micro-zona (si se especificó)
    let microZoneContext = ''

    if (body.microZoneId && isUuid(body.microZoneId)) {
      const microZone = await db.query.microZones.findFirst({
        where: and(
          eq(microZones.id, body.microZoneId),
          eq(microZones.workspaceId, workspaceId)
        ),
        columns: {
          name: true,
          municipality: true,
          marketData: true
        }
      })

      if (microZone) {
        microZoneContext = `\nMicro-zona: ${microZone.name} (${microZone.municipality})\nDatos de mercado: ${JSON.stringify(microZone.marketData, null, 2)}\n`
      }
    }

    // Generar contenido con RAG
    const result = await generateContentWithRAG({
      contentType: body.contentType,
      systemPrompt,
      userPrompt: microZoneContext + body.userPrompt,
      ragQuery: body.ragQuery,
      retrievalOptions: {
        topK: 5,
        similarityThreshold: 0.7,
        workspaceId
      },
      model: 'reasoning',
      modelConfig: {
        temperature: body.modelConfig?.temperature || templateConfig.temperature || 0.7,
        maxTokens: body.modelConfig?.maxTokens || templateConfig.max_tokens || 2500
      }
    })

    // Guardar contenido generado
    const [savedContent] = await db.insert(generatedContent).values({
      workspaceId,
      templateId: body.templateId || null,
      title: body.title,
      content: result.content,
      contentType: body.contentType,
      status: 'draft',
      generationMetadata: result.metadata,
      platformPostIds: {}
    }).returning()

    return NextResponse.json({
      success: true,
      content: savedContent,
      metadata: result.metadata
    })

  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Generate API] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * System prompts por defecto para cada tipo de contenido
 */
function getDefaultSystemPrompt(contentType: ContentType): string {
  const prompts: Record<ContentType, string> = {
    blog: 'Eres un experto redactor de contenido inmobiliario de lujo. Crea artículos informativos, bien estructurados y optimizados para SEO.',
    linkedin: 'Eres un experto en contenido para LinkedIn enfocado en real estate de lujo. Crea posts profesionales y engaging.',
    instagram: 'Eres un copywriter especializado en Instagram para el nicho de real estate de lujo mediterráneo. Crea captions visuales y aspiracionales.',
    facebook: 'Eres un especialista en contenido para Facebook enfocado en real estate. Crea posts conversacionales y accesibles.',
    newsletter: 'Eres un analista de mercado inmobiliario. Crea newsletters con insights de valor para clientes VIP.',
    custom: 'Eres un experto redactor de contenido. Sigue las instrucciones del usuario con precisión.'
  }

  return prompts[contentType]
}

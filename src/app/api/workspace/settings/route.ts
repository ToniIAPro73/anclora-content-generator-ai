import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { db } from '@/lib/db/neon'
import { workspaceSettings } from '@/lib/db/schema'

export const runtime = 'nodejs'

const DEFAULT_SETTINGS = {
  workspaceName: 'Anclora Content Generator AI',
  workspaceDescription:
    'Cockpit editorial de Anclora Group para convertir inteligencia de mercado en contenido de autoridad.',
  editorialSystemPrompt:
    'Prioriza tesis accionables, evidencia trazable y una voz premium, concreta y útil para Anclora Group.',
  defaultProvider: 'anthropic',
  defaultModel: 'claude-sonnet-4-6',
  defaultTemperature: 0.7,
  defaultTopP: 0.9,
  ragChunkSize: 512,
  ragTopK: 5,
  similarityThreshold: 0.7,
}

export async function GET() {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()

    const settings = await db.query.workspaceSettings.findFirst({
      where: eq(workspaceSettings.workspaceId, workspaceId),
    })

    return NextResponse.json({
      success: true,
      settings: settings ?? { workspaceId, ...DEFAULT_SETTINGS },
    })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Workspace Settings API] GET error:', error)
    return NextResponse.json({ error: 'No se pudo cargar la configuración del workspace' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()
    const body = (await request.json()) as Partial<typeof DEFAULT_SETTINGS>

    const payload = {
      workspaceName: body.workspaceName?.trim() || DEFAULT_SETTINGS.workspaceName,
      workspaceDescription: body.workspaceDescription?.trim() || DEFAULT_SETTINGS.workspaceDescription,
      editorialSystemPrompt: body.editorialSystemPrompt?.trim() || DEFAULT_SETTINGS.editorialSystemPrompt,
      defaultProvider: body.defaultProvider?.trim() || DEFAULT_SETTINGS.defaultProvider,
      defaultModel: body.defaultModel?.trim() || DEFAULT_SETTINGS.defaultModel,
      defaultTemperature: Number(body.defaultTemperature ?? DEFAULT_SETTINGS.defaultTemperature),
      defaultTopP: Number(body.defaultTopP ?? DEFAULT_SETTINGS.defaultTopP),
      ragChunkSize: Number(body.ragChunkSize ?? DEFAULT_SETTINGS.ragChunkSize),
      ragTopK: Number(body.ragTopK ?? DEFAULT_SETTINGS.ragTopK),
      similarityThreshold: Number(body.similarityThreshold ?? DEFAULT_SETTINGS.similarityThreshold),
      updatedAt: new Date(),
    }

    const existing = await db.query.workspaceSettings.findFirst({
      where: eq(workspaceSettings.workspaceId, workspaceId),
      columns: { id: true },
    })

    const [saved] = existing
      ? await db
          .update(workspaceSettings)
          .set(payload)
          .where(and(eq(workspaceSettings.id, existing.id), eq(workspaceSettings.workspaceId, workspaceId)))
          .returning()
      : await db
          .insert(workspaceSettings)
          .values({
            workspaceId,
            ...payload,
          })
          .returning()

    return NextResponse.json({ success: true, settings: saved })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Workspace Settings API] PATCH error:', error)
    return NextResponse.json({ error: 'No se pudo guardar la configuración del workspace' }, { status: 500 })
  }
}

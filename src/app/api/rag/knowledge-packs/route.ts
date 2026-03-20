import { NextRequest, NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { createAgenticKnowledgePack, listKnowledgeJobs, listKnowledgePacks } from '@/lib/rag/agentic-knowledge'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()
    const [packs, jobs] = await Promise.all([
      listKnowledgePacks(workspaceId),
      listKnowledgeJobs(workspaceId),
    ])

    return NextResponse.json({
      success: true,
      packs,
      jobs,
    })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Knowledge Packs GET]', error)
    return NextResponse.json({ error: 'Error al obtener los knowledge packs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { workspaceId, userId } = await getAuthenticatedWorkspace()
    const body = await request.json()

    const title = String(body.title ?? '').trim()
    const prompt = String(body.prompt ?? '').trim()
    const objective = String(body.objective ?? '').trim()
    const audience = String(body.audience ?? '').trim()
    const notes = String(body.notes ?? '').trim()
    const notebookContent = String(body.notebookContent ?? '').trim()
    const packType =
      body.packType === 'notebooklm_notebook' || body.packType === 'curated_brief'
        ? body.packType
        : 'agentic_research_pack'

    if (!title) {
      return NextResponse.json({ error: 'El titulo es obligatorio' }, { status: 400 })
    }

    if (!prompt && !notebookContent) {
      return NextResponse.json(
        { error: 'Necesitas un prompt o contenido de notebook para crear el dossier' },
        { status: 400 }
      )
    }

    const result = await createAgenticKnowledgePack({
      workspaceId,
      userId,
      title,
      prompt: prompt || `Notebook import para ${title}`,
      objective: objective || undefined,
      audience: audience || undefined,
      notes: notes || undefined,
      notebookContent: notebookContent || undefined,
      packType,
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Knowledge Packs POST]', error)
    return NextResponse.json({ error: 'Error al crear el knowledge pack' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { createIndexedSource, extractTextFromUploadedFile, fetchGoogleDocAsText } from '@/lib/rag/source-ingestion'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()
    const formData = await request.formData()

    const mode = String(formData.get('mode') ?? 'upload')
    const title = String(formData.get('title') ?? '').trim()

    if (!title) {
      return NextResponse.json({ error: 'El titulo es obligatorio' }, { status: 400 })
    }

    if (mode === 'google-doc') {
      const sourceUrl = String(formData.get('sourceUrl') ?? '').trim()
      if (!sourceUrl) {
        return NextResponse.json({ error: 'La URL del Google Doc es obligatoria' }, { status: 400 })
      }

      const content = await fetchGoogleDocAsText(sourceUrl)
      const source = await createIndexedSource({
        workspaceId,
        title,
        sourceType: 'url',
        sourceUrl,
        content,
        metadata: {
          ingestionMode: 'google-doc',
        },
      })

      return NextResponse.json({ success: true, source })
    }

    const file = formData.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Debes adjuntar un archivo PDF, DOCX, TXT o MD' }, { status: 400 })
    }

    const content = await extractTextFromUploadedFile(file)
    if (!content.trim()) {
      return NextResponse.json({ error: 'No se pudo extraer texto util del archivo' }, { status: 400 })
    }

    const source = await createIndexedSource({
      workspaceId,
      title,
      sourceType: 'document',
      content,
      metadata: {
        ingestionMode: 'file-upload',
        fileName: file.name,
        mimeType: file.type || null,
      },
    })

    return NextResponse.json({ success: true, source })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[RAG Import Document]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al importar el documento' },
      { status: 500 }
    )
  }
}

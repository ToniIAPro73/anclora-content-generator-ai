import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'

export const runtime = 'nodejs'

// DELETE /api/rag/sources/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { workspaceId } = await getAuthenticatedWorkspace()

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL no configurado' }, { status: 503 })
    }

    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)

    // El CASCADE en knowledge_chunks borra también los chunks
    const result = await sql`
      DELETE FROM content_sources
      WHERE id = ${id} AND workspace_id = ${workspaceId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Fuente no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[RAG Sources DELETE]', error)
    return NextResponse.json({ error: 'Error al eliminar fuente' }, { status: 500 })
  }
}

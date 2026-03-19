import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// DELETE /api/rag/sources/[id]?workspaceId=xxx
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL no configurado' }, { status: 503 })
  }

  const { id } = await params
  const workspaceId = new URL(request.url).searchParams.get('workspaceId')

  if (!workspaceId) {
    return NextResponse.json({ error: 'workspaceId requerido' }, { status: 400 })
  }

  try {
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
    console.error('[RAG Sources DELETE]', error)
    return NextResponse.json({ error: 'Error al eliminar fuente' }, { status: 500 })
  }
}

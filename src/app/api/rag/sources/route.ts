import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// GET /api/rag/sources?workspaceId=xxx
export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: true, sources: [] })
  }

  const workspaceId = new URL(request.url).searchParams.get('workspaceId')
  if (!workspaceId) {
    return NextResponse.json({ error: 'workspaceId requerido' }, { status: 400 })
  }

  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)

    const rows = await sql`
      SELECT id, title, source_type, status, chunks_count, created_at
      FROM content_sources
      WHERE workspace_id = ${workspaceId}
      ORDER BY created_at DESC
    `

    const sources = rows.map((r) => ({
      id: r.id as string,
      title: r.title as string,
      type: r.source_type as string,
      status: r.status as string,
      chunks: r.chunks_count as number,
      date: (r.created_at as string).slice(0, 10),
    }))

    return NextResponse.json({ success: true, sources })
  } catch (error) {
    console.error('[RAG Sources GET]', error)
    return NextResponse.json({ error: 'Error al obtener fuentes' }, { status: 500 })
  }
}

// POST /api/rag/sources  — crear nueva fuente
export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL no configurado' }, { status: 503 })
  }

  const body = await request.json()
  const { workspaceId, title, content, sourceUrl, sourceType = 'manual' } = body

  if (!workspaceId || !title) {
    return NextResponse.json({ error: 'workspaceId y title son requeridos' }, { status: 400 })
  }

  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)

    const [row] = await sql`
      INSERT INTO content_sources (workspace_id, title, source_type, source_url, content, status)
      VALUES (${workspaceId}, ${title}, ${sourceType}, ${sourceUrl ?? null}, ${content ?? null}, 'pending')
      RETURNING id, title, source_type, status, chunks_count, created_at
    `

    return NextResponse.json({
      success: true,
      source: {
        id: row.id,
        title: row.title,
        type: row.source_type,
        status: row.status,
        chunks: row.chunks_count,
        date: (row.created_at as string).slice(0, 10),
      },
    })
  } catch (error) {
    console.error('[RAG Sources POST]', error)
    return NextResponse.json({ error: 'Error al crear fuente' }, { status: 500 })
  }
}

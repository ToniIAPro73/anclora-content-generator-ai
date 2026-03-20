import { asc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'
import { db } from '@/lib/db/neon'
import { microZones } from '@/lib/db/schema'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()

    const items = await db.query.microZones.findMany({
      where: eq(microZones.workspaceId, workspaceId),
      orderBy: [asc(microZones.name)],
    })

    return NextResponse.json({ success: true, microZones: items })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Micro Zones API] GET error:', error)
    return NextResponse.json({ error: 'No se pudieron cargar las micro-zonas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()
    const body = (await request.json()) as {
      name?: string
      code?: string
      municipality?: string
      region?: string
      description?: string
      tags?: string[]
      marketData?: Record<string, unknown>
    }

    if (!body.name?.trim() || !body.code?.trim() || !body.municipality?.trim()) {
      return NextResponse.json(
        { error: 'name, code y municipality son requeridos' },
        { status: 400 }
      )
    }

    const [created] = await db
      .insert(microZones)
      .values({
        workspaceId,
        name: body.name.trim(),
        code: body.code.trim().toLowerCase(),
        municipality: body.municipality.trim(),
        region: body.region?.trim() || 'Southwest Mallorca',
        description: body.description?.trim() || null,
        tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
        marketData: body.marketData ?? {},
      })
      .returning()

    return NextResponse.json({ success: true, microZone: created })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Micro Zones API] POST error:', error)
    return NextResponse.json({ error: 'No se pudo guardar la micro-zona' }, { status: 500 })
  }
}

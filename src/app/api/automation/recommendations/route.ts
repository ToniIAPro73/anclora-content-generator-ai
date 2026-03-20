import { NextResponse } from 'next/server'

import { getAuthenticatedWorkspace, WorkspaceAuthError } from '@/lib/auth/workspace'

export const runtime = 'nodejs'

type RecommendationPriority = 'critical' | 'high' | 'medium'
type RecommendationType =
  | 'review_backlog'
  | 'schedule_gap'
  | 'repurpose_winner'
  | 'cta_optimization'
  | 'knowledge_gap'
  | 'content_refresh'

type OperationalRecommendation = {
  id: string
  type: RecommendationType
  priority: RecommendationPriority
  title: string
  reason: string
  metric: string
  actionSummary: string
  expectedImpact: string
  href: string
  hrefLabel: string
}

function recommendationId(type: RecommendationType, suffix: string) {
  return `${type}:${suffix}`
}

function buildStudioHref(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  return `/dashboard/studio?${searchParams.toString()}`
}

export async function GET() {
  try {
    const { workspaceId } = await getAuthenticatedWorkspace()

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true, recommendations: [] })
    }

    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL)

    const [
      reviewBacklogResult,
      approvedBacklogResult,
      scheduledQueueResult,
      totalSourcesResult,
      businessWinnerResult,
      ctaOpportunityResult,
      stalePublishedResult,
    ] = await Promise.all([
      sql`
        SELECT id, title, content_type, updated_at
        FROM generated_content
        WHERE workspace_id = ${workspaceId}
          AND status = 'review'
        ORDER BY updated_at ASC
        LIMIT 1
      `,
      sql`
        SELECT id, title, content_type, updated_at
        FROM generated_content
        WHERE workspace_id = ${workspaceId}
          AND status = 'approved'
          AND scheduled_for IS NULL
        ORDER BY updated_at ASC
        LIMIT 1
      `,
      sql`
        SELECT COUNT(*) AS count
        FROM scheduled_posts
        WHERE workspace_id = ${workspaceId}
          AND status = 'pending'
      `,
      sql`
        SELECT COUNT(*) AS count
        FROM content_sources
        WHERE workspace_id = ${workspaceId}
      `,
      sql`
        SELECT
          gc.id,
          gc.title,
          gc.content_type,
          cm.platform,
          COALESCE(SUM(cm.leads_generated), 0) AS leads,
          COALESCE(SUM(cm.conversions), 0) AS conversions
        FROM content_metrics cm
        INNER JOIN generated_content gc ON gc.id = cm.content_id
        WHERE cm.workspace_id = ${workspaceId}
        GROUP BY gc.id, gc.title, gc.content_type, cm.platform
        ORDER BY COALESCE(SUM(cm.conversions), 0) DESC,
                 COALESCE(SUM(cm.leads_generated), 0) DESC
        LIMIT 1
      `,
      sql`
        SELECT
          gc.id,
          gc.title,
          gc.content_type,
          COALESCE(SUM(cm.views), 0) AS views,
          COALESCE(SUM(cm.leads_generated), 0) AS leads
        FROM content_metrics cm
        INNER JOIN generated_content gc ON gc.id = cm.content_id
        WHERE cm.workspace_id = ${workspaceId}
        GROUP BY gc.id, gc.title, gc.content_type
        HAVING COALESCE(SUM(cm.views), 0) >= 100
           AND COALESCE(SUM(cm.leads_generated), 0) = 0
        ORDER BY COALESCE(SUM(cm.views), 0) DESC
        LIMIT 1
      `,
      sql`
        SELECT id, title, content_type, published_at
        FROM generated_content
        WHERE workspace_id = ${workspaceId}
          AND status = 'published'
          AND published_at < NOW() - INTERVAL '21 days'
        ORDER BY published_at ASC
        LIMIT 1
      `,
    ])

    const recommendations: OperationalRecommendation[] = []

    const reviewBacklog = reviewBacklogResult[0]
    if (reviewBacklog) {
      recommendations.push({
        id: recommendationId('review_backlog', String(reviewBacklog.id)),
        type: 'review_backlog',
        priority: 'critical',
        title: 'Desbloquear una pieza atascada en revisión',
        reason: `${String(reviewBacklog.title)} lleva tiempo esperando validación editorial y está frenando el flujo.`,
        metric: `Última actualización: ${new Date(String(reviewBacklog.updated_at)).toLocaleString('es-ES')}`,
        actionSummary: 'Revisa tesis, CTA y salida editorial antes de aprobar o devolver cambios.',
        expectedImpact: 'Reducir fricción editorial y devolver velocidad al pipeline.',
        href: buildStudioHref({
          contentId: String(reviewBacklog.id),
          automationSource: 'review_backlog',
          automationAction: 'Valida la tesis, el CTA y la salida editorial para desbloquear esta pieza.',
          automationImpact: 'Reducir fricción editorial y devolver velocidad al pipeline.',
        }),
        hrefLabel: 'Revisar pieza',
      })
    }

    const approvedBacklog = approvedBacklogResult[0]
    const scheduledQueueCount = Number(scheduledQueueResult[0]?.count ?? 0)
    if (approvedBacklog && scheduledQueueCount === 0) {
      recommendations.push({
        id: recommendationId('schedule_gap', String(approvedBacklog.id)),
        type: 'schedule_gap',
        priority: 'high',
        title: 'Cierra el hueco de programación',
        reason: `No hay cola programada activa y ${String(approvedBacklog.title)} ya está aprobada para salir.`,
        metric: 'Cola programada pendiente: 0',
        actionSummary: 'Asigna una fecha de salida y valida el canal antes de perder inercia editorial.',
        expectedImpact: 'Mantener cadencia visible y evitar semanas sin contenido publicado.',
        href: buildStudioHref({
          contentId: String(approvedBacklog.id),
          automationSource: 'schedule_gap',
          automationAction: 'Programa una ventana de salida para que la cadencia no se quede vacía.',
          automationImpact: 'Mantener cadencia visible y evitar semanas sin contenido publicado.',
        }),
        hrefLabel: 'Programar salida',
      })
    }

    const businessWinner = businessWinnerResult[0]
    if (businessWinner && Number(businessWinner.leads ?? 0) > 0) {
      recommendations.push({
        id: recommendationId('repurpose_winner', String(businessWinner.id)),
        type: 'repurpose_winner',
        priority: 'high',
        title: 'Deriva el contenido que ya está generando negocio',
        reason: `${String(businessWinner.title)} ya produce señal comercial; conviene reaprovechar su tesis en otro canal.`,
        metric: `${Number(businessWinner.leads ?? 0)} leads · ${Number(businessWinner.conversions ?? 0)} conversiones`,
        actionSummary: 'Abre una derivada con la misma tesis ganadora, pero empaquetada para un canal distinto.',
        expectedImpact: 'Aumentar alcance comercial reaprovechando una tesis ya validada por el mercado.',
        href: buildStudioHref({
          automationSource: 'repurpose_winner',
          automationAction: 'Convierte esta tesis ganadora en una derivada de canal con un CTA más directo.',
          automationImpact: 'Aumentar alcance comercial reaprovechando una tesis ya validada por el mercado.',
          title: `Derivada de ${String(businessWinner.title)}`,
          objective: `Reaprovechar una tesis que ya genera negocio en ${String(businessWinner.platform ?? 'otro canal')} sin perder foco comercial.`,
          audience: 'Inversores y compradores premium que ya han mostrado interes en contenidos de inteligencia inmobiliaria.',
          context: `${String(businessWinner.title)} ya ha generado ${Number(businessWinner.leads ?? 0)} leads y ${Number(businessWinner.conversions ?? 0)} conversiones. Mantener la misma hipotesis y reforzar el CTA.`,
          contentType: 'linkedin',
          tone: 'institucional',
        }),
        hrefLabel: 'Crear derivada',
      })
    }

    const ctaOpportunity = ctaOpportunityResult[0]
    if (ctaOpportunity) {
      recommendations.push({
        id: recommendationId('cta_optimization', String(ctaOpportunity.id)),
        type: 'cta_optimization',
        priority: 'medium',
        title: 'Optimiza una pieza con mucho tráfico y baja conversión',
        reason: `${String(ctaOpportunity.title)} atrae atención, pero no está convirtiendo ese interés en leads.`,
        metric: `${Number(ctaOpportunity.views ?? 0)} views · ${Number(ctaOpportunity.leads ?? 0)} leads`,
        actionSummary: 'Reabre la pieza y endurece propuesta de valor, CTA y cierre comercial.',
        expectedImpact: 'Mejorar eficiencia comercial sin necesidad de crear contenido nuevo.',
        href: buildStudioHref({
          contentId: String(ctaOpportunity.id),
          automationSource: 'cta_optimization',
          automationAction: 'Reescribe el cierre y el CTA para convertir atencion en conversacion comercial.',
          automationImpact: 'Mejorar eficiencia comercial sin necesidad de crear contenido nuevo.',
        }),
        hrefLabel: 'Reforzar CTA',
      })
    }

    const totalSources = Number(totalSourcesResult[0]?.count ?? 0)
    if (totalSources < 5) {
      recommendations.push({
        id: recommendationId('knowledge_gap', 'sources'),
        type: 'knowledge_gap',
        priority: 'medium',
        title: 'Refuerza la base de conocimiento',
        reason: 'El RAG sigue con una base documental pequeña y eso limita la calidad de las tesis editoriales.',
        metric: `${totalSources} fuentes activas`,
        actionSummary: 'Carga nuevas fuentes antes de abrir mas piezas para que el motor trabaje con contexto suficiente.',
        expectedImpact: 'Subir la calidad del razonamiento y reducir piezas débiles o demasiado genéricas.',
        href: '/dashboard/rag?automationSource=knowledge_gap',
        hrefLabel: 'Cargar fuentes',
      })
    }

    const stalePublished = stalePublishedResult[0]
    if (stalePublished) {
      recommendations.push({
        id: recommendationId('content_refresh', String(stalePublished.id)),
        type: 'content_refresh',
        priority: 'medium',
        title: 'Actualiza una pieza publicada que puede haber quedado obsoleta',
        reason: `${String(stalePublished.title)} lleva semanas publicado y puede necesitar refresh con contexto más reciente.`,
        metric: `Publicado: ${new Date(String(stalePublished.published_at)).toLocaleDateString('es-ES')}`,
        actionSummary: 'Reabre la pieza y actualiza tesis, datos y CTA con contexto más reciente.',
        expectedImpact: 'Recuperar autoridad y tráfico sobre un activo ya publicado sin partir desde cero.',
        href: buildStudioHref({
          contentId: String(stalePublished.id),
          automationSource: 'content_refresh',
          automationAction: 'Actualiza esta pieza publicada con datos mas recientes y una llamada a la accion renovada.',
          automationImpact: 'Recuperar autoridad y tráfico sobre un activo ya publicado sin partir desde cero.',
        }),
        hrefLabel: 'Actualizar pieza',
      })
    }

    return NextResponse.json({ success: true, recommendations: recommendations.slice(0, 5) })
  } catch (error) {
    if (error instanceof WorkspaceAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error('[Automation Recommendations API] Error:', error)
    return NextResponse.json({ success: true, recommendations: [] })
  }
}

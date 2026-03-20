"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  FileText,
  Radar,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SurfaceCard } from "@/components/ui/surface-card"

interface DashboardMetrics {
  totalContent: number
  publishedContent: number
  draftContent: number
  reviewContent: number
  approvedContent: number
  avgTokensUsed: number
  totalKnowledgeChunks: number
  scheduledPosts?: number
  totalSources?: number
  totalLeadsGenerated?: number
  totalConversions?: number
  trackedLeads?: number
  convertedLeads?: number
  recentContent?: Array<{
    id: string
    title: string
    status: string
    contentType: string
    updatedAt: string
  }>
  scheduledQueue?: Array<{
    id: string
    contentId: string
    title: string
    platform: string
    contentType: string
    scheduledFor: string
  }>
  deliveryQueue?: Array<{
    id: string
    contentId: string
    title: string
    platform: string
    contentType: string
    scheduledFor: string
    status: string
    retryCount: number
    lastError: string | null
    publishedAt: string | null
    platformPostId: string | null
  }>
}

interface OperationalRecommendation {
  id: string
  type: 'review_backlog' | 'schedule_gap' | 'repurpose_winner' | 'cta_optimization' | 'knowledge_gap' | 'content_refresh'
  priority: 'critical' | 'high' | 'medium'
  title: string
  reason: string
  metric: string
  actionSummary: string
  expectedImpact: string
  href: string
  hrefLabel: string
}
const commandCards = [
  {
    title: "Briefing del dia",
    description: "Redacta una pieza ancla sobre oportunidades en Camp de Mar con soporte de micro-zona.",
    href: "/dashboard/studio",
    cta: "Abrir Studio",
  },
  {
    title: "Actualizar contexto",
    description: "Ingresa nuevas fuentes regulatorias y datos de mercado para mejorar el RAG.",
    href: "/dashboard/rag",
    cta: "Abrir Knowledge Base",
  },
  {
    title: "Refinar el sistema",
    description: "Ajusta plantillas, modelos y preferencias del workspace antes de escalar la cadencia.",
    href: "/dashboard/settings",
    cta: "Abrir Settings",
  },
] as const

const marketSignals = [
  {
    zone: "Camp de Mar",
    signal: "Ventana de reposicionamiento",
    detail: "Caida de precio visible vs maximos historicos. Requiere pieza explicativa con contexto de inventario.",
  },
  {
    zone: "Punta Negra",
    signal: "Narrativa de infraestructuras",
    detail: "El efecto hospitality premium puede empujar awareness y ticket medio en inversores internacionales.",
  },
  {
    zone: "Palmanova",
    signal: "Yield tension",
    detail: "La divergencia entre renta y venta pide una lectura clara para captar leads analiticos.",
  },
] as const

const publishingChecklist = [
  "Validar 3 fuentes recientes antes de publicar una pieza de inteligencia.",
  "Convertir el articulo principal en derivadas para LinkedIn, Instagram y newsletter.",
  "Conectar el contenido al siguiente CTA comercial dentro de Nexus.",
] as const

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [recommendations, setRecommendations] = useState<OperationalRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [queueActionId, setQueueActionId] = useState<string | null>(null)
  const [deliveryActionId, setDeliveryActionId] = useState<string | null>(null)

  async function fetchMetrics() {
    try {
      const [metricsResponse, recommendationsResponse] = await Promise.all([
        fetch('/api/metrics/dashboard'),
        fetch('/api/automation/recommendations'),
      ])

      if (metricsResponse.ok) {
        const data = await metricsResponse.json()
        setMetrics(data.metrics)
      }

      if (recommendationsResponse.ok) {
        const data = await recommendationsResponse.json()
        setRecommendations(data.recommendations ?? [])
      }
    } catch {
      setMetrics(null)
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchMetrics()
  }, [])

  async function handleUnschedule(contentId: string) {
    setQueueActionId(contentId)

    try {
      const response = await fetch('/api/content/library', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contentId,
          action: 'unschedule',
        }),
      })

      if (response.ok) {
        await fetchMetrics()
      }
    } finally {
      setQueueActionId(null)
    }
  }

  async function handleDeliveryAction(contentId: string, action: 'dispatch' | 'retry_delivery') {
    setDeliveryActionId(contentId)

    try {
      const response = await fetch('/api/content/library', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contentId,
          action,
        }),
      })

      if (response.ok) {
        await fetchMetrics()
      }
    } finally {
      setDeliveryActionId(null)
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="border-primary/20 bg-[linear-gradient(135deg,hsla(var(--primary),0.14),transparent_65%)]">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-primary/20 bg-primary/10 text-primary" variant="outline">
                Mission Control
              </Badge>
              <Badge variant="secondary">Mallorca premium real estate</Badge>
            </div>
            <CardTitle className="max-w-3xl text-2xl lg:text-4xl">
              Convierte senales de mercado en contenido que refuerce autoridad de marca y genere demanda cualificada.
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-relaxed lg:text-base">
              El valor del producto no esta en “publicar mas”, sino en detectar oportunidades antes, estructurar el contexto y empujar una narrativa consistente en todos los canales.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/studio">
              <Button size="lg">
                Abrir Content Studio
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/rag">
              <Button size="lg" variant="outline">
                Revisar Knowledge Base
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Radar className="h-4 w-4 text-primary" />
              Estado operativo
            </CardTitle>
            <CardDescription>
              Una vista simple para saber si el sistema esta listo para escalar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "Fuentes conectadas",
                value: metrics?.totalSources ?? 0,
                helper: "Cuantas entradas alimentan el contexto.",
              },
              {
                label: "Piezas en borrador",
                value: metrics?.draftContent ?? 0,
                helper: "Contenido listo para revisar y derivar.",
              },
              {
                label: "En revision",
                value: metrics?.reviewContent ?? 0,
                helper: "Piezas pendientes de aprobacion editorial.",
              },
              {
                label: "Publicaciones pendientes",
                value: metrics?.scheduledPosts ?? 0,
                helper: "Backlog de programacion pendiente.",
              },
            ].map((item) => (
              <SurfaceCard key={item.label} variant="inner" className="border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
                  {isLoading ? "..." : item.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p>
              </SurfaceCard>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {[
          {
            label: "Contenido total",
            value: metrics?.totalContent ?? 0,
            note: "Activos editoriales creados",
            icon: FileText,
          },
          {
            label: "Publicado",
            value: metrics?.publishedContent ?? 0,
            note: "Contenido ya empujando autoridad",
            icon: CheckCircle2,
          },
          {
            label: "Knowledge chunks",
            value: metrics?.totalKnowledgeChunks ?? 0,
            note: "Contexto reusable para el motor RAG",
            icon: BookOpen,
          },
          {
            label: "Promedio de tokens",
            value: metrics?.avgTokensUsed ?? 0,
            note: "Indicador de coste y densidad",
            icon: Sparkles,
          },
          {
            label: "Leads generados",
            value: metrics?.totalLeadsGenerated ?? 0,
            note: "Señal comercial atribuida al contenido",
            icon: TrendingUp,
          },
          {
            label: "Conversiones",
            value: metrics?.totalConversions ?? 0,
            note: "Acciones de negocio ya cerradas",
            icon: CheckCircle2,
          },
        ].map(({ label, value, note, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-start justify-between gap-4 pt-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                <p className="mt-3 font-heading text-4xl font-semibold text-foreground">
                  {isLoading ? "..." : value}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recomendaciones automáticas
            </CardTitle>
            <CardDescription>
              Siguientes pasos sugeridos a partir del estado editorial y las métricas reales.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.length ? (
              recommendations.map((item) => (
                <SurfaceCard key={item.id} variant="inner" className="border bg-muted/40 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <Badge
                      variant="outline"
                      className={
                        item.priority === 'critical'
                          ? 'border-red-500/30 text-red-300'
                          : item.priority === 'high'
                          ? 'border-primary/30 text-primary'
                          : undefined
                      }
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.reason}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">{item.metric}</p>
                  <p className="mt-2 text-xs font-medium text-primary/90">{item.actionSummary}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Impacto esperado: {item.expectedImpact}</p>
                  <div className="mt-3">
                    <Link href={item.href}>
                      <Button size="sm" variant="outline">
                        {item.hrefLabel}
                      </Button>
                    </Link>
                  </div>
                </SurfaceCard>
              ))
            ) : (
              marketSignals.map((signal) => (
                <SurfaceCard key={signal.zone} variant="inner" className="border bg-muted/40 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">{signal.zone}</p>
                    <Badge variant="outline">{signal.signal}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {signal.detail}
                  </p>
                </SurfaceCard>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              Cadencia editorial
            </CardTitle>
            <CardDescription>
              Una operacion que funciona necesita ritmo, no solo piezas aisladas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {publishingChecklist.map((item, index) => (
              <SurfaceCard key={item} variant="inner" className="flex items-start gap-3 border bg-background/70 p-4">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
              </SurfaceCard>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones prioritarias</CardTitle>
            <CardDescription>
              Atajos alineados con el flujo real del equipo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {commandCards.map((item) => (
              <Link key={item.title} href={item.href} className="block">
                <SurfaceCard variant="inner" className="border bg-background/70 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {item.cta}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </SurfaceCard>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.8fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Pipeline editorial reciente
            </CardTitle>
            <CardDescription>
              Señales reales del flujo draft to review to approved to scheduled to published.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {metrics?.recentContent?.length ? (
              metrics.recentContent.map((item) => (
                <SurfaceCard key={item.id} variant="inner" className="border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">{item.contentType}</Badge>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                  <p className="mt-3 font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Actualizado {new Date(item.updatedAt).toLocaleString("es-ES")}
                  </p>
                </SurfaceCard>
              ))
            ) : (
              <SurfaceCard variant="inner" className="border bg-background/70 p-4">
                <p className="font-medium text-foreground">Todavia no hay pipeline editorial visible</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Cuando generes y muevas piezas entre borrador, revision y aprobacion apareceran aqui.
                </p>
              </SurfaceCard>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              Cola programada
            </CardTitle>
            <CardDescription>
              Las siguientes piezas ya tienen ventana de salida asignada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics?.scheduledQueue?.length ? (
              metrics.scheduledQueue.map((item) => (
                <SurfaceCard key={item.id} variant="inner" className="border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">{item.platform}</Badge>
                    <Badge variant="outline">{item.contentType}</Badge>
                  </div>
                  <p className="mt-3 font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Programado para {new Date(item.scheduledFor).toLocaleString("es-ES")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={`/dashboard/studio?contentId=${item.contentId}`}>
                      <Button size="sm" variant="outline">
                        Abrir en Studio
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={queueActionId === item.contentId}
                      onClick={() => void handleUnschedule(item.contentId)}
                    >
                      {queueActionId === item.contentId ? "Cancelando..." : "Cancelar"}
                    </Button>
                  </div>
                </SurfaceCard>
              ))
            ) : (
              <SurfaceCard variant="inner" className="border bg-background/70 p-4">
                <p className="font-medium text-foreground">No hay publicaciones programadas</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Cuando apruebes una pieza y la lleves a scheduled aparecerá aquí con su fecha de salida.
                </p>
              </SurfaceCard>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-primary" />
              Cola de ejecución
            </CardTitle>
            <CardDescription>
              Último estado operativo de las publicaciones programadas y ya entregadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics?.deliveryQueue?.length ? (
              metrics.deliveryQueue.map((item) => (
                <SurfaceCard key={item.id} variant="inner" className="border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">{item.platform}</Badge>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                  <p className="mt-3 font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Ventana {new Date(item.scheduledFor).toLocaleString('es-ES')}
                  </p>
                  {item.publishedAt ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Entregado {new Date(item.publishedAt).toLocaleString('es-ES')}
                    </p>
                  ) : null}
                  {item.platformPostId ? (
                    <p className="mt-1 text-xs text-muted-foreground">Post ID {item.platformPostId}</p>
                  ) : null}
                  {item.lastError ? (
                    <p className="mt-2 text-xs text-red-300">{item.lastError}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={`/dashboard/studio?contentId=${item.contentId}`}>
                      <Button size="sm" variant="outline">
                        Abrir pieza
                      </Button>
                    </Link>
                    {item.status === 'pending' ? (
                      <Button
                        size="sm"
                        disabled={deliveryActionId === item.contentId}
                        onClick={() => void handleDeliveryAction(item.contentId, 'dispatch')}
                      >
                        {deliveryActionId === item.contentId ? 'Ejecutando...' : 'Ejecutar'}
                      </Button>
                    ) : null}
                    {item.status === 'failed' ? (
                      <Button
                        size="sm"
                        disabled={deliveryActionId === item.contentId}
                        onClick={() => void handleDeliveryAction(item.contentId, 'retry_delivery')}
                      >
                        {deliveryActionId === item.contentId ? 'Reintentando...' : 'Reintentar'}
                      </Button>
                    ) : null}
                  </div>
                </SurfaceCard>
              ))
            ) : (
              <SurfaceCard variant="inner" className="border bg-background/70 p-4">
                <p className="font-medium text-foreground">Todavía no hay entregas en cola</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Cuando programes o ejecutes publicaciones aparecerán aquí con su estado operativo.
                </p>
              </SurfaceCard>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

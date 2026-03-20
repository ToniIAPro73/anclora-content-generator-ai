'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SurfaceCard } from '@/components/ui/surface-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, FileText, Rocket, BookOpen, Layers, Clock } from 'lucide-react'

interface DashboardMetrics {
  totalContent: number
  publishedContent: number
  draftContent: number
  reviewContent: number
  approvedContent: number
  avgTokensUsed: number
  totalKnowledgeChunks: number
  contentByType?: Record<string, number>
  recentActivity?: Array<{ date: string; count: number }>
  recentContent?: Array<{ id: string; title: string; status: string; contentType: string; updatedAt: string }>
  scheduledQueue?: Array<{ id: string; contentId: string; title: string; platform: string; contentType: string; scheduledFor: string }>
  platformPerformance?: Array<{ platform: string; views: number; impressions: number; clicks: number; leads: number; avgEngagementRate: number }>
  topPerformingContent?: Array<{ id: string; title: string; contentType: string; platform: string; views: number; impressions: number; clicks: number; leads: number; avgEngagementRate: number; lastSnapshot: string }>
}
const amber = 'hsl(38 92% 55%)'
const sage  = 'hsl(158 42% 45%)'

const KPI_CARDS = [
  { key: 'totalContent',        label: 'Contenido Total',   sub: 'Piezas generadas',       icon: FileText, accent: amber },
  { key: 'publishedContent',    label: 'Publicado',         sub: 'Del total generado',     icon: Rocket,   accent: sage  },
  { key: 'draftContent',        label: 'Borradores',        sub: 'Pendientes de publicar', icon: Layers,   accent: amber },
  { key: 'reviewContent',       label: 'En Revisión',       sub: 'Pendientes de aprobación', icon: Clock,   accent: sage  },
]

function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded animate-pulse bg-muted ${className}`} />
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [queueActionId, setQueueActionId] = useState<string | null>(null)

  async function fetchMetrics() {
    await fetch('/api/metrics/dashboard')
      .then((r) => r.json())
      .then((data) => setMetrics(data.metrics ?? null))
      .catch(() => setMetrics(null))
      .finally(() => setIsLoading(false))
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

  return (
    <div className="space-y-6 p-1">

      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Métricas de uso y rendimiento de tu contenido
          </p>
        </div>
        <Badge
          variant="outline"
          className="gap-1.5 border-primary/30 bg-primary/10 text-primary text-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          En tiempo real
        </Badge>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map(({ key, label, sub, icon: Icon, accent }) => {
          const value = metrics?.[key as keyof DashboardMetrics] ?? 0
          return (
            <SurfaceCard
              key={key}
              variant="panel"
              className="group relative overflow-hidden p-5"
            >
              {/* Amber/sage left accent bar */}
              <div
                className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: accent }}
              />

              <div className="pl-3 flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  {isLoading
                    ? <Skeleton className="mt-2 h-9 w-16" />
                    : <p className="mt-2 font-heading text-4xl font-bold" style={{ color: accent }}>{String(value)}</p>
                  }
                  <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
                </div>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${accent}20`, color: accent }}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </SurfaceCard>
          )
        })}
      </div>

      {/* ─── Tabs ─── */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="border border-border bg-muted/60 h-9">
          {[
            { value: 'overview', label: 'Overview' },
            { value: 'content',  label: 'Contenido' },
            { value: 'rag',      label: 'Knowledge Base' },
          ].map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">

            {/* Content status */}
            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Estado del Contenido</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Distribución por estado de publicación
              </p>
              <div className="mt-5 space-y-4">
                {[
                  { label: 'Publicado', value: metrics?.publishedContent ?? 0, accent: sage  },
                  { label: 'Borrador',  value: metrics?.draftContent ?? 0,      accent: amber },
                  { label: 'Revisión',  value: metrics?.reviewContent ?? 0,     accent: 'hsl(210 80% 65%)' },
                  { label: 'Aprobado',  value: metrics?.approvedContent ?? 0,   accent: 'hsl(158 42% 45%)' },
                ].map(({ label, value, accent }) => {
                  const total = metrics?.totalContent || 1
                  const pct = Math.round((value / total) * 100)
                  return (
                    <div key={label}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                          <span className="text-muted-foreground">{label}</span>
                        </div>
                        <span className="font-medium">
                          {isLoading ? '—' : value}{' '}
                          <span className="text-muted-foreground font-normal">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: accent }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </SurfaceCard>

            {/* Content types */}
            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Tipos de Contenido</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Distribución por tipo generado
              </p>
              <div className="mt-5">
                {metrics?.contentByType && Object.keys(metrics.contentByType).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(metrics.contentByType).map(([type, count]) => (
                      <SurfaceCard
                        key={type}
                        variant="inner"
                        className="flex items-center justify-between rounded-lg border bg-muted px-3 py-2"
                      >
                        <Badge variant="secondary" className="text-xs">{type}</Badge>
                        <span className="font-heading text-sm font-semibold" style={{ color: amber }}>{count}</span>
                      </SurfaceCard>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
                      <BarChart3 className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Sin datos aún</p>
                    <p className="mt-1 text-xs text-muted-foreground/60 max-w-xs">
                      Genera tu primer contenido para ver estadísticas
                    </p>
                  </div>
                )}
              </div>
            </SurfaceCard>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Rendimiento por Canal</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Lectura inicial de alcance, clics y leads por plataforma.
              </p>
              {metrics?.platformPerformance && metrics.platformPerformance.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {metrics.platformPerformance.map((item) => (
                    <SurfaceCard
                      key={item.platform}
                      variant="inner"
                      className="rounded-lg border bg-muted px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant="secondary" className="text-xs">{item.platform}</Badge>
                        <span className="text-xs text-muted-foreground">
                          ER {(item.avgEngagementRate * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <p>Views</p>
                          <p className="mt-1 font-semibold text-foreground">{item.views}</p>
                        </div>
                        <div>
                          <p>Clicks</p>
                          <p className="mt-1 font-semibold text-foreground">{item.clicks}</p>
                        </div>
                        <div>
                          <p>Leads</p>
                          <p className="mt-1 font-semibold text-foreground">{item.leads}</p>
                        </div>
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                    <BarChart3 className="h-6 w-6 text-muted-foreground/35" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Sin telemetría por canal todavía</p>
                  <p className="mt-1 text-xs text-muted-foreground/55 max-w-xs">
                    Cuando entren snapshots en content_metrics aparecerán aquí.
                  </p>
                </div>
              )}
            </SurfaceCard>

            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Piezas con Mayor Tracción</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Ranking operativo para detectar qué tesis ya están empujando demanda.
              </p>
              {metrics?.topPerformingContent && metrics.topPerformingContent.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {metrics.topPerformingContent.map((item) => (
                    <SurfaceCard
                      key={`${item.id}-${item.platform}`}
                      variant="inner"
                      className="rounded-lg border bg-muted px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="text-xs">{item.platform}</Badge>
                        <Badge variant="outline" className="text-xs">{item.contentType}</Badge>
                      </div>
                      <p className="mt-3 text-sm font-medium text-foreground">{item.title}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>{item.views} views</span>
                        <span>{item.clicks} clicks</span>
                        <span>{item.leads} leads</span>
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                    <Rocket className="h-6 w-6 text-muted-foreground/35" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Aún no hay piezas con telemetría</p>
                  <p className="mt-1 text-xs text-muted-foreground/55 max-w-xs">
                    Esta vista se activará cuando exista rendimiento persistido por pieza y plataforma.
                  </p>
                </div>
              )}
            </SurfaceCard>
          </div>
        </TabsContent>

        {/* ── Contenido ── */}
        <TabsContent value="content">
          <div className="grid gap-4 xl:grid-cols-2">
            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Pipeline Editorial</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Estado reciente de las piezas dentro del ciclo editorial
              </p>
              {metrics?.recentContent && metrics.recentContent.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {metrics.recentContent.map((item) => (
                    <SurfaceCard
                      key={item.id}
                      variant="inner"
                      className="flex items-center justify-between rounded-lg border bg-muted px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{item.contentType}</Badge>
                        <Badge className="text-xs" variant="outline">{item.status}</Badge>
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                    <Clock className="h-6 w-6 text-muted-foreground/35" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Sin actividad editorial reciente</p>
                  <p className="mt-1 text-xs text-muted-foreground/55 max-w-xs">
                    Cuando generes y muevas piezas por el pipeline editorial aparecerán aquí
                  </p>
                </div>
              )}
            </SurfaceCard>

            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Cola Programada</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Próximas piezas listas para salir sin depender de memoria manual.
              </p>
              {metrics?.scheduledQueue && metrics.scheduledQueue.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {metrics.scheduledQueue.map((item) => (
                    <SurfaceCard
                      key={item.id}
                      variant="inner"
                      className="flex items-center justify-between rounded-lg border bg-muted px-4 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(item.scheduledFor).toLocaleString('es-ES')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{item.platform}</Badge>
                        <Badge className="text-xs" variant="outline">{item.contentType}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/studio?contentId=${item.contentId}`}>
                          <Button size="sm" variant="outline">Abrir</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={queueActionId === item.contentId}
                          onClick={() => void handleUnschedule(item.contentId)}
                        >
                          {queueActionId === item.contentId ? 'Cancelando...' : 'Cancelar'}
                        </Button>
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                    <Clock className="h-6 w-6 text-muted-foreground/35" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Sin cola programada</p>
                  <p className="mt-1 text-xs text-muted-foreground/55 max-w-xs">
                    Programa una pieza desde el Studio y aparecerá aquí con su siguiente ventana de salida.
                  </p>
                </div>
              )}
            </SurfaceCard>
          </div>
        </TabsContent>

        {/* ── RAG ── */}
        <TabsContent value="rag">
          <SurfaceCard variant="panel" className="p-6">
            <h3 className="font-heading text-sm font-semibold">Base de Conocimiento</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Estadísticas del RAG engine
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {/* Chunks hero stat */}
              <SurfaceCard
                variant="inner"
                className="col-span-full flex items-center justify-between rounded-xl border p-5"
                style={{
                  backgroundColor: `${sage}0d`,
                  borderColor: `${sage}35`,
                }}
              >
                <div>
                  <p className="text-xs text-muted-foreground">Chunks Almacenados</p>
                  <p className="mt-1 font-heading text-4xl font-bold" style={{ color: 'hsl(158 42% 52%)' }}>
                    {metrics?.totalKnowledgeChunks ?? 0}
                  </p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${sage}20`, color: 'hsl(158 42% 52%)' }}
                >
                  <BookOpen className="h-5 w-5" />
                </div>
              </SurfaceCard>

              {[
                { label: 'Dimensiones embedding',  value: '384' },
                { label: 'Modelo embeddings',      value: 'all-MiniLM-L6-v2' },
                { label: 'Vector search engine',   value: 'pgvector' },
                { label: 'Similarity threshold',   value: '0.7' },
              ].map(({ label, value }) => (
                <SurfaceCard
                  key={label}
                  variant="inner"
                  className="flex items-center justify-between rounded-lg border bg-muted px-4 py-3"
                >
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="font-mono text-xs font-semibold">{value}</span>
                </SurfaceCard>
              ))}
            </div>
          </SurfaceCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SurfaceCard } from '@/components/ui/surface-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, FileText, Rocket, BookOpen, Layers, Clock, MapPinned, TriangleAlert } from 'lucide-react'

interface DashboardMetrics {
  totalContent: number
  publishedContent: number
  draftContent: number
  reviewContent: number
  approvedContent: number
  totalLeadsGenerated?: number
  totalConversions?: number
  trackedLeads?: number
  convertedLeads?: number
  avgTokensUsed: number
  totalKnowledgeChunks: number
  contentByType?: Record<string, number>
  recentActivity?: Array<{ date: string; count: number }>
  recentContent?: Array<{ id: string; title: string; status: string; contentType: string; updatedAt: string }>
  scheduledQueue?: Array<{ id: string; contentId: string; title: string; platform: string; contentType: string; scheduledFor: string }>
  deliveryQueue?: Array<{ id: string; contentId: string; title: string; platform: string; contentType: string; scheduledFor: string; status: string; retryCount: number; lastError: string | null; publishedAt: string | null; platformPostId: string | null }>
  platformPerformance?: Array<{ platform: string; views: number; impressions: number; clicks: number; leads: number; avgEngagementRate: number }>
  topPerformingContent?: Array<{ id: string; title: string; contentType: string; platform: string; views: number; impressions: number; clicks: number; leads: number; avgEngagementRate: number; lastSnapshot: string }>
  platformMomentum?: Array<{ platform: string; viewsCurrent: number; viewsPrevious: number; leadsCurrent: number; leadsPrevious: number; conversionsCurrent: number; conversionsPrevious: number }>
  businessImpactContent?: Array<{ id: string; title: string; contentType: string; platform: string; views: number; clicks: number; leads: number; conversions: number; leadEfficiency: number; conversionEfficiency: number }>
  microZonePerformance?: Array<{ id: string; name: string; municipality: string; totalContent: number; publishedContent: number; views: number; leads: number; conversions: number; lastActivityAt: string | null }>
  editorialAlerts?: Array<{ id: string; tone: 'neutral' | 'warning' | 'critical'; title: string; description: string; href: string; hrefLabel: string }>
}

interface LibraryContentItem {
  id: string
  title: string
  content: string
  contentType: string
  status: string
  createdAt: string
  updatedAt: string
  scheduledFor?: string | null
  publishedAt?: string | null
  microZoneId?: string | null
  microZone?: {
    id: string
    name: string
    municipality: string
  } | null
  performance?: {
    views: number
    impressions: number
    clicks: number
    leadsGenerated: number
    conversions: number
    engagementRate: number
    leadsTracked: number
    convertedLeads: number
    leadStatus?: {
      new: number
      contacted: number
      qualified: number
      lost: number
    }
    leadScore?: {
      A: number
      B: number
      C: number
    }
  }
}

const amber = 'hsl(38 92% 55%)'
const sage  = 'hsl(158 42% 45%)'

const KPI_CARDS = [
  { key: 'totalContent',        label: 'Contenido Total',   sub: 'Piezas generadas',       icon: FileText, accent: amber },
  { key: 'publishedContent',    label: 'Publicado',         sub: 'Del total generado',     icon: Rocket,   accent: sage  },
  { key: 'draftContent',        label: 'Borradores',        sub: 'Pendientes de publicar', icon: Layers,   accent: amber },
  { key: 'reviewContent',       label: 'En Revisión',       sub: 'Pendientes de aprobación', icon: Clock,   accent: sage  },
  { key: 'totalLeadsGenerated', label: 'Leads',             sub: 'Generados por contenido', icon: Rocket,   accent: 'hsl(210 80% 65%)' },
  { key: 'totalConversions',    label: 'Conversiones',      sub: 'Negocio atribuido',      icon: FileText, accent: 'hsl(158 42% 52%)' },
]

function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded animate-pulse bg-muted ${className}`} />
}

function formatDelta(current: number, previous: number) {
  if (previous === 0 && current === 0) return '0%'
  if (previous === 0) return '+100%'
  const delta = ((current - previous) / previous) * 100
  const rounded = Math.round(delta)
  return `${rounded > 0 ? '+' : ''}${rounded}%`
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [libraryItems, setLibraryItems] = useState<LibraryContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [queueActionId, setQueueActionId] = useState<string | null>(null)
  const [deliveryActionId, setDeliveryActionId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null)

  async function fetchMetrics() {
    await Promise.all([
      fetch('/api/metrics/dashboard')
        .then((r) => r.json())
        .then((data) => setMetrics(data.metrics ?? null))
        .catch(() => setMetrics(null)),
      fetch('/api/content/library?limit=40')
        .then((r) => r.json())
        .then((data) => setLibraryItems(data.items ?? []))
        .catch(() => setLibraryItems([])),
    ]).finally(() => setIsLoading(false))
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

  const filteredLibraryItems = useMemo(() => {
    return libraryItems.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesChannel = channelFilter === 'all' || item.contentType === channelFilter
      return matchesStatus && matchesChannel
    })
  }, [channelFilter, libraryItems, statusFilter])

  useEffect(() => {
    if (!filteredLibraryItems.length) {
      setSelectedContentId(null)
      return
    }

    const stillVisible = filteredLibraryItems.some((item) => item.id === selectedContentId)
    if (!stillVisible) {
      setSelectedContentId(filteredLibraryItems[0]?.id ?? null)
    }
  }, [filteredLibraryItems, selectedContentId])

  const selectedContent = filteredLibraryItems.find((item) => item.id === selectedContentId) ?? null

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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
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

            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Ejecución de publicaciones</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Último estado operativo de la cola programada y de las entregas ya ejecutadas.
              </p>
              {metrics?.deliveryQueue && metrics.deliveryQueue.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {metrics.deliveryQueue.map((item) => (
                    <SurfaceCard key={item.id} variant="inner" className="rounded-lg border bg-muted px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="text-xs">{item.platform}</Badge>
                        <Badge variant="outline" className="text-xs">{item.status}</Badge>
                      </div>
                      <p className="mt-3 text-sm font-medium text-foreground">{item.title}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>slot {new Date(item.scheduledFor).toLocaleString('es-ES')}</span>
                        {item.publishedAt ? <span>entregado {new Date(item.publishedAt).toLocaleString('es-ES')}</span> : null}
                        {item.platformPostId ? <span>{item.platformPostId}</span> : null}
                      </div>
                      {item.lastError ? (
                        <p className="mt-2 text-xs text-red-300">{item.lastError}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link href={`/dashboard/studio?contentId=${item.contentId}`}>
                          <Button size="sm" variant="outline">Abrir</Button>
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
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                    <Rocket className="h-6 w-6 text-muted-foreground/35" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Sin entregas operativas aún</p>
                  <p className="mt-1 text-xs text-muted-foreground/55 max-w-xs">
                    La cola de ejecución se activará cuando programes o entregues publicaciones desde Studio o Dashboard.
                  </p>
                </div>
              )}
            </SurfaceCard>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Alertas editoriales</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Puntos del pipeline que exigen una acción del operador.
              </p>
              {metrics?.editorialAlerts && metrics.editorialAlerts.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {metrics.editorialAlerts.map((alert) => (
                    <SurfaceCard
                      key={alert.id}
                      variant="inner"
                      className={[
                        'rounded-lg border px-4 py-3',
                        alert.tone === 'critical'
                          ? 'border-red-500/30 bg-red-500/10'
                          : alert.tone === 'warning'
                          ? 'bg-primary/5'
                          : 'bg-muted',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-2">
                        <TriangleAlert className="h-4 w-4 text-primary" />
                        <p className="font-medium text-foreground">{alert.title}</p>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{alert.description}</p>
                      <div className="mt-3">
                        <Link href={alert.href}>
                          <Button size="sm" variant="outline">{alert.hrefLabel}</Button>
                        </Link>
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                    <TriangleAlert className="h-6 w-6 text-muted-foreground/35" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Sin alertas operativas</p>
                  <p className="mt-1 text-xs text-muted-foreground/55 max-w-xs">
                    El pipeline está equilibrado y no hay cuellos de botella relevantes ahora mismo.
                  </p>
                </div>
              )}
            </SurfaceCard>

            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Micro-zonas</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Lectura territorial del impacto editorial y comercial.
              </p>
              {metrics?.microZonePerformance && metrics.microZonePerformance.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {metrics.microZonePerformance.map((zone) => (
                    <SurfaceCard key={zone.id} variant="inner" className="rounded-lg border bg-muted px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <MapPinned className="h-3.5 w-3.5 text-primary" />
                          <p className="font-medium text-foreground">{zone.name}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{zone.municipality}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <p>Piezas</p>
                          <p className="mt-1 font-semibold text-foreground">{zone.totalContent}</p>
                        </div>
                        <div>
                          <p>Leads</p>
                          <p className="mt-1 font-semibold text-foreground">{zone.leads}</p>
                        </div>
                        <div>
                          <p>Conv.</p>
                          <p className="mt-1 font-semibold text-foreground">{zone.conversions}</p>
                        </div>
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                    <MapPinned className="h-6 w-6 text-muted-foreground/35" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Sin telemetría por micro-zona</p>
                  <p className="mt-1 text-xs text-muted-foreground/55 max-w-xs">
                    Vincula nuevas piezas a zonas concretas desde Studio para cerrar la lectura hiperlocal.
                  </p>
                </div>
              )}
            </SurfaceCard>

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

          <div className="grid gap-4 md:grid-cols-2">
            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Momentum 7d vs 7d previos</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Comparativa para saber qué canal está acelerando negocio, no solo alcance.
              </p>
              {metrics?.platformMomentum && metrics.platformMomentum.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {metrics.platformMomentum.map((item) => (
                    <SurfaceCard key={item.platform} variant="inner" className="rounded-lg border bg-muted px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="text-xs">{item.platform}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Leads {formatDelta(item.leadsCurrent, item.leadsPrevious)}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <p>Views</p>
                          <p className="mt-1 font-semibold text-foreground">{item.viewsCurrent}</p>
                          <p className="mt-0.5">{formatDelta(item.viewsCurrent, item.viewsPrevious)}</p>
                        </div>
                        <div>
                          <p>Leads</p>
                          <p className="mt-1 font-semibold text-foreground">{item.leadsCurrent}</p>
                          <p className="mt-0.5">{formatDelta(item.leadsCurrent, item.leadsPrevious)}</p>
                        </div>
                        <div>
                          <p>Conv.</p>
                          <p className="mt-1 font-semibold text-foreground">{item.conversionsCurrent}</p>
                          <p className="mt-0.5">{formatDelta(item.conversionsCurrent, item.conversionsPrevious)}</p>
                        </div>
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                    <Clock className="h-6 w-6 text-muted-foreground/35" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Sin ventana comparativa todavía</p>
                  <p className="mt-1 text-xs text-muted-foreground/55 max-w-xs">
                    Necesitamos snapshots repartidos en el tiempo para detectar aceleración real por canal.
                  </p>
                </div>
              )}
            </SurfaceCard>

            <SurfaceCard variant="panel" className="p-6">
              <h3 className="font-heading text-sm font-semibold">Contenido que Mueve Negocio</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Separación entre piezas con mucho ruido y piezas que convierten interés en pipeline comercial.
              </p>
              {metrics?.businessImpactContent && metrics.businessImpactContent.length > 0 ? (
                <div className="mt-5 space-y-2">
                  {metrics.businessImpactContent.map((item) => (
                    <SurfaceCard key={`${item.id}-${item.platform}`} variant="inner" className="rounded-lg border bg-muted px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="text-xs">{item.platform}</Badge>
                        <Badge variant="outline" className="text-xs">{item.contentType}</Badge>
                      </div>
                      <p className="mt-3 text-sm font-medium text-foreground">{item.title}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>{item.leads} leads</span>
                        <span>{item.conversions} conv.</span>
                        <span>{(item.leadEfficiency * 100).toFixed(1)}% lead/view</span>
                        <span>{(item.conversionEfficiency * 100).toFixed(1)}% conv/click</span>
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                    <Rocket className="h-6 w-6 text-muted-foreground/35" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Sin impacto comercial visible aún</p>
                  <p className="mt-1 text-xs text-muted-foreground/55 max-w-xs">
                    Esta vista cobrará sentido cuando las piezas empiecen a acumular leads y conversiones persistidas.
                  </p>
                </div>
              )}
            </SurfaceCard>
          </div>
        </TabsContent>

        {/* ── Contenido ── */}
        <TabsContent value="content">
          <div className="grid gap-4 xl:grid-cols-[1.1fr_1.2fr_0.9fr]">
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
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-sm font-semibold">Detalle por Pieza</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Filtra, selecciona y lee tracción editorial sin salir de Metrics.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? 'all')}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={channelFilter} onValueChange={(value) => setChannelFilter(value ?? 'all')}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los canales</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-2">
                  {filteredLibraryItems.length > 0 ? (
                    filteredLibraryItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedContentId(item.id)}
                        className="block w-full text-left"
                      >
                        <SurfaceCard
                          variant="inner"
                          className={[
                            'rounded-lg border px-4 py-3 transition-colors',
                            selectedContentId === item.id
                              ? 'border-primary/40 bg-primary/5'
                              : 'bg-muted hover:border-primary/20 hover:bg-primary/5',
                          ].join(' ')}
                        >
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="text-xs">{item.contentType}</Badge>
                        <Badge variant="outline" className="text-xs">{item.status}</Badge>
                      </div>
                      {item.microZone ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {item.microZone.name} · {item.microZone.municipality}
                        </p>
                      ) : null}
                      <p className="mt-3 text-sm font-medium text-foreground">{item.title}</p>
                          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>{item.performance?.views ?? 0} views</span>
                            <span>{item.performance?.clicks ?? 0} clicks</span>
                            <span>{item.performance?.leadsGenerated ?? 0} leads</span>
                          </div>
                        </SurfaceCard>
                      </button>
                    ))
                  ) : (
                    <SurfaceCard variant="inner" className="rounded-lg border bg-muted px-4 py-6 text-center">
                      <p className="text-sm font-medium text-muted-foreground">Sin piezas para este filtro</p>
                      <p className="mt-1 text-xs text-muted-foreground/60">
                        Ajusta estado o canal para explorar otras piezas del pipeline.
                      </p>
                    </SurfaceCard>
                  )}
                </div>

                <SurfaceCard variant="inner" className="rounded-lg border bg-muted px-5 py-5">
                  {selectedContent ? (
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{selectedContent.contentType}</Badge>
                        <Badge variant="outline" className="text-xs">{selectedContent.status}</Badge>
                        {selectedContent.microZone ? (
                          <Badge variant="outline" className="text-xs">
                            {selectedContent.microZone.name}
                          </Badge>
                        ) : null}
                        {selectedContent.scheduledFor ? (
                          <Badge variant="outline" className="text-xs">
                            {new Date(selectedContent.scheduledFor).toLocaleString('es-ES')}
                          </Badge>
                        ) : null}
                      </div>

                      <h4 className="mt-4 font-heading text-xl font-semibold text-foreground">
                        {selectedContent.title}
                      </h4>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          { label: 'Views', value: selectedContent.performance?.views ?? 0 },
                          { label: 'Clicks', value: selectedContent.performance?.clicks ?? 0 },
                          { label: 'Leads', value: selectedContent.performance?.leadsGenerated ?? 0 },
                          { label: 'Conversiones', value: selectedContent.performance?.conversions ?? 0 },
                          { label: 'Lead tracking', value: selectedContent.performance?.leadsTracked ?? 0 },
                          { label: 'ER', value: `${((selectedContent.performance?.engagementRate ?? 0) * 100).toFixed(1)}%` },
                        ].map((item) => (
                          <SurfaceCard key={item.label} variant="inner" className="rounded-lg border bg-background/70 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                            <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
                          </SurfaceCard>
                        ))}
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <SurfaceCard variant="inner" className="rounded-lg border bg-background/70 px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Timeline editorial</p>
                          <div className="mt-3 space-y-3 text-xs text-muted-foreground">
                            <div className="flex items-center justify-between gap-3">
                              <span>Creado</span>
                              <span>{new Date(selectedContent.createdAt).toLocaleString('es-ES')}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span>Última actualización</span>
                              <span>{new Date(selectedContent.updatedAt).toLocaleString('es-ES')}</span>
                            </div>
                            {selectedContent.scheduledFor ? (
                              <div className="flex items-center justify-between gap-3">
                                <span>Programado</span>
                                <span>{new Date(selectedContent.scheduledFor).toLocaleString('es-ES')}</span>
                              </div>
                            ) : null}
                            {selectedContent.publishedAt ? (
                              <div className="flex items-center justify-between gap-3">
                                <span>Publicado</span>
                                <span>{new Date(selectedContent.publishedAt).toLocaleString('es-ES')}</span>
                              </div>
                            ) : null}
                          </div>
                        </SurfaceCard>

                        <SurfaceCard variant="inner" className="rounded-lg border bg-background/70 px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Lead attribution</p>
                          <div className="mt-3 space-y-3 text-xs text-muted-foreground">
                            {[
                              { label: 'New', value: selectedContent.performance?.leadStatus?.new ?? 0 },
                              { label: 'Contacted', value: selectedContent.performance?.leadStatus?.contacted ?? 0 },
                              { label: 'Qualified', value: selectedContent.performance?.leadStatus?.qualified ?? 0 },
                              { label: 'Lost', value: selectedContent.performance?.leadStatus?.lost ?? 0 },
                            ].map((item) => (
                              <div key={item.label} className="flex items-center justify-between gap-3">
                                <span>{item.label}</span>
                                <span className="font-medium text-foreground">{item.value}</span>
                              </div>
                            ))}
                            <div className="border-t border-border/70 pt-3">
                              <div className="flex items-center justify-between gap-3">
                                <span>Score A / B / C</span>
                                <span className="font-medium text-foreground">
                                  {(selectedContent.performance?.leadScore?.A ?? 0)} / {(selectedContent.performance?.leadScore?.B ?? 0)} / {(selectedContent.performance?.leadScore?.C ?? 0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </SurfaceCard>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={`/dashboard/studio?contentId=${selectedContent.id}`}>
                          <Button size="sm" variant="outline">Abrir en Studio</Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                      <p className="text-sm font-medium text-muted-foreground">Selecciona una pieza</p>
                      <p className="mt-1 text-xs text-muted-foreground/60 max-w-xs">
                        Aquí verás su lectura resumida de rendimiento, señales de lead y estado editorial.
                      </p>
                    </div>
                  )}
                </SurfaceCard>
              </div>
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

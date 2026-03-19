'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, FileText, Rocket, BookOpen, Layers, Clock } from 'lucide-react'

interface DashboardMetrics {
  totalContent: number
  publishedContent: number
  draftContent: number
  avgTokensUsed: number
  totalKnowledgeChunks: number
  contentByType?: Record<string, number>
  recentActivity?: Array<{ date: string; count: number }>
}

const workspaceId = '00000000-0000-0000-0000-000000000000'

const amber = 'hsl(38 92% 55%)'
const sage  = 'hsl(158 42% 45%)'

const KPI_CARDS = [
  { key: 'totalContent',        label: 'Contenido Total',   sub: 'Piezas generadas',       icon: FileText, accent: amber },
  { key: 'publishedContent',    label: 'Publicado',         sub: 'Del total generado',     icon: Rocket,   accent: sage  },
  { key: 'draftContent',        label: 'Borradores',        sub: 'Pendientes de publicar', icon: Layers,   accent: amber },
  { key: 'totalKnowledgeChunks',label: 'Knowledge Chunks',  sub: 'En la base de datos',    icon: BookOpen, accent: sage  },
]

function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded animate-pulse bg-muted ${className}`} />
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/metrics/dashboard?workspaceId=${workspaceId}`)
      .then((r) => r.json())
      .then((data) => setMetrics(data.metrics ?? null))
      .catch(() => setMetrics(null))
      .finally(() => setIsLoading(false))
  }, [])

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
            <div
              key={key}
              className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg overflow-hidden"
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
            </div>
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
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-heading text-sm font-semibold">Estado del Contenido</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Distribución por estado de publicación
              </p>
              <div className="mt-5 space-y-4">
                {[
                  { label: 'Publicado', value: metrics?.publishedContent ?? 0, accent: sage  },
                  { label: 'Borrador',  value: metrics?.draftContent ?? 0,      accent: amber },
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
            </div>

            {/* Content types */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-heading text-sm font-semibold">Tipos de Contenido</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Distribución por tipo generado
              </p>
              <div className="mt-5">
                {metrics?.contentByType && Object.keys(metrics.contentByType).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(metrics.contentByType).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-2"
                      >
                        <Badge variant="secondary" className="text-xs">{type}</Badge>
                        <span className="font-heading text-sm font-semibold" style={{ color: amber }}>{count}</span>
                      </div>
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
            </div>
          </div>
        </TabsContent>

        {/* ── Contenido ── */}
        <TabsContent value="content">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading text-sm font-semibold">Actividad Reciente</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Contenido generado en los últimos 7 días
            </p>
            {metrics?.recentActivity && metrics.recentActivity.length > 0 ? (
              <div className="mt-5 space-y-2">
                {metrics.recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-2.5"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{activity.date}</span>
                    </div>
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: `${amber}18`,
                        color: 'hsl(38 92% 62%)',
                        border: `1px solid ${amber}35`,
                      }}
                    >
                      {activity.count} piezas
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                  <Clock className="h-6 w-6 text-muted-foreground/35" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Sin actividad reciente</p>
                <p className="mt-1 text-xs text-muted-foreground/55 max-w-xs">
                  Cuando generes contenido aparecerá aquí el historial de los últimos 7 días
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── RAG ── */}
        <TabsContent value="rag">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading text-sm font-semibold">Base de Conocimiento</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Estadísticas del RAG engine
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {/* Chunks hero stat */}
              <div
                className="col-span-full rounded-xl border p-5 flex items-center justify-between"
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
              </div>

              {[
                { label: 'Dimensiones embedding',  value: '384' },
                { label: 'Modelo embeddings',      value: 'all-MiniLM-L6-v2' },
                { label: 'Vector search engine',   value: 'pgvector' },
                { label: 'Similarity threshold',   value: '0.7' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3"
                >
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="font-mono text-xs font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * ANCLORA CONTENT GENERATOR AI - Metrics Dashboard
 * Feature: ANCLORA-FEAT-DASHBOARD-UI
 * Page: /dashboard/metrics
 * Description: Dashboard de analytics y métricas de uso
 * Author: Agent C (Frontend Engineer)
 * Date: 2026-03-19
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DashboardMetrics {
  totalContent: number
  publishedContent: number
  draftContent: number
  avgTokensUsed: number
  totalKnowledgeChunks: number
  contentByType?: Record<string, number>
  recentActivity?: Array<{
    date: string
    count: number
  }>
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock workspace ID
  const workspaceId = '00000000-0000-0000-0000-000000000000'

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/metrics/dashboard?workspaceId=${workspaceId}`)

        if (!response.ok) {
          throw new Error('Error fetching metrics')
        }

        const data = await response.json()
        setMetrics(data.metrics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [workspaceId])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Cargando métricas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
          <p className="text-sm text-destructive font-medium">Error</p>
          <p className="text-sm text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Métricas de uso y rendimiento de tu contenido
          </p>
        </div>
        <Badge variant="outline" className="h-6">
          En tiempo real
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contenido Total
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalContent || 0}</div>
            <p className="text-xs text-muted-foreground">
              Piezas generadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Publicado
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.publishedContent || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.totalContent ?
                `${Math.round((metrics.publishedContent / metrics.totalContent) * 100)}% del total` :
                '0% del total'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Borradores
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.draftContent || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pendientes de publicar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tokens Promedio
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics?.avgTokensUsed || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Por pieza de contenido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="rag">Base de Conocimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estado del Contenido</CardTitle>
                <CardDescription>
                  Distribución por estado de publicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Publicado</span>
                    </div>
                    <span className="text-sm font-medium">{metrics?.publishedContent || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Borrador</span>
                    </div>
                    <span className="text-sm font-medium">{metrics?.draftContent || 0}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${metrics?.totalContent ?
                          (metrics.publishedContent / metrics.totalContent) * 100 :
                          0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Contenido</CardTitle>
                <CardDescription>
                  Distribución por tipo de contenido generado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {metrics?.contentByType ? (
                  Object.entries(metrics.contentByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <Badge variant="secondary">{type}</Badge>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay datos disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Contenido generado en los últimos 7 días
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics?.recentActivity && metrics.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {metrics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{activity.date}</span>
                      <Badge variant="outline">{activity.count} piezas</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay actividad reciente
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rag" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Base de Conocimiento</CardTitle>
              <CardDescription>
                Estadísticas de tu knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Chunks Almacenados</p>
                  <p className="text-2xl font-bold">{metrics?.totalKnowledgeChunks || 0}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-8 w-8 text-muted-foreground"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" x2="12" y1="22" y2="12" />
                </svg>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dimensiones de embedding</span>
                  <span className="font-medium">384</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Modelo de embeddings</span>
                  <span className="font-medium">all-MiniLM-L6-v2</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vector search engine</span>
                  <span className="font-medium">pgvector</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

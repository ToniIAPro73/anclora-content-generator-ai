/**
 * ANCLORA CONTENT GENERATOR AI - Dashboard Home
 * Feature: ANCLORA-FEAT-DASHBOARD-UI
 * Page: /dashboard
 * Description: Overview principal del dashboard con estadísticas y accesos rápidos
 * Author: Agent C (Frontend Engineer)
 * Date: 2026-03-19
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DashboardMetrics {
  totalContent: number
  publishedContent: number
  draftContent: number
  avgTokensUsed: number
  totalKnowledgeChunks: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const workspaceId = '00000000-0000-0000-0000-000000000000'

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/metrics/dashboard?workspaceId=${workspaceId}`)
        if (response.ok) {
          const data = await response.json()
          setMetrics(data.metrics)
        }
      } catch (error) {
        console.error('Error fetching metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [workspaceId])

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido a Anclora Content Generator AI
          </p>
        </div>
        <Link href="/dashboard/studio">
          <Button size="lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="mr-2 h-4 w-4"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Crear Contenido
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contenido</CardTitle>
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
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics?.totalContent || 0}</div>
                <p className="text-xs text-muted-foreground">Piezas generadas</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicado</CardTitle>
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
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics?.publishedContent || 0}</div>
                <p className="text-xs text-muted-foreground">Contenido activo</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
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
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics?.draftContent || 0}</div>
                <p className="text-xs text-muted-foreground">En progreso</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
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
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics?.totalKnowledgeChunks || 0}</div>
                <p className="text-xs text-muted-foreground">Chunks almacenados</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/studio">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <div>
                  <CardTitle>Content Studio</CardTitle>
                  <CardDescription>Genera contenido con IA</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crea contenido de alta calidad usando plantillas y RAG
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/rag">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-6 w-6 text-blue-500"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.29 7 12 12 20.71 7" />
                    <line x1="12" x2="12" y1="22" y2="12" />
                  </svg>
                </div>
                <div>
                  <CardTitle>Knowledge Base</CardTitle>
                  <CardDescription>Gestiona tu RAG</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ingesta documentos y construye tu base de conocimiento
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/dashboard/metrics">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-6 w-6 text-green-500"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <div>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>Métricas y estadísticas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualiza el rendimiento y uso de tu contenido
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Características Principales</CardTitle>
          <CardDescription>
            Todo lo que necesitas para generar contenido de calidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5 text-primary"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">RAG Engine</h3>
                <p className="text-sm text-muted-foreground">
                  Embeddings locales con pgvector para búsqueda semántica
                </p>
                <Badge variant="secondary" className="text-xs">Zero-cost</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5 text-blue-500"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Multi-LLM Support</h3>
                <p className="text-sm text-muted-foreground">
                  Claude, Groq, Ollama - elige el modelo perfecto
                </p>
                <Badge variant="secondary" className="text-xs">Flexible</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5 text-green-500"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Content Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Plantillas reutilizables con prompts personalizados
                </p>
                <Badge variant="secondary" className="text-xs">Reusable</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5 text-purple-500"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Micro-Zones</h3>
                <p className="text-sm text-muted-foreground">
                  Segmentación geográfica para contenido localizado
                </p>
                <Badge variant="secondary" className="text-xs">Geo-targeted</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Primeros Pasos</CardTitle>
          <CardDescription>
            Empieza a generar contenido en minutos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div className="space-y-1">
                <p className="text-sm font-medium">Configura tus API keys</p>
                <p className="text-sm text-muted-foreground">
                  Ve a{' '}
                  <Link href="/dashboard/settings" className="underline">
                    Settings
                  </Link>{' '}
                  y añade tus claves de Anthropic, Groq u Ollama
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div className="space-y-1">
                <p className="text-sm font-medium">Ingesta tu base de conocimiento</p>
                <p className="text-sm text-muted-foreground">
                  Sube documentos en{' '}
                  <Link href="/dashboard/rag" className="underline">
                    Knowledge Base
                  </Link>{' '}
                  para enriquecer el contexto
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div className="space-y-1">
                <p className="text-sm font-medium">Genera tu primer contenido</p>
                <p className="text-sm text-muted-foreground">
                  Usa{' '}
                  <Link href="/dashboard/studio" className="underline">
                    Content Studio
                  </Link>{' '}
                  para crear contenido con IA
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

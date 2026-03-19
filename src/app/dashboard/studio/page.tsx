/**
 * ANCLORA CONTENT GENERATOR AI - Content Studio
 * Feature: ANCLORA-FEAT-DASHBOARD-UI
 * Page: /dashboard/studio
 * Description: Interfaz principal para generar contenido con IA + RAG
 * Author: Agent C (Frontend Engineer)
 * Date: 2026-03-19
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface GeneratedContent {
  id: string
  title: string
  content: string
  contentType: string
  status: string
}

interface GenerationMetadata {
  tokensUsed: number
  modelUsed: string
  executionTimeMs: number
  ragUsed: boolean
  chunksRetrieved?: number
}

export default function StudioPage() {
  const [title, setTitle] = useState('')
  const [contentType, setContentType] = useState<string>('blog_post')
  const [templateId, setTemplateId] = useState<string>('')
  const [microZoneId, setMicroZoneId] = useState<string>('')
  const [ragQuery, setRagQuery] = useState('')
  const [userContext, setUserContext] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [metadata, setMetadata] = useState<GenerationMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Mock workspace ID (en producción vendría de Auth)
  const workspaceId = '00000000-0000-0000-0000-000000000000'

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedContent(null)
    setMetadata(null)

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          title,
          contentType,
          templateId: templateId || undefined,
          microZoneId: microZoneId || undefined,
          ragQuery: ragQuery || undefined,
          userContext: userContext || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error generating content')
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      setMetadata(data.metadata)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Studio</h1>
          <p className="text-muted-foreground">
            Genera contenido de alta calidad con IA y conocimiento contextual
          </p>
        </div>
        <Badge variant="outline" className="h-6">
          AI-Powered
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>
                Define los parámetros para generar tu contenido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Título del contenido</Label>
                <Input
                  id="title"
                  placeholder="Ej: Guía completa de Next.js 15"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Content Type */}
              <div className="space-y-2">
                <Label htmlFor="contentType">Tipo de contenido</Label>
                <Select value={contentType} onValueChange={(value) => value && setContentType(value)}>
                  <SelectTrigger id="contentType">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog_post">Blog Post</SelectItem>
                    <SelectItem value="social_post">Social Media Post</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="landing_page">Landing Page</SelectItem>
                    <SelectItem value="product_description">Product Description</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Template */}
              <div className="space-y-2">
                <Label htmlFor="template">Plantilla (opcional)</Label>
                <Select value={templateId} onValueChange={(value) => setTemplateId(value || '')}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Sin plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin plantilla</SelectItem>
                    <SelectItem value="template-1">SEO Blog Post</SelectItem>
                    <SelectItem value="template-2">Technical Article</SelectItem>
                    <SelectItem value="template-3">Social Media Thread</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Micro Zone */}
              <div className="space-y-2">
                <Label htmlFor="microZone">Micro-zona (opcional)</Label>
                <Select value={microZoneId} onValueChange={(value) => setMicroZoneId(value || '')}>
                  <SelectTrigger id="microZone">
                    <SelectValue placeholder="Sin micro-zona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin micro-zona</SelectItem>
                    <SelectItem value="zone-1">Madrid Centro</SelectItem>
                    <SelectItem value="zone-2">Barcelona Eixample</SelectItem>
                    <SelectItem value="zone-3">Valencia Ciudad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contexto y RAG</CardTitle>
              <CardDescription>
                Usa tu base de conocimiento para generar contenido más preciso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* RAG Query */}
              <div className="space-y-2">
                <Label htmlFor="ragQuery">Consulta RAG (opcional)</Label>
                <Input
                  id="ragQuery"
                  placeholder="Ej: características de Next.js 15"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Busca en tu base de conocimiento para contexto adicional
                </p>
              </div>

              {/* User Context */}
              <div className="space-y-2">
                <Label htmlFor="userContext">Contexto adicional</Label>
                <Textarea
                  id="userContext"
                  placeholder="Agrega detalles específicos, tono, estilo, público objetivo..."
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !title}
            className="w-full"
            size="lg"
          >
            {isGenerating ? 'Generando...' : 'Generar Contenido'}
          </Button>
        </div>

        {/* Right Panel - Results */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>
                El contenido generado aparecerá aquí
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground">
                      Generando contenido con IA...
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
                  <p className="text-sm text-destructive font-medium">Error</p>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
              )}

              {generatedContent && (
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Contenido</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input value={generatedContent.title} readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label>Contenido generado</Label>
                      <Textarea
                        value={generatedContent.content}
                        readOnly
                        rows={15}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {generatedContent.contentType}
                      </Badge>
                      <Badge variant={generatedContent.status === 'draft' ? 'outline' : 'default'}>
                        {generatedContent.status}
                      </Badge>
                    </div>
                  </TabsContent>

                  <TabsContent value="metadata" className="space-y-4">
                    {metadata && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Modelo</p>
                            <p className="text-sm font-medium">{metadata.modelUsed}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Tokens</p>
                            <p className="text-sm font-medium">{metadata.tokensUsed}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Tiempo (ms)</p>
                            <p className="text-sm font-medium">{metadata.executionTimeMs}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">RAG usado</p>
                            <p className="text-sm font-medium">
                              {metadata.ragUsed ? 'Sí' : 'No'}
                            </p>
                          </div>
                          {metadata.chunksRetrieved !== undefined && (
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Chunks recuperados</p>
                              <p className="text-sm font-medium">{metadata.chunksRetrieved}</p>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-xs text-muted-foreground">
                            ID: {generatedContent.id}
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}

              {!isGenerating && !error && !generatedContent && (
                <div className="flex items-center justify-center h-64">
                  <p className="text-sm text-muted-foreground text-center">
                    Configura los parámetros y haz clic en
                    <br />
                    &quot;Generar Contenido&quot; para comenzar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

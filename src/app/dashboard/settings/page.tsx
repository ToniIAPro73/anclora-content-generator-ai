/**
 * ANCLORA CONTENT GENERATOR AI - Settings
 * Feature: ANCLORA-FEAT-DASHBOARD-UI
 * Page: /dashboard/settings
 * Description: Configuración de templates, LLM providers y preferencias
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

export default function SettingsPage() {
  // Template Settings
  const [templateName, setTemplateName] = useState('')
  const [templateType, setTemplateType] = useState('blog_post')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [temperature, setTemperature] = useState('0.7')
  const [topP, setTopP] = useState('0.9')

  // LLM Provider Settings
  const [defaultProvider, setDefaultProvider] = useState('anthropic')
  const [defaultModel, setDefaultModel] = useState('claude-3-5-sonnet-20241022')
  const [anthropicKey, setAnthropicKey] = useState('')
  const [groqKey, setGroqKey] = useState('')

  // Workspace Settings
  const [workspaceName, setWorkspaceName] = useState('Mi Workspace')
  const [workspaceDescription, setWorkspaceDescription] = useState('')

  const handleSaveTemplate = () => {
    // TODO: Implement save template logic
    console.log('Saving template...', {
      templateName,
      templateType,
      systemPrompt,
      temperature,
      topP,
    })
    alert('Plantilla guardada (funcionalidad pendiente)')
  }

  const handleSaveProvider = () => {
    // TODO: Implement save provider settings
    console.log('Saving provider settings...', {
      defaultProvider,
      defaultModel,
    })
    alert('Configuración de LLM guardada (funcionalidad pendiente)')
  }

  const handleSaveWorkspace = () => {
    // TODO: Implement save workspace settings
    console.log('Saving workspace settings...', {
      workspaceName,
      workspaceDescription,
    })
    alert('Configuración de workspace guardada (funcionalidad pendiente)')
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona plantillas, modelos de IA y preferencias del workspace
          </p>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="llm">Modelos de IA</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nueva Plantilla</CardTitle>
              <CardDescription>
                Define plantillas reutilizables con prompts y configuración personalizada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Nombre de la plantilla</Label>
                  <Input
                    id="templateName"
                    placeholder="Ej: SEO Blog Post"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateType">Tipo de contenido</Label>
                  <Select value={templateType} onValueChange={(value) => value && setTemplateType(value)}>
                    <SelectTrigger id="templateType">
                      <SelectValue />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  placeholder="Ej: Eres un experto copywriter SEO especializado en..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Define el comportamiento y expertise del modelo de IA
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mayor = más creativo (0.0 - 1.0)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topP">Top P</Label>
                  <Input
                    id="topP"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={topP}
                    onChange={(e) => setTopP(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nucleus sampling (0.0 - 1.0)
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveTemplate} className="w-full">
                Guardar Plantilla
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plantillas Existentes</CardTitle>
              <CardDescription>
                Gestiona tus plantillas guardadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">SEO Blog Post</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">blog_post</Badge>
                    <span className="text-xs text-muted-foreground">
                      Temperature: 0.7
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Technical Article</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">blog_post</Badge>
                    <span className="text-xs text-muted-foreground">
                      Temperature: 0.5
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Social Media Thread</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">social_post</Badge>
                    <span className="text-xs text-muted-foreground">
                      Temperature: 0.9
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LLM Providers Tab */}
        <TabsContent value="llm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Modelos</CardTitle>
              <CardDescription>
                Configura tus proveedores de IA y modelos por defecto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultProvider">Proveedor por defecto</Label>
                  <Select value={defaultProvider} onValueChange={(value) => value && setDefaultProvider(value)}>
                    <SelectTrigger id="defaultProvider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                      <SelectItem value="groq">Groq</SelectItem>
                      <SelectItem value="ollama">Ollama (Local)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultModel">Modelo por defecto</Label>
                  <Select value={defaultModel} onValueChange={(value) => value && setDefaultModel(value)}>
                    <SelectTrigger id="defaultModel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultProvider === 'anthropic' && (
                        <>
                          <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                          <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                          <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                        </>
                      )}
                      {defaultProvider === 'groq' && (
                        <>
                          <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                          <SelectItem value="llama2-70b-4096">Llama 2 70B</SelectItem>
                        </>
                      )}
                      {defaultProvider === 'ollama' && (
                        <>
                          <SelectItem value="llama3">Llama 3</SelectItem>
                          <SelectItem value="mistral">Mistral</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveProvider} className="w-full">
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Configura tus claves de API para cada proveedor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="anthropicKey">Anthropic API Key</Label>
                  <Badge variant={anthropicKey ? 'default' : 'secondary'}>
                    {anthropicKey ? 'Configurada' : 'No configurada'}
                  </Badge>
                </div>
                <Input
                  id="anthropicKey"
                  type="password"
                  placeholder="sk-ant-..."
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Obtén tu clave en{' '}
                  <a
                    href="https://console.anthropic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    console.anthropic.com
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="groqKey">Groq API Key</Label>
                  <Badge variant={groqKey ? 'default' : 'secondary'}>
                    {groqKey ? 'Configurada' : 'No configurada'}
                  </Badge>
                </div>
                <Input
                  id="groqKey"
                  type="password"
                  placeholder="gsk_..."
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Obtén tu clave en{' '}
                  <a
                    href="https://console.groq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    console.groq.com
                  </a>
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-5 w-5 text-muted-foreground mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Seguridad</p>
                    <p className="text-xs text-muted-foreground">
                      Las API keys se almacenan de forma segura y nunca se comparten.
                      También puedes usar variables de entorno en producción.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workspace Tab */}
        <TabsContent value="workspace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Workspace</CardTitle>
              <CardDescription>
                Configura los detalles de tu espacio de trabajo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspaceName">Nombre del Workspace</Label>
                <Input
                  id="workspaceName"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspaceDescription">Descripción</Label>
                <Textarea
                  id="workspaceDescription"
                  placeholder="Describe el propósito de este workspace..."
                  value={workspaceDescription}
                  onChange={(e) => setWorkspaceDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={handleSaveWorkspace} className="w-full">
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferencias de RAG</CardTitle>
              <CardDescription>
                Configuración de la base de conocimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chunkSize">Tamaño de chunk</Label>
                <Input
                  id="chunkSize"
                  type="number"
                  defaultValue="512"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Tokens por chunk (actualmente fijo en 512)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topK">Top K resultados</Label>
                <Input
                  id="topK"
                  type="number"
                  defaultValue="5"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Número de chunks a recuperar (actualmente fijo en 5)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="similarityThreshold">Similarity Threshold</Label>
                <Input
                  id="similarityThreshold"
                  type="number"
                  step="0.1"
                  defaultValue="0.7"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Umbral de similitud mínima (0.0 - 1.0)
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  Configuración avanzada de RAG próximamente disponible
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

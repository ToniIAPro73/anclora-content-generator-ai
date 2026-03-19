'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff, Shield, Cpu, LayoutTemplate, Building2, CheckCircle2 } from 'lucide-react'

/* Reusable section card with amber left-stripe accent */
function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  accentColor = 'hsl(38 92% 55%)',
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
  accentColor?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header row with left stripe */}
      <div
        className="flex items-start gap-3 px-6 py-4 border-b border-border"
        style={{ borderLeft: `3px solid ${accentColor}` }}
      >
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg mt-0.5"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

/* Plain section card without icon header */
function PlainCard({ title, description, children }: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-heading text-sm font-semibold">{title}</h3>
      <p className="mt-0.5 mb-5 text-xs text-muted-foreground">{description}</p>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [templateName, setTemplateName] = useState('')
  const [templateType, setTemplateType] = useState('blog_post')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [temperature, setTemperature] = useState('0.7')
  const [topP, setTopP] = useState('0.9')

  const [defaultProvider, setDefaultProvider] = useState('anthropic')
  const [defaultModel, setDefaultModel] = useState('claude-3-5-sonnet-20241022')
  const [anthropicKey, setAnthropicKey] = useState('')
  const [groqKey, setGroqKey] = useState('')
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)

  const [workspaceName, setWorkspaceName] = useState('Mi Workspace')
  const [workspaceDescription, setWorkspaceDescription] = useState('')

  const [savedMsg, setSavedMsg] = useState('')

  function showSaved(msg: string) {
    setSavedMsg(msg)
    setTimeout(() => setSavedMsg(''), 2500)
  }

  const existingTemplates = [
    { name: 'SEO Blog Post', type: 'blog_post', temp: 0.7 },
    { name: 'Technical Article', type: 'blog_post', temp: 0.5 },
    { name: 'Social Media Thread', type: 'social_post', temp: 0.9 },
  ]

  const amber = 'hsl(38 92% 55%)'
  const sage = 'hsl(158 42% 45%)'

  return (
    <div className="space-y-6 p-1">

      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona plantillas, modelos de IA y preferencias del workspace
          </p>
        </div>
        {savedMsg && (
          <div
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
            style={{
              backgroundColor: `${sage}12`,
              borderColor: `${sage}30`,
              color: sage,
            }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {savedMsg}
          </div>
        )}
      </div>

      <Tabs defaultValue="templates" className="space-y-5">
        <TabsList className="border border-border bg-muted/60 h-9">
          {[
            { value: 'templates', label: 'Plantillas', icon: LayoutTemplate },
            { value: 'llm', label: 'Modelos de IA', icon: Cpu },
            { value: 'workspace', label: 'Workspace', icon: Building2 },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Templates Tab ── */}
        <TabsContent value="templates" className="space-y-4">
          <SectionCard
            icon={LayoutTemplate}
            title="Nueva Plantilla"
            description="Define prompts reutilizables con configuración personalizada"
            accentColor={amber}
          >
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="templateName" className="text-xs font-medium text-muted-foreground">
                    Nombre de la plantilla
                  </Label>
                  <Input
                    id="templateName"
                    placeholder="Ej: SEO Blog Post"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="templateType" className="text-xs font-medium text-muted-foreground">
                    Tipo de contenido
                  </Label>
                  <Select value={templateType} onValueChange={(v) => v && setTemplateType(v)}>
                    <SelectTrigger id="templateType" className="h-9 text-sm">
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

              <div className="space-y-1.5">
                <Label htmlFor="systemPrompt" className="text-xs font-medium text-muted-foreground">
                  System Prompt
                </Label>
                <Textarea
                  id="systemPrompt"
                  placeholder="Ej: Eres un experto copywriter SEO especializado en..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={5}
                  className="resize-none text-sm"
                />
                <p className="text-xs text-muted-foreground/60">
                  Define el comportamiento y expertise del modelo de IA
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { id: 'temperature', label: 'Temperature', value: temperature, setter: setTemperature, hint: 'Mayor = más creativo (0.0 – 1.0)' },
                  { id: 'topP', label: 'Top P', value: topP, setter: setTopP, hint: 'Nucleus sampling (0.0 – 1.0)' },
                ].map(({ id, label, value, setter, hint }) => (
                  <div key={id} className="space-y-1.5">
                    <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
                      {label}
                    </Label>
                    <Input
                      id={id}
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="h-9 text-sm"
                    />
                    <p className="text-xs text-muted-foreground/55">{hint}</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => showSaved('Plantilla guardada')}
                className="w-full font-semibold"
              >
                Guardar Plantilla
              </Button>
            </div>
          </SectionCard>

          {/* Existing templates */}
          <PlainCard title="Plantillas Existentes" description="Gestiona tus plantillas guardadas">
            <div className="space-y-2">
              {existingTemplates.map(({ name, type, temp }) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3 transition-colors hover:border-primary/25"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${amber}14`, color: amber }}
                    >
                      <LayoutTemplate className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-xs h-4">{type}</Badge>
                        <span className="text-xs text-muted-foreground">temp: {temp}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Editar
                  </Button>
                </div>
              ))}
            </div>
          </PlainCard>
        </TabsContent>

        {/* ── LLM Tab ── */}
        <TabsContent value="llm" className="space-y-4">
          <SectionCard
            icon={Cpu}
            title="Configuración de Modelos"
            description="Proveedores de IA y modelos por defecto"
            accentColor={amber}
          >
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Proveedor por defecto
                  </Label>
                  <Select value={defaultProvider} onValueChange={(v) => v && setDefaultProvider(v)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                      <SelectItem value="groq">Groq</SelectItem>
                      <SelectItem value="ollama">Ollama (Local)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Modelo por defecto
                  </Label>
                  <Select value={defaultModel} onValueChange={(v) => v && setDefaultModel(v)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultProvider === 'anthropic' && (
                        <>
                          <SelectItem value="claude-sonnet-4-6">Claude Sonnet 4.6</SelectItem>
                          <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
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

              <Button
                onClick={() => showSaved('Configuración LLM guardada')}
                className="w-full font-semibold"
              >
                Guardar Configuración
              </Button>
            </div>
          </SectionCard>

          {/* API Keys */}
          <PlainCard title="API Keys" description="Claves de acceso para cada proveedor">
            <div className="space-y-5">
              {[
                {
                  id: 'anthropicKey',
                  label: 'Anthropic API Key',
                  value: anthropicKey,
                  setter: setAnthropicKey,
                  show: showAnthropicKey,
                  toggleShow: () => setShowAnthropicKey((p) => !p),
                  placeholder: 'sk-ant-...',
                },
                {
                  id: 'groqKey',
                  label: 'Groq API Key',
                  value: groqKey,
                  setter: setGroqKey,
                  show: showGroqKey,
                  toggleShow: () => setShowGroqKey((p) => !p),
                  placeholder: 'gsk_...',
                },
              ].map(({ id, label, value, setter, show, toggleShow, placeholder }) => (
                <div key={id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
                      {label}
                    </Label>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                      style={
                        value
                          ? {
                              backgroundColor: `${sage}12`,
                              borderColor: `${sage}30`,
                              color: sage,
                            }
                          : {
                              backgroundColor: 'hsl(20 12% 13%)',
                              borderColor: 'hsl(20 10% 18%)',
                              color: 'hsl(20 8% 48%)',
                            }
                      }
                    >
                      {value ? 'Configurada' : 'No configurada'}
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id={id}
                      type={show ? 'text' : 'password'}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="h-9 pr-9 text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={toggleShow}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              ))}

              {/* Security note */}
              <div
                className="flex items-start gap-3 rounded-lg border p-3"
                style={{
                  backgroundColor: `${amber}08`,
                  borderColor: `${amber}20`,
                }}
              >
                <Shield
                  className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
                  style={{ color: amber }}
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Las API keys se almacenan de forma segura y nunca se comparten.
                  En producción usa variables de entorno.
                </p>
              </div>
            </div>
          </PlainCard>
        </TabsContent>

        {/* ── Workspace Tab ── */}
        <TabsContent value="workspace" className="space-y-4">
          <SectionCard
            icon={Building2}
            title="Información del Workspace"
            description="Configura los detalles de tu espacio de trabajo"
            accentColor={sage}
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="workspaceName" className="text-xs font-medium text-muted-foreground">
                  Nombre del Workspace
                </Label>
                <Input
                  id="workspaceName"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="workspaceDescription" className="text-xs font-medium text-muted-foreground">
                  Descripción
                </Label>
                <Textarea
                  id="workspaceDescription"
                  placeholder="Describe el propósito de este workspace..."
                  value={workspaceDescription}
                  onChange={(e) => setWorkspaceDescription(e.target.value)}
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>
              <Button
                onClick={() => showSaved('Workspace guardado')}
                className="w-full font-semibold"
              >
                Guardar Cambios
              </Button>
            </div>
          </SectionCard>

          {/* RAG Settings */}
          <PlainCard
            title="Preferencias de RAG"
            description="Configuración del motor de conocimiento"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Chunk size', value: '512', unit: 'tokens' },
                { label: 'Top K resultados', value: '5', unit: 'chunks' },
                { label: 'Similarity threshold', value: '0.7', unit: 'score' },
              ].map(({ label, value, unit }) => (
                <div
                  key={label}
                  className="rounded-lg border border-border bg-muted p-4"
                >
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p
                    className="mt-1.5 font-heading text-2xl font-bold"
                    style={{ color: sage }}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground/55">{unit}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground/45">
              Configuración avanzada de RAG próximamente disponible
            </p>
          </PlainCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

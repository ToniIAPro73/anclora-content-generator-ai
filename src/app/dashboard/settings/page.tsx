'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Bot,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LayoutTemplate,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Workflow,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SurfaceCard } from '@/components/ui/surface-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

function StatusPill({
  label,
  tone = 'neutral',
}: {
  label: string
  tone?: 'neutral' | 'good' | 'warning'
}) {
  const toneClass =
    tone === 'good'
      ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
      : tone === 'warning'
      ? 'border-amber-500/25 bg-amber-500/10 text-amber-200'
      : 'border-border bg-muted text-muted-foreground'

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClass}`}>{label}</span>
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper: string
}) {
  return (
    <SurfaceCard variant="inner" className="border bg-background/70 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{helper}</p>
    </SurfaceCard>
  )
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <SurfaceCard variant="panel" className="p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </SurfaceCard>
  )
}

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState('Anclora Content Generator AI')
  const [workspaceDescription, setWorkspaceDescription] = useState(
    'Cockpit editorial de Anclora Group para convertir inteligencia de mercado en contenido de autoridad.'
  )

  const [defaultProvider, setDefaultProvider] = useState('anthropic')
  const [defaultModel, setDefaultModel] = useState('claude-sonnet-4-6')
  const [anthropicKey, setAnthropicKey] = useState('')
  const [groqKey, setGroqKey] = useState('')
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)

  const [templateName, setTemplateName] = useState('')
  const [templateType, setTemplateType] = useState('blog')
  const [systemPrompt, setSystemPrompt] = useState(
    'Prioriza tesis accionables, evidencia trazable y una voz premium, concreta y útil para Anclora Group.'
  )
  const [temperature, setTemperature] = useState('0.7')
  const [topP, setTopP] = useState('0.9')
  const [savedMsg, setSavedMsg] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false)
  const [isSavingModel, setIsSavingModel] = useState(false)
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)

  const [existingTemplates, setExistingTemplates] = useState<Array<{
    id?: string
    name: string
    type: string
    intent: string
  }>>([])

  function showSaved(message: string) {
    setSavedMsg(message)
    window.setTimeout(() => setSavedMsg(''), 2400)
  }

  useEffect(() => {
    void (async () => {
      try {
        const [settingsResponse, templatesResponse] = await Promise.all([
          fetch('/api/workspace/settings'),
          fetch('/api/content/templates'),
        ])

        if (settingsResponse.ok) {
          const payload = await settingsResponse.json()
          const settings = payload.settings
          if (settings) {
            setWorkspaceName(settings.workspaceName ?? 'Anclora Content Generator AI')
            setWorkspaceDescription(settings.workspaceDescription ?? '')
            setSystemPrompt(settings.editorialSystemPrompt ?? '')
            setDefaultProvider(settings.defaultProvider ?? 'anthropic')
            setDefaultModel(settings.defaultModel ?? 'claude-sonnet-4-6')
            setTemperature(String(settings.defaultTemperature ?? 0.7))
            setTopP(String(settings.defaultTopP ?? 0.9))
          }
        }

        if (templatesResponse.ok) {
          const payload = await templatesResponse.json()
          setExistingTemplates(
            (payload.templates ?? []).map((template: { id: string; name: string; contentType: string; description?: string | null }) => ({
              id: template.id,
              name: template.name,
              type: template.contentType,
              intent: template.description || 'Plantilla editorial persistida en el workspace.',
            }))
          )
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const readiness = useMemo(() => {
    const configuredProviders = [anthropicKey, groqKey].filter(Boolean).length
    const score =
      (workspaceName.trim() ? 1 : 0) +
      (workspaceDescription.trim() ? 1 : 0) +
      (systemPrompt.trim() ? 1 : 0) +
      (configuredProviders > 0 ? 1 : 0)

    return {
      score,
      configuredProviders,
      posture:
        score >= 4 ? 'Listo para escalar' : score >= 3 ? 'Operativo con margen de mejora' : 'Necesita afinado',
      tone: (score >= 4 ? 'good' : score >= 3 ? 'warning' : 'neutral') as 'good' | 'warning' | 'neutral',
    }
  }, [anthropicKey, groqKey, systemPrompt, workspaceDescription, workspaceName])

  async function saveWorkspaceIdentity() {
    setIsSavingWorkspace(true)

    try {
      const response = await fetch('/api/workspace/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceName,
          workspaceDescription,
          editorialSystemPrompt: systemPrompt,
          defaultProvider,
          defaultModel,
          defaultTemperature: Number(temperature),
          defaultTopP: Number(topP),
          ragChunkSize: 512,
          ragTopK: 5,
          similarityThreshold: 0.7,
        }),
      })

      if (response.ok) {
        showSaved('Identidad del workspace actualizada')
      }
    } finally {
      setIsSavingWorkspace(false)
    }
  }

  async function saveModelPosture() {
    setIsSavingModel(true)

    try {
      const response = await fetch('/api/workspace/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceName,
          workspaceDescription,
          editorialSystemPrompt: systemPrompt,
          defaultProvider,
          defaultModel,
          defaultTemperature: Number(temperature),
          defaultTopP: Number(topP),
          ragChunkSize: 512,
          ragTopK: 5,
          similarityThreshold: 0.7,
        }),
      })

      if (response.ok) {
        showSaved('Stack de modelos actualizado')
      }
    } finally {
      setIsSavingModel(false)
    }
  }

  async function saveTemplate() {
    if (!templateName.trim() || !systemPrompt.trim()) return

    setIsSavingTemplate(true)
    try {
      const response = await fetch('/api/content/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: templateName,
          contentType: templateType,
          systemPrompt,
          description: `Plantilla ${templateType} para el cockpit editorial de Anclora.`,
        }),
      })

      if (response.ok) {
        const payload = await response.json()
        if (payload.template) {
          setExistingTemplates((prev) => [
            ...prev,
            {
              id: payload.template.id,
              name: payload.template.name,
              type: payload.template.contentType,
              intent: payload.template.description || 'Plantilla editorial persistida en el workspace.',
            },
          ])
        }
        setTemplateName('')
        setTemplateType('blog')
        showSaved('Plantilla editorial guardada')
      }
    } finally {
      setIsSavingTemplate(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <SurfaceCard variant="panel" className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
              Premium UX Control
            </Badge>
            <Badge variant="secondary">Fase 2 cerrada</Badge>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight">
            Ajusta identidad, modelos y sistema editorial sin salir del cockpit.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Esta vista ya no es un formulario genérico. Es la sala de ajuste del producto: voz, proveedores,
            plantillas y postura operativa del workspace.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <StatusPill label={readiness.posture} tone={readiness.tone} />
            <StatusPill label="Persistencia parcial" tone="warning" />
            <StatusPill label="Configuración editorial" />
          </div>
        </SurfaceCard>

        <SurfaceCard variant="panel" className="p-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-lg font-semibold">Estado del sistema</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <MetricCard
              label="Postura"
              value={`${readiness.score}/4`}
              helper="Lectura rápida del nivel de configuración operativa del workspace."
            />
            <MetricCard
              label="Proveedores activos"
              value={String(readiness.configuredProviders)}
              helper="Cuántos motores de IA tienen credenciales cargadas en esta sesión."
            />
          </div>
        </SurfaceCard>
      </section>

      {savedMsg ? (
        <SurfaceCard variant="inner" className="border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            <p className="text-sm font-medium">{savedMsg}</p>
          </div>
        </SurfaceCard>
      ) : null}

      <Tabs defaultValue="identity" className="space-y-4">
        <TabsList className="h-10 border border-border bg-muted/60">
          <TabsTrigger value="identity" className="gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-1.5">
            <Bot className="h-3.5 w-3.5" />
            Modelos
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1.5">
            <LayoutTemplate className="h-3.5 w-3.5" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="rag" className="gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            RAG posture
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <SectionCard
            icon={Building2}
            title="Identidad del workspace"
            description="Define la firma editorial y el encuadre narrativo del producto para que todo el sistema suene a Anclora."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Nombre del workspace</Label>
                <Input
                  id="workspace-name"
                  value={workspaceName}
                  onChange={(event) => setWorkspaceName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-description">Narrativa operativa</Label>
                <Textarea
                  id="workspace-description"
                  rows={5}
                  value={workspaceDescription}
                  onChange={(event) => setWorkspaceDescription(event.target.value)}
                  className="resize-none"
                />
              </div>
              <Button onClick={() => void saveWorkspaceIdentity()} disabled={isSavingWorkspace} className="w-full">
                {isSavingWorkspace ? 'Guardando...' : 'Guardar identidad'}
              </Button>
            </div>
          </SectionCard>

          <SectionCard
            icon={Workflow}
            title="Guardrails editoriales"
            description="Haz explícito qué tipo de pieza queremos producir y qué no debería salir del sistema."
          >
            <div className="space-y-3">
              {[
                'La pieza debe sonar a inteligencia de mercado, no a copy genérico de IA.',
                'Cada salida necesita una tesis, una audiencia concreta y un siguiente paso comercial.',
                'Cuando falte contexto, el operador debe enriquecer el RAG antes de abrir más producción.',
              ].map((item) => (
                <SurfaceCard key={item} variant="inner" className="border bg-background/70 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                </SurfaceCard>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="models" className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <SectionCard
            icon={Bot}
            title="Stack de modelos"
            description="Configura el motor principal y deja clara la postura de fallback sin perder coherencia operativa."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Proveedor principal</Label>
                <Select value={defaultProvider} onValueChange={(value) => value && setDefaultProvider(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="groq">Groq</SelectItem>
                    <SelectItem value="ollama">Ollama</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Modelo principal</Label>
                <Select value={defaultModel} onValueChange={(value) => value && setDefaultModel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultProvider === 'anthropic' ? (
                      <>
                        <SelectItem value="claude-sonnet-4-6">Claude Sonnet 4.6</SelectItem>
                        <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                      </>
                    ) : defaultProvider === 'groq' ? (
                      <>
                        <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                        <SelectItem value="llama2-70b-4096">Llama 2 70B</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="llama3">Llama 3</SelectItem>
                        <SelectItem value="mistral">Mistral</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input id="temperature" value={temperature} onChange={(event) => setTemperature(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="top-p">Top P</Label>
                <Input id="top-p" value={topP} onChange={(event) => setTopP(event.target.value)} />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="system-prompt">Prompt de sistema operativo</Label>
              <Textarea
                id="system-prompt"
                rows={5}
                value={systemPrompt}
                onChange={(event) => setSystemPrompt(event.target.value)}
                className="resize-none"
              />
            </div>

            <Button onClick={() => void saveModelPosture()} disabled={isSavingModel} className="mt-4 w-full">
              {isSavingModel ? 'Guardando...' : 'Guardar postura del modelo'}
            </Button>
          </SectionCard>

          <SectionCard
            icon={Shield}
            title="Credenciales"
            description="Lectura clara de qué proveedores están listos y cuáles siguen sin configurarse en esta sesión."
          >
            <div className="space-y-4">
              {[
                {
                  id: 'anthropic-key',
                  label: 'Anthropic API Key',
                  value: anthropicKey,
                  setValue: setAnthropicKey,
                  show: showAnthropicKey,
                  toggle: () => setShowAnthropicKey((prev) => !prev),
                  placeholder: 'sk-ant-...',
                },
                {
                  id: 'groq-key',
                  label: 'Groq API Key',
                  value: groqKey,
                  setValue: setGroqKey,
                  show: showGroqKey,
                  toggle: () => setShowGroqKey((prev) => !prev),
                  placeholder: 'gsk_...',
                },
              ].map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor={item.id}>{item.label}</Label>
                    <StatusPill label={item.value ? 'Configurada' : 'No configurada'} tone={item.value ? 'good' : 'warning'} />
                  </div>
                  <div className="relative">
                    <Input
                      id={item.id}
                      type={item.show ? 'text' : 'password'}
                      placeholder={item.placeholder}
                      value={item.value}
                      onChange={(event) => item.setValue(event.target.value)}
                      className="pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={item.toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <SurfaceCard variant="inner" className="border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-xs leading-relaxed text-amber-100/90">
                  Esta capa sigue siendo de sesión local y UX operativa. El siguiente salto natural es persistencia real y gestión de secretos por entorno.
                </p>
              </SurfaceCard>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="templates" className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <SectionCard
            icon={LayoutTemplate}
            title="Nueva plantilla editorial"
            description="Crea moldes reutilizables para que Studio arranque con la estructura y la voz adecuadas."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Nombre</Label>
                <Input
                  id="template-name"
                  placeholder="Ej. LinkedIn Thesis Brief"
                  value={templateName}
                  onChange={(event) => setTemplateName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de contenido</Label>
                <Select value={templateType} onValueChange={(value) => value && setTemplateType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => void saveTemplate()} disabled={isSavingTemplate || !templateName.trim()} className="w-full">
                {isSavingTemplate ? 'Guardando...' : 'Guardar plantilla'}
              </Button>
            </div>
          </SectionCard>

          <SectionCard
            icon={Sparkles}
            title="Librería curada"
            description="La librería ya se persiste por workspace y puede alimentar el Studio con moldes reutilizables."
          >
            <div className="space-y-3">
              {existingTemplates.map((template) => (
                <SurfaceCard key={template.name} variant="inner" className="border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{template.name}</p>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{template.intent}</p>
                </SurfaceCard>
              ))}
              {!existingTemplates.length && !isLoading ? (
                <SurfaceCard variant="inner" className="border bg-background/70 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Aún no hay plantillas persistidas en este workspace. Crea la primera desde este panel.
                  </p>
                </SurfaceCard>
              ) : null}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="rag" className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <SectionCard
            icon={BookOpen}
            title="Postura del knowledge engine"
            description="Haz visible qué está configurado hoy y qué entra en la siguiente fase de expansión."
          >
            <div className="grid gap-3 md:grid-cols-3">
              <MetricCard label="Backend activo" value="pgvector" helper="Neon + pgvector sigue siendo el backend operativo." />
              <MetricCard label="Top K" value="5" helper="Ventana de recuperación por defecto en el sistema actual." />
              <MetricCard label="Chunk size" value="512" helper="Tamaño operativo de chunk antes de una futura especialización." />
            </div>
          </SectionCard>

          <SectionCard
            icon={SlidersHorizontal}
            title="Siguiente expansión"
            description="La UX deja claro qué ya opera hoy y qué forma parte de la fase post-roadmap."
          >
            <div className="space-y-3">
              {[
                'Extender la ejecución manual asistida hacia conectores externos de publicación.',
                'Introducir scheduling ejecutor e integraciones reales por canal.',
                'Añadir telemetría por micro-zona y lead attribution externo.',
              ].map((item) => (
                <SurfaceCard key={item} variant="inner" className="border bg-background/70 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                </SurfaceCard>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

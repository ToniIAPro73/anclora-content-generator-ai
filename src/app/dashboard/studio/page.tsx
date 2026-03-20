"use client"

import { useMemo, useState } from "react"
import {
  CheckCircle2,
  Copy,
  FileStack,
  LibraryBig,
  Loader2,
  Orbit,
  Sparkles,
  WandSparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface GeneratedContent {
  id: string
  title: string
  content: string
  contentType: string
  status: string
}

interface GenerationMetadata {
  model?: string
  tokensUsed?: number
  generationTime?: number
  retrievalTime?: number
  ragSources?: string[]
}
const contentTypes = [
  { value: "blog", label: "Blog de autoridad", hint: "Articulos profundos y SEO" },
  { value: "linkedin", label: "LinkedIn", hint: "Narrativa ejecutiva y thought leadership" },
  { value: "instagram", label: "Instagram", hint: "Capsulas visuales y aspiracionales" },
  { value: "newsletter", label: "Newsletter", hint: "Curacion de oportunidades y contexto" },
  { value: "facebook", label: "Facebook", hint: "Distribucion y alcance internacional" },
  { value: "custom", label: "Custom", hint: "Prompt libre para una necesidad especifica" },
] as const

const strategicPresets = [
  {
    label: "Efecto Mandarin Oriental",
    title: "Como puede impactar Mandarin Oriental Punta Negra en el reposicionamiento del mercado premium",
    objective: "Construir autoridad analitica y captar inversores que buscan entrar antes de la revalorizacion general.",
    audience: "Inversores internacionales y compradores anticipados",
    ragQuery: "Mandarin Oriental Punta Negra impacto revalorizacion hoteleria premium suroeste Mallorca",
    tone: "analitico",
  },
  {
    label: "Camp de Mar opportunity",
    title: "Camp de Mar: correccion de precio o oportunidad silenciosa para capital paciente",
    objective: "Generar una pieza de market intelligence con tesis, riesgos y lectura de inventario.",
    audience: "Compradores con sensibilidad a valor y family offices",
    ragQuery: "Camp de Mar caida interanual precios inventario rentabilidad Mallorca",
    tone: "institucional",
  },
  {
    label: "Guia fiscal",
    title: "Fiscalidad para compradores internacionales de alto patrimonio en Baleares",
    objective: "Atraer leads HNWI con una pieza util, clara y accionable.",
    audience: "Compradores britanicos, alemanes, suizos y estadounidenses",
    ragQuery: "fiscalidad compradores extranjeros Baleares 2026 impuestos vivienda no residentes",
    tone: "didactico",
  },
] as const

export default function StudioPage() {
  const [title, setTitle] = useState("")
  const [contentType, setContentType] = useState<string>("blog")
  const [templateId, setTemplateId] = useState("")
  const [microZoneId, setMicroZoneId] = useState("")
  const [objective, setObjective] = useState("")
  const [audience, setAudience] = useState("")
  const [tone, setTone] = useState("analitico")
  const [ragQuery, setRagQuery] = useState("")
  const [userContext, setUserContext] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [metadata, setMetadata] = useState<GenerationMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle")

  const selectedType = useMemo(
    () => contentTypes.find((item) => item.value === contentType),
    [contentType]
  )

  const userPrompt = useMemo(() => {
    return [
      `Titulo de trabajo: ${title || "Sin definir"}`,
      `Objetivo de negocio: ${objective || "No especificado"}`,
      `Audiencia: ${audience || "No especificada"}`,
      `Tono deseado: ${tone}`,
      microZoneId ? `Micro-zona prioritaria: ${microZoneId}` : null,
      userContext ? `Notas adicionales: ${userContext}` : null,
      "Escribe en espanol y manten una voz premium, concreta y util para Anclora Private Estates.",
    ]
      .filter(Boolean)
      .join("\n")
  }, [audience, microZoneId, objective, title, tone, userContext])

  function applyPreset(index: number) {
    const preset = strategicPresets[index]
    if (!preset) return

    setTitle(preset.title)
    setObjective(preset.objective)
    setAudience(preset.audience)
    setRagQuery(preset.ragQuery)
    setTone(preset.tone)
  }

  async function handleGenerate() {
    setIsGenerating(true)
    setError(null)
    setGeneratedContent(null)
    setMetadata(null)

    try {
      const response = await fetch("/api/content/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          contentType,
          templateId: templateId || undefined,
          microZoneId: microZoneId || undefined,
          ragQuery: ragQuery || undefined,
          userPrompt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error generating content")
      }

      setGeneratedContent(data.content)
      setMetadata(data.metadata)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopy() {
    if (!generatedContent?.content) return

    await navigator.clipboard.writeText(generatedContent.content)
    setCopyState("copied")
    window.setTimeout(() => setCopyState("idle"), 1800)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_1.05fr_1.2fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                Brief
              </Badge>
              <Badge variant="secondary">{selectedType?.label}</Badge>
            </div>
            <CardTitle className="text-xl">Define la tesis antes de generar</CardTitle>
            <CardDescription>
              El estudio no deberia arrancar con un prompt vacio. Empieza por objetivo, audiencia y angulo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titulo o hipotesis</Label>
              <Input
                id="title"
                placeholder="Ej. Camp de Mar: ajuste transitorio o entrada tactica"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Objetivo de negocio</Label>
              <Textarea
                id="objective"
                rows={4}
                placeholder="Ej. Posicionar a Anclora como el referente que detecta valor antes que el mercado."
                value={objective}
                onChange={(event) => setObjective(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Audiencia objetivo</Label>
              <Input
                id="audience"
                placeholder="Ej. Inversores alemanes con foco en revalorizacion a 3-5 anos"
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Canal de salida</Label>
                <Select value={contentType} onValueChange={(value) => value && setContentType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{selectedType?.hint}</p>
              </div>

              <div className="space-y-2">
                <Label>Tono</Label>
                <Select value={tone} onValueChange={(value) => value && setTone(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analitico">Analitico</SelectItem>
                    <SelectItem value="institucional">Institucional</SelectItem>
                    <SelectItem value="didactico">Didactico</SelectItem>
                    <SelectItem value="aspiracional">Aspiracional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-primary" />
              Presets estrategicos
            </CardTitle>
            <CardDescription>
              Atajos pensados para Anclora, no para una app generica.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {strategicPresets.map((preset, index) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(index)}
                className="w-full rounded-xl border border-border/70 bg-background/70 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <p className="font-medium text-foreground">{preset.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {preset.objective}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LibraryBig className="h-4 w-4 text-primary" />
              Contexto y sistema
            </CardTitle>
            <CardDescription>
              Define como debe razonar el motor y que fuentes necesita recuperar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Plantilla</Label>
              <Select value={templateId} onValueChange={(value) => setTemplateId(value ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una plantilla" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template-market-report">Market Report</SelectItem>
                  <SelectItem value="template-founder-linkedin">Founder LinkedIn</SelectItem>
                  <SelectItem value="template-investor-brief">Investor Brief</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Micro-zona</Label>
              <Select value={microZoneId} onValueChange={(value) => setMicroZoneId(value ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una micro-zona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camp-de-mar">Camp de Mar</SelectItem>
                  <SelectItem value="punta-negra">Punta Negra</SelectItem>
                  <SelectItem value="palmanova">Palmanova</SelectItem>
                  <SelectItem value="bendinat">Bendinat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ragQuery">Consulta RAG</Label>
              <Input
                id="ragQuery"
                placeholder="Ej. impacto infraestructuras premium y divergencia entre venta y renta"
                value={ragQuery}
                onChange={(event) => setRagQuery(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Usa una consulta especifica para recuperar contexto verificable.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas de direccion</Label>
              <Textarea
                id="notes"
                rows={7}
                placeholder="Ej. Evita tono publicitario. Introduce datos concretos y termina con CTA hacia conversacion estrategica."
                value={userContext}
                onChange={(event) => setUserContext(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Checklist de calidad</CardTitle>
            <CardDescription>
              Antes de lanzar, asegúrate de que la pieza cumple estos minimos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "El angulo responde a una senal real del mercado, no a un tema generico.",
              "La pieza incluye una audiencia concreta y una siguiente accion clara.",
              "La consulta RAG refleja el dato o evento que justifica el contenido.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
              </div>
            ))}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !title || !objective || !audience}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <WandSparkles className="h-4 w-4" />
                  Generar pieza
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="min-h-[720px]">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Orbit className="h-5 w-5 text-primary" />
                  Output Panel
                </CardTitle>
                <CardDescription>
                  Vista de trabajo para revisar la generacion, copiarla y validar su metadata.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCopy} disabled={!generatedContent?.content}>
                  <Copy className="h-4 w-4" />
                  {copyState === "copied" ? "Copiado" : "Copiar"}
                </Button>
                <Button variant="outline" disabled>
                  <FileStack className="h-4 w-4" />
                  Programar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            {isGenerating && (
              <div className="flex h-[520px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div>
                  <p className="font-medium text-foreground">Construyendo la pieza</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    El sistema esta combinando briefing, contexto RAG y voz de marca.
                  </p>
                </div>
              </div>
            )}

            {!isGenerating && !generatedContent && !error && (
              <div className="flex h-[520px] flex-col justify-between rounded-2xl border border-dashed border-border bg-muted/30 p-6">
                <div>
                  <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                    Ready when you are
                  </Badge>
                  <h3 className="mt-4 font-heading text-2xl font-semibold">
                    Genera una pieza con hipotesis, audiencia y contexto reales.
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    Esta vista esta pensada como una mesa de trabajo editorial. Cuando lances la generacion veras el borrador, la metadata del modelo y la traza del uso de RAG.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "Importa nuevas fuentes en Knowledge Base para mejorar el contexto.",
                    "Usa un preset estrategico para no partir desde cero.",
                    "Especifica audiencia y objetivo para que el output no sea generico.",
                    "Guarda la pieza final como base para derivadas por canal.",
                  ].map((tip) => (
                    <div key={tip} className="rounded-xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
                <p className="font-medium text-destructive">No se pudo generar el contenido</p>
                <p className="mt-1 text-sm text-destructive/80">{error}</p>
              </div>
            )}

            {generatedContent && (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Contenido</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Titulo</Label>
                    <Input value={generatedContent.title} readOnly />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{generatedContent.contentType}</Badge>
                    <Badge variant="outline">{generatedContent.status}</Badge>
                  </div>

                  <Textarea
                    value={generatedContent.content}
                    readOnly
                    rows={22}
                    className="min-h-[520px] resize-none font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4 pt-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Modelo", value: metadata?.model ?? "N/D" },
                      { label: "Tokens", value: String(metadata?.tokensUsed ?? 0) },
                      {
                        label: "Tiempo de generacion",
                        value: metadata?.generationTime
                          ? `${Math.round(metadata.generationTime)} ms`
                          : "N/D",
                      },
                      {
                        label: "Tiempo de retrieval",
                        value: metadata?.retrievalTime
                          ? `${Math.round(metadata.retrievalTime)} ms`
                          : "Sin RAG",
                      },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border/70 bg-background/70 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Fuentes recuperadas
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {metadata?.ragSources?.length
                        ? metadata.ragSources.join(", ")
                        : "No hay trazas de retrieval en esta generacion."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

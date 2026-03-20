"use client"

import * as React from "react"
import {
  BookOpen,
  BrainCircuit,
  Database,
  FileText,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SurfaceCard } from "@/components/ui/surface-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type Source = {
  id: string
  title: string
  type: string
  status: string
  chunks: number
  date: string
}

type KnowledgePack = {
  id: string
  title: string
  status: string
  packType: string
  summary: string
  confidenceScore: number | null
  recommendedUses: string[]
  createdAt: string
  evidenceCount: number
  claimsCount: number
  chunksCount: number
}

type KnowledgeJob = {
  id: string
  status: string
  triggerType: string
  errorMessage: string | null
  createdAt: string
  finishedAt: string | null
  knowledgePackId: string | null
  title: string | null
}

type KnowledgePackDetail = {
  id: string
  title: string
  summary: string
  status: string
  packType: string
  confidenceScore: number | null
  topics: string[]
  recommendedUses: string[]
  claims: Array<{
    id: string
    claimType: string
    statement: string
    supportLevel: string
  }>
  evidence: Array<{
    id: string
    title: string
    sourceLabel: string
    excerpt: string
    evidenceType: string
  }>
  chunksCount: number
}

function statusTone(status: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-500/12 text-emerald-300 border-emerald-500/25"
    case "processing":
    case "queued":
    case "pending":
      return "bg-amber-500/12 text-amber-300 border-amber-500/25"
    case "failed":
    case "error":
      return "bg-red-500/12 text-red-300 border-red-500/25"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export default function KnowledgeBasePage() {
  const [sources, setSources] = React.useState<Source[]>([])
  const [packs, setPacks] = React.useState<KnowledgePack[]>([])
  const [jobs, setJobs] = React.useState<KnowledgeJob[]>([])
  const [selectedPack, setSelectedPack] = React.useState<KnowledgePackDetail | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isPackLoading, setIsPackLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState("")
  const [newContent, setNewContent] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [packTitle, setPackTitle] = React.useState("")
  const [packPrompt, setPackPrompt] = React.useState("")
  const [packObjective, setPackObjective] = React.useState("")
  const [packAudience, setPackAudience] = React.useState("")
  const [packNotes, setPackNotes] = React.useState("")
  const [notebookContent, setNotebookContent] = React.useState("")
  const [packType, setPackType] = React.useState<"agentic_research_pack" | "notebooklm_notebook">("agentic_research_pack")
  const [isCreatingPack, setIsCreatingPack] = React.useState(false)
  const [packError, setPackError] = React.useState<string | null>(null)

  const loadSources = React.useCallback(async () => {
    const res = await fetch("/api/rag/sources")
    const data = await res.json()
    setSources(data.sources ?? [])
  }, [])

  const loadPacks = React.useCallback(async () => {
    const res = await fetch("/api/rag/knowledge-packs")
    const data = await res.json()
    setPacks(data.packs ?? [])
    setJobs(data.jobs ?? [])
  }, [])

  const loadPackDetail = React.useCallback(async (id: string) => {
    setIsPackLoading(true)
    try {
      const res = await fetch(`/api/rag/knowledge-packs/${id}`)
      const data = await res.json()
      setSelectedPack(data.pack ?? null)
    } finally {
      setIsPackLoading(false)
    }
  }, [])

  const refreshAll = React.useCallback(async () => {
    setIsLoading(true)
    try {
      await Promise.all([loadSources(), loadPacks()])
    } finally {
      setIsLoading(false)
    }
  }, [loadPacks, loadSources])

  React.useEffect(() => {
    void refreshAll()
  }, [refreshAll])

  React.useEffect(() => {
    if (!selectedPack && packs[0]?.id) {
      void loadPackDetail(packs[0].id)
    }
  }, [loadPackDetail, packs, selectedPack])

  async function handleDelete(id: string) {
    setSources((prev) => prev.filter((s) => s.id !== id))
    try {
      const res = await fetch(`/api/rag/sources/${id}`, { method: "DELETE" })
      if (!res.ok) {
        await refreshAll()
      }
    } catch {
      await refreshAll()
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/rag/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          sourceType: "manual",
        }),
      })
      const data = await res.json()
      if (data.source) {
        setSources((prev) => [data.source, ...prev])
      }
      setNewTitle("")
      setNewContent("")
      setDialogOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCreatePack(e: React.FormEvent) {
    e.preventDefault()
    setIsCreatingPack(true)
    setPackError(null)

    try {
      const res = await fetch("/api/rag/knowledge-packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: packTitle,
          prompt: packPrompt,
          objective: packObjective,
          audience: packAudience,
          notes: packNotes,
          notebookContent,
          packType,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "No se pudo crear el knowledge pack")
      }

      setPackTitle("")
      setPackPrompt("")
      setPackObjective("")
      setPackAudience("")
      setPackNotes("")
      setNotebookContent("")

      await refreshAll()
      if (data.packId) {
        await loadPackDetail(data.packId)
      }
    } catch (error) {
      setPackError(error instanceof Error ? error.message : "No se pudo crear el knowledge pack")
    } finally {
      setIsCreatingPack(false)
    }
  }

  const filteredSources = sources.filter((source) =>
    source.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <SurfaceCard variant="panel" className="p-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
              Knowledge Engine
            </Badge>
            <Badge variant="secondary">Agentic RAG</Badge>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight">
            Convierte briefs, notebooks y fuentes en contexto curado para el motor editorial.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            La Knowledge Base ya no se limita a almacenar documentos. Ahora puede producir dossiers estructurados con claims, evidencias y chunks listos para retrieval.
          </p>
        </SurfaceCard>

        <SurfaceCard variant="panel" className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Knowledge packs</p>
          <p className="mt-3 font-heading text-4xl font-semibold text-foreground">{packs.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">Dossiers curados disponibles para retrieval.</p>
        </SurfaceCard>

        <SurfaceCard variant="panel" className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Fuentes indexadas</p>
          <p className="mt-3 font-heading text-4xl font-semibold text-foreground">{sources.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">Entradas activas dentro de la Knowledge Base.</p>
        </SurfaceCard>
      </section>

      <Tabs defaultValue="agentic" className="space-y-4">
        <TabsList className="border border-border bg-muted/60 h-10">
          <TabsTrigger value="agentic">Crear dossier con IA</TabsTrigger>
          <TabsTrigger value="sources">Fuentes</TabsTrigger>
        </TabsList>

        <TabsContent value="agentic" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
            <SurfaceCard variant="panel" className="p-6">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-primary" />
                <h2 className="font-heading text-lg font-semibold">Nuevo knowledge pack</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Primera iteración del flujo agéntico: prompt, dossier normalizado y chunks indexados en la misma operación.
              </p>

              <form onSubmit={handleCreatePack} className="mt-5 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pack-title">Título del dossier</Label>
                    <Input
                      id="pack-title"
                      value={packTitle}
                      onChange={(event) => setPackTitle(event.target.value)}
                      placeholder="Ej. Fiscalidad HNWI en Baleares 2026"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pack-type">Modo de entrada</Label>
                    <select
                      id="pack-type"
                      value={packType}
                      onChange={(event) => setPackType(event.target.value as "agentic_research_pack" | "notebooklm_notebook")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="agentic_research_pack">Prompt research pack</option>
                      <option value="notebooklm_notebook">Import NotebookLM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pack-prompt">Prompt o briefing</Label>
                  <Textarea
                    id="pack-prompt"
                    rows={5}
                    value={packPrompt}
                    onChange={(event) => setPackPrompt(event.target.value)}
                    placeholder="Ej. Construye un dossier sobre las oportunidades fiscales y riesgos para compradores HNWI en Baleares."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pack-objective">Objetivo editorial</Label>
                    <Input
                      id="pack-objective"
                      value={packObjective}
                      onChange={(event) => setPackObjective(event.target.value)}
                      placeholder="Ej. Crear una pieza de autoridad para captar consultas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pack-audience">Audiencia</Label>
                    <Input
                      id="pack-audience"
                      value={packAudience}
                      onChange={(event) => setPackAudience(event.target.value)}
                      placeholder="Ej. Inversores HNWI británicos y alemanes"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pack-notes">Notas de dirección</Label>
                  <Textarea
                    id="pack-notes"
                    rows={4}
                    value={packNotes}
                    onChange={(event) => setPackNotes(event.target.value)}
                    placeholder="Ángulo, tono, exclusiones o instrucciones de contexto."
                  />
                </div>

                {packType === "notebooklm_notebook" ? (
                  <div className="space-y-2">
                    <Label htmlFor="notebook-content">Contenido importado de NotebookLM</Label>
                    <Textarea
                      id="notebook-content"
                      rows={6}
                      value={notebookContent}
                      onChange={(event) => setNotebookContent(event.target.value)}
                      placeholder="Pega aquí el resumen, notas, Q&A o export del cuaderno."
                    />
                  </div>
                ) : null}

                {packError ? (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {packError}
                  </div>
                ) : null}

                <Button type="submit" className="w-full" disabled={isCreatingPack || !packTitle || (!packPrompt && !notebookContent)}>
                  {isCreatingPack ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Construyendo dossier...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Crear knowledge pack
                    </>
                  )}
                </Button>
              </form>
            </SurfaceCard>

            <div className="grid gap-4">
              <SurfaceCard variant="panel" className="p-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-heading text-base font-semibold">Jobs recientes</h3>
                </div>
                <div className="mt-4 space-y-3">
                  {jobs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Todavía no hay jobs de ingesta agéntica.</p>
                  ) : (
                    jobs.slice(0, 4).map((job) => (
                      <SurfaceCard key={job.id} variant="inner" className="border bg-background/70 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{job.title ?? "Job sin título"}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {job.triggerType} · {new Date(job.createdAt).toLocaleString("es-ES")}
                            </p>
                          </div>
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusTone(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                        {job.errorMessage ? (
                          <p className="mt-2 text-xs text-destructive">{job.errorMessage}</p>
                        ) : null}
                      </SurfaceCard>
                    ))
                  )}
                </div>
              </SurfaceCard>

              <SurfaceCard variant="panel" className="p-5">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <h3 className="font-heading text-base font-semibold">Contrato del pack</h3>
                </div>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <SurfaceCard variant="inner" className="border bg-background/70 p-4">
                    Cada dossier se persiste con `summary`, `claims`, `evidence`, `recommendedUses` y `chunks`.
                  </SurfaceCard>
                  <SurfaceCard variant="inner" className="border bg-background/70 p-4">
                    La indexación se hace sobre payload normalizado, no sobre texto crudo sin gobernanza.
                  </SurfaceCard>
                </div>
              </SurfaceCard>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <SurfaceCard variant="panel" className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading text-lg font-semibold">Knowledge packs disponibles</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Selecciona un dossier para revisar su trazabilidad.
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={refreshAll} title="Recargar">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Cargando packs...</p>
                ) : packs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Todavía no has creado ningún dossier.</p>
                ) : (
                  packs.map((pack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => loadPackDetail(pack.id)}
                      className="w-full text-left"
                    >
                      <SurfaceCard variant="inner" className="border bg-background/70 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{pack.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {pack.packType} · {new Date(pack.createdAt).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusTone(pack.status)}`}>
                            {pack.status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pack.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>{pack.claimsCount} claims</span>
                          <span>{pack.evidenceCount} evidencias</span>
                          <span>{pack.chunksCount} chunks</span>
                          {pack.confidenceScore ? <span>confianza {Math.round(pack.confidenceScore * 100)}%</span> : null}
                        </div>
                      </SurfaceCard>
                    </button>
                  ))
                )}
              </div>
            </SurfaceCard>

            <SurfaceCard variant="panel" className="p-5">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-primary" />
                <h3 className="font-heading text-lg font-semibold">Detalle del dossier</h3>
              </div>
              {isPackLoading ? (
                <p className="mt-4 text-sm text-muted-foreground">Cargando dossier...</p>
              ) : !selectedPack ? (
                <p className="mt-4 text-sm text-muted-foreground">Selecciona un knowledge pack para ver sus claims y evidencias.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="font-heading text-xl font-semibold">{selectedPack.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selectedPack.summary}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedPack.recommendedUses?.map((use) => (
                      <Badge key={use} variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                        {use}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {selectedPack.claims.map((claim) => (
                      <SurfaceCard key={claim.id} variant="inner" className="border bg-background/70 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{claim.claimType}</p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground">{claim.statement}</p>
                        <p className="mt-3 text-xs text-muted-foreground">Soporte: {claim.supportLevel}</p>
                      </SurfaceCard>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {selectedPack.evidence.map((evidence) => (
                      <SurfaceCard key={evidence.id} variant="inner" className="border bg-muted/40 p-4">
                        <p className="font-medium text-foreground">{evidence.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {evidence.sourceLabel} · {evidence.evidenceType}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{evidence.excerpt}</p>
                      </SurfaceCard>
                    ))}
                  </div>
                </div>
              )}
            </SurfaceCard>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <SurfaceCard variant="panel" className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-semibold">Fuentes manuales y operativas</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mantén el flujo clásico de ingesta simple para texto, URL o notas rápidas.
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger render={<Button className="gap-2" />}>
                  <Plus className="w-4 h-4" />
                  Añadir fuente
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleAdd}>
                    <DialogHeader>
                      <DialogTitle>Añadir nueva fuente</DialogTitle>
                      <DialogDescription>
                        Ingesta nuevo conocimiento para mejorar la generación de contenido.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Título / Identificador</Label>
                        <Input
                          id="title"
                          placeholder="ej. Guía IRPF Autónomos 2024"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="content">Contenido</Label>
                        <Textarea
                          id="content"
                          placeholder="Pega aquí el texto o proporciona una URL..."
                          className="min-h-[150px]"
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Procesando..." : "Procesar e ingestar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar fuentes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={refreshAll} title="Recargar">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-border/80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fuente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Chunks</TableHead>
                    <TableHead className="text-right">Añadida</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        <RefreshCw className="mr-2 inline h-4 w-4 animate-spin" />
                        Cargando fuentes...
                      </TableCell>
                    </TableRow>
                  ) : filteredSources.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        {searchQuery ? "No se encontraron fuentes." : "Aún no hay fuentes. Añade tu primera fuente de conocimiento."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                            {source.title}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{source.type}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusTone(source.status)}`}>
                            {(source.status === "processing" || source.status === "pending") ? (
                              <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                            ) : null}
                            {source.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{source.chunks}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{source.date}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(source.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </SurfaceCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

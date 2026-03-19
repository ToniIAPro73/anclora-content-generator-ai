"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Database, Search, FileText, Trash2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Source = {
  id: string
  title: string
  type: string
  status: string
  chunks: number
  date: string
}

const WORKSPACE_ID = '00000000-0000-0000-0000-000000000000'

export default function KnowledgeBasePage() {
  const [sources, setSources] = useState<Source[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadSources() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/rag/sources?workspaceId=${WORKSPACE_ID}`)
      const data = await res.json()
      setSources(data.sources ?? [])
    } catch {
      setSources([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadSources() }, [])

  async function handleDelete(id: string) {
    setSources(prev => prev.filter(s => s.id !== id))
    try {
      const res = await fetch(`/api/rag/sources/${id}?workspaceId=${WORKSPACE_ID}`, { method: 'DELETE' })
      if (!res.ok) loadSources()
    } catch {
      loadSources()
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/rag/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: WORKSPACE_ID,
          title: newTitle,
          content: newContent,
          sourceType: 'manual',
        }),
      })
      const data = await res.json()
      if (data.source) {
        setSources(prev => [data.source, ...prev])
      }
      setNewTitle("")
      setNewContent("")
      setDialogOpen(false)
    } catch {
      // silent
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredSources = sources.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Knowledge Base
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona la memoria a largo plazo de tu IA.
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
                  <label htmlFor="title" className="text-sm font-medium">Título / Identificador</label>
                  <Input
                    id="title"
                    placeholder="ej. Guía IRPF Autónomos 2024"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="content" className="text-sm font-medium">Contenido</label>
                  <Textarea
                    id="content"
                    placeholder="Pega aquí el texto o proporciona una URL..."
                    className="min-h-[150px]"
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Procesando...' : 'Procesar e ingestar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
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
          <Button variant="ghost" size="icon" onClick={loadSources} title="Recargar">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="border rounded-md">
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
                    <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />
                    Cargando fuentes...
                  </TableCell>
                </TableRow>
              ) : filteredSources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    {searchQuery ? 'No se encontraron fuentes.' : 'Aún no hay fuentes. Añade tu primera fuente de conocimiento.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        {source.title}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{source.type}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        source.status === 'completed' || source.status === 'ready'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : source.status === 'processing' || source.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {(source.status === 'processing' || source.status === 'pending') && (
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                        )}
                        {source.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{source.chunks}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{source.date}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
      </div>
    </div>
  )
}

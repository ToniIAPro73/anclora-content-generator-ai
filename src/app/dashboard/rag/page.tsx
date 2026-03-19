"use client"

import * as React from "react"
import { useState } from "react"
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

// Tipos Mock para la UI inicial (Se conectará a Supabase posteriormente)
type Source = {
  id: string
  title: string
  type: "document" | "url" | "text"
  status: "processing" | "ready" | "error"
  chunks: number
  date: string
}

const mockSources: Source[] = [
  { id: "1", title: "Guía IRPF Autónomos Baleares 2024", type: "document", status: "ready", chunks: 45, date: "2024-03-20" },
  { id: "2", title: "Estrategias Brand Positioning Premium", type: "text", status: "ready", chunks: 12, date: "2024-03-21" },
  { id: "3", title: "Últimas tendencias Real Estate 2024", type: "url", status: "processing", chunks: 0, date: "2024-03-22" },
]

export default function KnowledgeBasePage() {
  const [sources, setSources] = useState<Source[]>(mockSources)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSources = sources.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Knowledge Base
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your AI&apos;s long-term memory and context sources.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="w-4 h-4" />
            Add Source
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Source</DialogTitle>
              <DialogDescription>
                Ingest new information to improve content generation accuracy.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title / Identifier</label>
                <Input id="title" placeholder="e.g., Q1 Real Estate Report" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">Content or URL</label>
                <Textarea 
                  id="content" 
                  placeholder="Paste your plain text here or provide a URL..." 
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Process & Ingest</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sources..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Chunks</TableHead>
                <TableHead className="text-right">Added</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {source.title}
                  </TableCell>
                  <TableCell className="capitalize">{source.type}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      source.status === 'ready' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      source.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {source.status === 'processing' && <RefreshCw className="mr-1 h-3 w-3 animate-spin" />}
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
                      onClick={() => setSources(prev => prev.filter(s => s.id !== source.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSources.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No sources found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

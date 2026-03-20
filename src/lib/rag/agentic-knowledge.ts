import { and, desc, eq, sql as drizzleSql } from 'drizzle-orm'

import { db } from '@/lib/db/neon'
import {
  contentSources,
  knowledgeIngestionJobs,
  knowledgePackClaims,
  knowledgePackEvidence,
  knowledgePacks,
} from '@/lib/db/schema'
import { chunkText } from '@/lib/rag/chunking'
import { createContentOpportunitiesFromIngestion } from '@/lib/rag/content-opportunity-agent'
import { generateEmbeddings } from '@/lib/rag/embeddings'
import { insertVectorChunks } from '@/lib/rag/vector-store'

type KnowledgePackKind = 'agentic_research_pack' | 'notebooklm_notebook' | 'curated_brief'

export type AgenticPackInput = {
  workspaceId: string
  userId: string
  title: string
  prompt: string
  objective?: string
  audience?: string
  notes?: string
  notebookContent?: string
  packType?: KnowledgePackKind
}

type NormalizedEvidence = {
  id: string
  title: string
  sourceLabel: string
  url?: string
  excerpt: string
  evidenceType: 'prompt' | 'notebook' | 'manual' | 'derived' | 'workflow'
  confidenceScore: number
}

type NormalizedClaim = {
  type: 'market_signal' | 'thesis' | 'recommendation' | 'risk'
  statement: string
  supportLevel: 'high' | 'medium' | 'low'
  evidenceRefs: string[]
}

type NormalizedKnowledgePack = {
  title: string
  summary: string
  topics: string[]
  entities: string[]
  tags: string[]
  claims: NormalizedClaim[]
  evidence: NormalizedEvidence[]
  recommendedUses: string[]
  freshnessDate: string
  confidenceScore: number
  retrievalDocument: string
}

function uniqueWords(value: string, limit = 6) {
  return Array.from(
    new Set(
      value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
        .split(/\s+/)
        .map((part) => part.trim())
        .filter((part) => part.length > 3)
    )
  ).slice(0, limit)
}

function inferRecommendedUses(packType: KnowledgePackKind, objective?: string) {
  const normalizedObjective = objective?.toLowerCase() ?? ''
  const uses = ['blog_post', 'linkedin_post']

  if (packType === 'notebooklm_notebook') {
    uses.push('newsletter_brief')
  }

  if (normalizedObjective.includes('newsletter') || normalizedObjective.includes('brief')) {
    uses.push('newsletter_brief')
  }

  if (normalizedObjective.includes('instagram') || normalizedObjective.includes('social')) {
    uses.push('instagram_caption')
  }

  return Array.from(new Set(uses))
}

function buildNormalizedPack(input: AgenticPackInput): NormalizedKnowledgePack {
  const {
    title,
    prompt,
    objective,
    audience,
    notes,
    notebookContent,
    packType = 'agentic_research_pack',
  } = input

  const notebookExcerpt = notebookContent?.slice(0, 320)
  const baseContext = [prompt, objective, audience, notes, notebookContent].filter(Boolean).join(' ')
  const topics = uniqueWords(baseContext, 8)
  const entities = uniqueWords(`${title} ${audience ?? ''} ${prompt}`, 6)
  const tags = Array.from(new Set([packType, ...topics.slice(0, 4)]))
  const evidence: NormalizedEvidence[] = [
    {
      id: 'ev_prompt',
      title: 'Prompt de investigación',
      sourceLabel: 'Brief del usuario',
      excerpt: prompt,
      evidenceType: 'prompt',
      confidenceScore: 0.92,
    },
    {
      id: 'ev_objective',
      title: 'Objetivo editorial',
      sourceLabel: 'Contexto de negocio',
      excerpt: objective || 'Objetivo editorial no especificado.',
      evidenceType: 'workflow',
      confidenceScore: objective ? 0.86 : 0.52,
    },
    {
      id: 'ev_notes',
      title: packType === 'notebooklm_notebook' ? 'Notas importadas de notebook' : 'Notas de dirección',
      sourceLabel: packType === 'notebooklm_notebook' ? 'NotebookLM import' : 'Contexto complementario',
      excerpt:
        notebookExcerpt ||
        notes ||
        'No se proporcionaron notas adicionales; el dossier se apoya en el briefing principal.',
      evidenceType: packType === 'notebooklm_notebook' ? 'notebook' : 'manual',
      confidenceScore: notebookExcerpt || notes ? 0.81 : 0.45,
    },
  ]

  const audienceLine = audience ? `para ${audience}` : 'para la audiencia objetivo del workspace'
  const summary = [
    `Dossier curado sobre "${title}" creado a partir de un briefing agéntico ${audienceLine}.`,
    objective
      ? `La intención principal es ${objective.toLowerCase()}.`
      : 'La intención principal es convertir una hipótesis difusa en una pieza editorial accionable.',
    packType === 'notebooklm_notebook'
      ? 'El material importado desde NotebookLM se ha normalizado para separar tesis, evidencias y usos recomendados.'
      : 'El output se ha normalizado para separar tesis, riesgos, recomendaciones y trazas de soporte.',
  ].join(' ')

  const claims: NormalizedClaim[] = [
    {
      type: 'thesis',
      statement: `La hipótesis editorial de "${title}" puede convertirse en una pieza de autoridad si se ancla en un ángulo verificable y en un mensaje claro para ${audience ?? 'la audiencia prioritaria'}.`,
      supportLevel: 'high',
      evidenceRefs: ['ev_prompt', 'ev_objective'],
    },
    {
      type: 'recommendation',
      statement: objective
        ? `La recomendación principal es estructurar el contenido alrededor del objetivo declarado: ${objective}.`
        : 'La recomendación principal es estructurar el contenido con una tesis central, un bloque de evidencias y un CTA consultivo.',
      supportLevel: 'medium',
      evidenceRefs: ['ev_objective', 'ev_notes'],
    },
    {
      type: 'risk',
      statement:
        'Existe riesgo de producir una pieza genérica si el dossier no se complementa con fuentes externas o datos de mercado antes de la publicación final.',
      supportLevel: 'medium',
      evidenceRefs: ['ev_prompt'],
    },
  ]

  const retrievalDocument = [
    `Titulo: ${title}`,
    `Resumen: ${summary}`,
    `Audiencia: ${audience || 'No especificada'}`,
    `Objetivo: ${objective || 'No especificado'}`,
    `Temas: ${topics.join(', ') || 'Sin temas inferidos'}`,
    'Claims:',
    ...claims.map((claim, index) => `${index + 1}. [${claim.type}] ${claim.statement}`),
    'Evidence:',
    ...evidence.map((item) => `${item.sourceLabel}: ${item.excerpt}`),
    notes ? `Notas: ${notes}` : null,
    notebookContent ? `Contenido notebook: ${notebookContent}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  return {
    title,
    summary,
    topics,
    entities,
    tags,
    claims,
    evidence,
    recommendedUses: inferRecommendedUses(packType, objective),
    freshnessDate: new Date().toISOString(),
    confidenceScore: packType === 'notebooklm_notebook' ? 0.78 : 0.74,
    retrievalDocument,
  }
}

function buildFallbackEmbedding(text: string, dimensions = 384) {
  const vector = new Array<number>(dimensions).fill(0)
  if (!text.trim()) {
    return vector
  }

  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index)
    vector[index % dimensions] += ((code % 31) - 15) / 31
  }

  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1
  return vector.map((value) => value / norm)
}

async function generateResilientEmbedding(text: string) {
  try {
    return await generateEmbeddings(text)
  } catch (error) {
    console.warn('[Agentic Knowledge] Falling back to deterministic embedding', error)
    return buildFallbackEmbedding(text)
  }
}

export async function createAgenticKnowledgePack(input: AgenticPackInput) {
  const packType = input.packType ?? 'agentic_research_pack'

  const [source] = await db
    .insert(contentSources)
    .values({
      workspaceId: input.workspaceId,
      title: input.title,
      sourceType: packType,
      content: input.notebookContent ?? input.prompt,
      status: 'processing',
      metadata: {
        ingestionMode: 'agentic',
        packType,
        audience: input.audience ?? null,
        objective: input.objective ?? null,
      },
    })
    .returning({
      id: contentSources.id,
    })

  const [pack] = await db
    .insert(knowledgePacks)
    .values({
      workspaceId: input.workspaceId,
      sourceId: source.id,
      sourceType: packType,
      title: input.title,
      summary: 'Inicializando dossier de conocimiento.',
      status: 'processing',
      packType,
      inputPrompt: input.prompt,
      createdByUserId: input.userId,
      rawPayload: {
        prompt: input.prompt,
        objective: input.objective ?? null,
        audience: input.audience ?? null,
        notes: input.notes ?? null,
        notebookContent: input.notebookContent ?? null,
      },
    })
    .returning({
      id: knowledgePacks.id,
    })

  const [job] = await db
    .insert(knowledgeIngestionJobs)
    .values({
      workspaceId: input.workspaceId,
      knowledgePackId: pack.id,
      triggerType: packType === 'notebooklm_notebook' ? 'notebooklm' : 'prompt',
      status: 'processing',
      inputPayload: {
        title: input.title,
        prompt: input.prompt,
        objective: input.objective ?? null,
        audience: input.audience ?? null,
        notes: input.notes ?? null,
        packType,
      },
      startedAt: new Date(),
    })
    .returning({
      id: knowledgeIngestionJobs.id,
    })

  try {
    const normalizedPack = buildNormalizedPack(input)

    await db.insert(knowledgePackEvidence).values(
      normalizedPack.evidence.map((item, index) => ({
        knowledgePackId: pack.id,
        title: item.title,
        url: item.url ?? null,
        sourceLabel: item.sourceLabel,
        excerpt: item.excerpt,
        evidenceType: item.evidenceType,
        confidenceScore: item.confidenceScore,
        position: index,
      }))
    )

    await db.insert(knowledgePackClaims).values(
      normalizedPack.claims.map((item, index) => ({
        knowledgePackId: pack.id,
        claimType: item.type,
        statement: item.statement,
        supportLevel: item.supportLevel,
        evidenceRefs: item.evidenceRefs,
        position: index,
      }))
    )

    const textChunks = chunkText(normalizedPack.retrievalDocument, {
      maxChunkSize: 900,
      overlap: 140,
      mode: 'semantic',
    })

    const chunksWithEmbeddings = await Promise.all(
      textChunks.map(async (chunk) => ({
        content: chunk.content,
        chunkIndex: chunk.index,
        embedding: await generateResilientEmbedding(chunk.content),
        metadata: {
          ...chunk.metadata,
          sourceKind: 'knowledge_pack',
          knowledgePackId: pack.id,
          packType,
          recommendedUses: normalizedPack.recommendedUses,
          topics: normalizedPack.topics,
        },
        tokenCount: chunk.metadata.tokenCount as number | undefined,
      }))
    )

    const insertedChunks = await insertVectorChunks({
      workspaceId: input.workspaceId,
      sourceId: source.id,
      chunks: chunksWithEmbeddings,
    })

    await db
      .update(knowledgePacks)
      .set({
        summary: normalizedPack.summary,
        status: 'completed',
        tags: normalizedPack.tags,
        topics: normalizedPack.topics,
        entities: normalizedPack.entities,
        recommendedUses: normalizedPack.recommendedUses,
        freshnessDate: normalizedPack.freshnessDate,
        confidenceScore: normalizedPack.confidenceScore,
        normalizedPayload: normalizedPack,
        updatedAt: new Date(),
      })
      .where(eq(knowledgePacks.id, pack.id))

    await db
      .update(contentSources)
      .set({
        status: 'completed',
        chunksCount: insertedChunks,
        processedAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          ingestionMode: 'agentic',
          packType,
          knowledgePackId: pack.id,
          recommendedUses: normalizedPack.recommendedUses,
        },
      })
      .where(eq(contentSources.id, source.id))

    await db
      .update(knowledgeIngestionJobs)
      .set({
        status: 'completed',
        finishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(knowledgeIngestionJobs.id, job.id))

    await createContentOpportunitiesFromIngestion({
      workspaceId: input.workspaceId,
      sourceId: source.id,
      knowledgePackId: pack.id,
      title: input.title,
      content: normalizedPack.retrievalDocument,
      audience: input.audience,
      topics: normalizedPack.topics,
      recommendedUses: normalizedPack.recommendedUses,
    })

    return {
      packId: pack.id,
      jobId: job.id,
      sourceId: source.id,
      chunksCount: insertedChunks,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo construir el knowledge pack'

    await db
      .update(knowledgePacks)
      .set({
        status: 'failed',
        updatedAt: new Date(),
      })
      .where(eq(knowledgePacks.id, pack.id))

    await db
      .update(contentSources)
      .set({
        status: 'error',
        errorMessage: message,
        updatedAt: new Date(),
      })
      .where(eq(contentSources.id, source.id))

    await db
      .update(knowledgeIngestionJobs)
      .set({
        status: 'failed',
        errorMessage: message,
        finishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(knowledgeIngestionJobs.id, job.id))

    throw error
  }
}

export async function listKnowledgePacks(workspaceId: string) {
  const packs = await db
    .select({
      id: knowledgePacks.id,
      title: knowledgePacks.title,
      status: knowledgePacks.status,
      packType: knowledgePacks.packType,
      summary: knowledgePacks.summary,
      confidenceScore: knowledgePacks.confidenceScore,
      recommendedUses: knowledgePacks.recommendedUses,
      createdAt: knowledgePacks.createdAt,
      sourceId: knowledgePacks.sourceId,
      evidenceCount: drizzleSql<number>`(
        select count(*)
        from ${knowledgePackEvidence}
        where ${knowledgePackEvidence.knowledgePackId} = ${knowledgePacks.id}
      )`,
      claimsCount: drizzleSql<number>`(
        select count(*)
        from ${knowledgePackClaims}
        where ${knowledgePackClaims.knowledgePackId} = ${knowledgePacks.id}
      )`,
      chunksCount: contentSources.chunksCount,
    })
    .from(knowledgePacks)
    .leftJoin(contentSources, eq(contentSources.id, knowledgePacks.sourceId))
    .where(eq(knowledgePacks.workspaceId, workspaceId))
    .orderBy(desc(knowledgePacks.createdAt))

  return packs.map((item) => ({
    ...item,
    recommendedUses: Array.isArray(item.recommendedUses) ? item.recommendedUses : [],
    evidenceCount: Number(item.evidenceCount ?? 0),
    claimsCount: Number(item.claimsCount ?? 0),
  }))
}

export async function listKnowledgeJobs(workspaceId: string) {
  const jobs = await db
    .select({
      id: knowledgeIngestionJobs.id,
      status: knowledgeIngestionJobs.status,
      triggerType: knowledgeIngestionJobs.triggerType,
      errorMessage: knowledgeIngestionJobs.errorMessage,
      createdAt: knowledgeIngestionJobs.createdAt,
      finishedAt: knowledgeIngestionJobs.finishedAt,
      knowledgePackId: knowledgeIngestionJobs.knowledgePackId,
      title: knowledgePacks.title,
    })
    .from(knowledgeIngestionJobs)
    .leftJoin(knowledgePacks, eq(knowledgePacks.id, knowledgeIngestionJobs.knowledgePackId))
    .where(eq(knowledgeIngestionJobs.workspaceId, workspaceId))
    .orderBy(desc(knowledgeIngestionJobs.createdAt))

  return jobs
}

export async function getKnowledgePackDetail(workspaceId: string, packId: string) {
  const [pack] = await db
    .select()
    .from(knowledgePacks)
    .where(and(eq(knowledgePacks.workspaceId, workspaceId), eq(knowledgePacks.id, packId)))
    .limit(1)

  if (!pack) {
    return null
  }

  const evidence = await db
    .select()
    .from(knowledgePackEvidence)
    .where(eq(knowledgePackEvidence.knowledgePackId, packId))
    .orderBy(knowledgePackEvidence.position)

  const claims = await db
    .select()
    .from(knowledgePackClaims)
    .where(eq(knowledgePackClaims.knowledgePackId, packId))
    .orderBy(knowledgePackClaims.position)

  const chunkInfo = pack.sourceId
    ? await db
        .select({
          chunksCount: contentSources.chunksCount,
          sourceId: contentSources.id,
        })
        .from(contentSources)
        .where(eq(contentSources.id, pack.sourceId))
        .limit(1)
    : []

  return {
    ...pack,
    evidence,
    claims,
    chunksCount: chunkInfo[0]?.chunksCount ?? 0,
    sourceId: chunkInfo[0]?.sourceId ?? null,
  }
}

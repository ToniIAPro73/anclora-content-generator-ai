import { desc, eq } from 'drizzle-orm'

import { db } from '@/lib/db/neon'
import { contentOpportunities } from '@/lib/db/schema'

type AnalyzeOpportunitiesInput = {
  workspaceId: string
  title: string
  content: string
  sourceId?: string
  knowledgePackId?: string
  audience?: string
  topics?: string[]
  recommendedUses?: string[]
}

type OpportunitySeed = {
  title: string
  angle: string
  rationale: string
  audience?: string
  recommendedFormat: string
  confidenceScore: number
}

function splitSentences(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 40)
}

function inferFormats(recommendedUses?: string[]) {
  if (!recommendedUses?.length) {
    return ['blog_post', 'linkedin_post', 'newsletter_brief']
  }

  return recommendedUses
}

function buildSeeds(input: AnalyzeOpportunitiesInput): OpportunitySeed[] {
  const sentences = splitSentences(input.content)
  const focusLines = sentences.slice(0, 3)
  const formats = inferFormats(input.recommendedUses)
  const topics = input.topics?.slice(0, 3) ?? []

  const firstTopic = topics[0] ?? input.title
  const secondTopic = topics[1] ?? 'señal detectada'
  const audience = input.audience ?? 'la audiencia estratégica del workspace'

  const defaults: OpportunitySeed[] = [
    {
      title: `Pieza ancla sobre ${firstTopic}`,
      angle: `Convertir ${firstTopic} en una tesis editorial accionable para ${audience}.`,
      rationale:
        focusLines[0] ??
        `El nuevo contexto sugiere que ${firstTopic} puede convertirse en un contenido de autoridad si se estructura con datos, riesgo y recomendación.`,
      audience,
      recommendedFormat: formats[0] ?? 'blog_post',
      confidenceScore: 0.76,
    },
    {
      title: `Derivada ejecutiva sobre ${secondTopic}`,
      angle: `Destilar la señal principal en una pieza breve con ángulo consultivo y CTA claro.`,
      rationale:
        focusLines[1] ??
        `La información recién ingerida contiene un ángulo secundario que puede reutilizarse para una derivada ejecutiva en canales de distribución rápida.`,
      audience,
      recommendedFormat: formats[1] ?? 'linkedin_post',
      confidenceScore: 0.7,
    },
    {
      title: `Brief de newsletter: ${input.title}`,
      angle: `Empaquetar el hallazgo en un briefing curado que conecte contexto, oportunidad y siguiente paso comercial.`,
      rationale:
        focusLines[2] ??
        `El activo indexado aporta suficiente material para un resumen curado que refuerce autoridad y active conversaciones comerciales.`,
      audience,
      recommendedFormat: formats[2] ?? 'newsletter_brief',
      confidenceScore: 0.68,
    },
  ]

  return defaults
}

export async function createContentOpportunitiesFromIngestion(input: AnalyzeOpportunitiesInput) {
  const seeds = buildSeeds(input)

  await db.insert(contentOpportunities).values(
    seeds.map((seed) => ({
      workspaceId: input.workspaceId,
      sourceId: input.sourceId ?? null,
      knowledgePackId: input.knowledgePackId ?? null,
      title: seed.title,
      angle: seed.angle,
      rationale: seed.rationale,
      audience: seed.audience ?? null,
      recommendedFormat: seed.recommendedFormat,
      confidenceScore: seed.confidenceScore,
      metadata: {
        originTitle: input.title,
        topics: input.topics ?? [],
        generatedBy: 'content-opportunity-agent',
      },
    }))
  )
}

export async function listContentOpportunities(workspaceId: string) {
  return db
    .select()
    .from(contentOpportunities)
    .where(eq(contentOpportunities.workspaceId, workspaceId))
    .orderBy(desc(contentOpportunities.createdAt))
    .limit(18)
}

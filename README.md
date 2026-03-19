# Anclora Content Generator AI

**AI-powered content generation platform with RAG (Retrieval-Augmented Generation) capabilities**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-green)](https://neon.tech/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green)](https://orm.drizzle.team/)

---

## Features

- **RAG Engine**: Local embeddings + pgvector for semantic search (zero-cost)
- **Multi-LLM Support**: Claude, Groq, Ollama via Vercel AI SDK
- **Content Templates**: Reusable templates with system prompts and configs
- **Micro-Zones**: Geographic targeting for localized content
- **Knowledge Base**: Ingest PDFs, web content, and custom sources
- **Dashboard UI**: Modern interface with shadcn/ui components
- **Multi-tenant**: Workspace isolation with Row Level Security (RLS)

---

## Tech Stack

### Frontend
- **Next.js 15** (App Router, React Server Components)
- **React 19** (Canary with Server Actions)
- **TypeScript 5.7**
- **Tailwind CSS** + **shadcn/ui**
- **Geist Font** (Vercel)

### Backend
- **Neon PostgreSQL** (Serverless, scale-to-zero)
- **Drizzle ORM** (Type-safe queries)
- **pgvector** (Vector similarity search)
- **Transformers.js** (Local embeddings with `Xenova/all-MiniLM-L6-v2`)

### AI/ML
- **Vercel AI SDK** (LLM abstraction)
- **Anthropic Claude** (via API)
- **Groq** (Fast inference)
- **Ollama** (Local models)

### Authentication
- **Supabase Auth** (SSR with `@supabase/ssr`)
- **Row Level Security** (Multi-tenant isolation)

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (Vercel recommends 20+)
- **npm** or **pnpm**
- **Neon PostgreSQL** account ([console.neon.tech](https://console.neon.tech))
- **Supabase** account (for Auth only)

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd anclora-content-generator-ai
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```bash
# Database (Neon)
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/database?sslmode=require

# Supabase (Auth only)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Providers (optional, add as needed)
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
```

4. **Set up database**:
```bash
# Enable pgvector extension in Neon dashboard SQL Editor:
# CREATE EXTENSION IF NOT EXISTS vector;

# Apply schema with Drizzle
npm run db:push

# Or run migrations manually
psql $DATABASE_URL -f supabase/migrations/002_rag_schema.sql
psql $DATABASE_URL -f supabase/migrations/003_rls_policies.sql
psql $DATABASE_URL -f supabase/migrations/004_seed_data.sql
```

5. **Run development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Database Commands

```bash
# Generate migration from schema.ts
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Run migrations (if using SQL files)
npm run db:migrate
```

---

## Project Structure

```
anclora-content-generator-ai/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/
│   │   │   ├── content/
│   │   │   │   ├── generate/     # Content generation endpoint
│   │   │   │   └── ingest/       # Knowledge base ingestion
│   │   │   └── metrics/
│   │   │       └── dashboard/    # Analytics endpoint
│   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── rag/              # Knowledge base UI
│   │   │   └── layout.tsx        # Dashboard shell
│   │   └── (auth)/               # Auth pages
│   ├── components/               # React components
│   │   └── ui/                   # shadcn/ui components
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts         # Drizzle schema
│   │   │   ├── neon.ts           # Neon client + helpers
│   │   │   └── types.ts          # TypeScript types
│   │   ├── rag/
│   │   │   ├── chunking.ts       # Semantic chunking
│   │   │   ├── embeddings.ts     # Local embeddings
│   │   │   ├── retrieval-neon.ts # Vector search
│   │   │   └── pipeline.ts       # RAG pipeline
│   │   └── ai/
│   │       └── client-factory.ts # LLM clients
│   └── utils/
│       └── supabase/             # Supabase Auth clients
├── supabase/
│   └── migrations/               # SQL migrations
├── drizzle/                      # Drizzle migrations
├── .antigravity/
│   ├── skills/                   # Multi-agent system
│   └── team/                     # Task orchestration
└── docs/                         # Documentation
```

---

## API Routes

### POST `/api/content/generate`
Generate content with optional RAG context.

**Request**:
```json
{
  "workspaceId": "uuid",
  "templateId": "uuid",
  "title": "Post Title",
  "contentType": "blog_post",
  "microZoneId": "uuid",
  "ragQuery": "optional search query",
  "userContext": "additional context"
}
```

**Response**:
```json
{
  "content": {
    "id": "uuid",
    "title": "Post Title",
    "content": "Generated content...",
    "contentType": "blog_post",
    "status": "draft"
  },
  "metadata": {
    "tokensUsed": 1234,
    "modelUsed": "claude-3-5-sonnet",
    "executionTimeMs": 2500,
    "ragUsed": true,
    "chunksRetrieved": 5
  }
}
```

### POST `/api/content/ingest`
Ingest content into knowledge base.

**Request**:
```json
{
  "workspaceId": "uuid",
  "sourceType": "pdf",
  "url": "https://example.com/doc.pdf",
  "metadata": {
    "title": "Document Title",
    "author": "Author Name"
  }
}
```

### GET `/api/metrics/dashboard?workspaceId=uuid`
Get analytics for dashboard.

**Response**:
```json
{
  "metrics": {
    "totalContent": 42,
    "publishedContent": 30,
    "draftContent": 12,
    "avgTokensUsed": 850,
    "totalKnowledgeChunks": 1250
  }
}
```

---

## RAG Engine

### How It Works

1. **Ingestion**:
   - Content is chunked with semantic separators
   - Local embeddings generated with Transformers.js (384-dim)
   - Stored in PostgreSQL with pgvector

2. **Retrieval**:
   - User query → embedding
   - Vector similarity search (cosine distance)
   - Top-K most similar chunks returned

3. **Generation**:
   - Retrieved context + user prompt → LLM
   - Supports Claude, Groq, Ollama
   - Streaming responses available

### Chunking Strategy

```typescript
const hierarchicalSeparators = [
  '\n\n## ',  // H2 headers
  '\n\n### ', // H3 headers
  '\n\n',     // Paragraphs
  '\n',       // Lines
  '. ',       // Sentences
  ' '         // Words
]
```

- **Chunk Size**: 512 tokens (configurable)
- **Overlap**: 50 tokens
- **Metadata**: Preserved per chunk

### Embeddings

- **Model**: `Xenova/all-MiniLM-L6-v2`
- **Dimensions**: 384
- **Speed**: ~50ms per embedding (local)
- **Cost**: $0 (runs in browser/Edge runtime)

---

## Multi-Agent Development

This project uses a multi-agent orchestration system:

- **Agent A (Database Architect)**: SQL schema, migrations, RLS policies
- **Agent B (API & RAG Engineer)**: RAG engine, API routes, LLM integration
- **Agent C (Frontend Engineer)**: Dashboard UI, components
- **Agent D (Testing Specialist)**: Unit tests, integration tests

See [`.antigravity/skills/anclorabot-multiagente-system/SKILL.md`](.antigravity/skills/anclorabot-multiagente-system/SKILL.md) for details.

---

## Migration from Supabase to Neon

This project was migrated from Supabase to Neon PostgreSQL for better performance and reduced vendor lock-in.

**Key Benefits**:
- Native pgvector support
- Serverless scale-to-zero
- Database branching (dev/staging/prod)
- Direct SQL access
- Type-safe queries with Drizzle ORM

See [`MIGRATION_TO_NEON.md`](MIGRATION_TO_NEON.md) for full migration guide.

---

## Development Phases

- [x] **FASE 1**: Project setup + Auth + Theme
- [x] **FASE 2**: RAG Engine + Database + API Routes
- [ ] **FASE 3**: Scheduling + Metrics + Alerts
- [ ] **FASE 4**: OAuth + Social APIs
- [ ] **FASE 5**: SEO Programático
- [ ] **FASE 6**: OpenClaw + Security

See [`docs/Plan de Desarrollo Anclora Content Generator AI.docx`](docs/Plan de Desarrollo Anclora Content Generator AI.docx) for complete roadmap.

---

## Testing

```bash
# Run linter
npm run lint

# Run build (validates TypeScript)
npm run build

# Run tests (coming in FASE 2 - Agent D)
npm test
```

---

## Deployment

### Quick Deploy

**Ready to deploy?** Follow these steps:

```bash
# 1. Verify build passes
npm run build

# 2. Run pre-deployment checks
./deploy.sh

# 3. Follow the comprehensive guide
# See DEPLOYMENT_GUIDE.md for detailed instructions
```

### Vercel (Recommended Platform)

**Estimated Time**: 30-45 minutes

1. **Set up Neon Database**
   - Create project at [console.neon.tech](https://console.neon.tech)
   - Enable `pgvector` extension
   - Run `npm run db:push` to apply schema
   - Execute `scripts/post-deploy.sql` for seed data

2. **Configure Supabase Auth**
   - Create project at [app.supabase.com](https://app.supabase.com)
   - Get API credentials
   - Create test user

3. **Deploy to Vercel**
   - Import from GitHub
   - Add environment variables (see below)
   - Deploy!

4. **Post-Deployment**
   - Update Supabase redirect URLs
   - Test login flow
   - Verify dashboard loads

### Environment Variables Required

```bash
# Database (Required)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require

# Authentication (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# App URL (Required)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# AI Providers (Optional - add as needed)
ANTHROPIC_API_KEY=sk-ant-xxxxx   # Claude
GROQ_API_KEY=gsk_xxxxx           # Groq
```

### Deployment Resources

- 📚 **[Complete Deployment Guide](DEPLOYMENT_GUIDE.md)** - Step-by-step instructions
- 🚀 **[deploy.sh](deploy.sh)** - Pre-deployment verification script
- 🗄️ **[post-deploy.sql](scripts/post-deploy.sql)** - Database setup queries
- 📝 **[.env.example](.env.example)** - Environment variables template

---

## Contributing

This project follows **SDD (Spec-Driven Development)**:

1. Create feature spec in [`docs/specs/`](docs/specs/)
2. Get approval from Director (Anclorabot)
3. Implement in isolated branch
4. One commit per feature
5. PR with spec reference

---

## License

MIT

---

## Authors

- **Anclorabot** - Multi-agent orchestration system
- **Agent A** - Database architecture
- **Agent B** - RAG Engine & API
- **Agent C** - Frontend (in progress)
- **Agent D** - Testing (planned)

---

## Support

For issues or questions:
- Create an issue in the repository
- Check the [documentation](docs/)
- Review [MIGRATION_TO_NEON.md](MIGRATION_TO_NEON.md) for database setup

---

**Built with AI-powered multi-agent development** | **Powered by Neon + Drizzle + Next.js 15**

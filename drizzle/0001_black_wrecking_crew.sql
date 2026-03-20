CREATE TYPE "public"."knowledge_claim_type" AS ENUM('market_signal', 'thesis', 'recommendation', 'risk');--> statement-breakpoint
CREATE TYPE "public"."knowledge_evidence_type" AS ENUM('prompt', 'notebook', 'manual', 'derived', 'workflow');--> statement-breakpoint
CREATE TYPE "public"."knowledge_ingestion_trigger" AS ENUM('prompt', 'notebooklm', 'manual');--> statement-breakpoint
CREATE TYPE "public"."knowledge_pack_status" AS ENUM('queued', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."knowledge_pack_type" AS ENUM('agentic_research_pack', 'notebooklm_notebook', 'curated_brief');--> statement-breakpoint
CREATE TYPE "public"."knowledge_support_level" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
ALTER TYPE "public"."source_type" ADD VALUE 'agentic_research_pack';--> statement-breakpoint
ALTER TYPE "public"."source_type" ADD VALUE 'notebooklm_notebook';--> statement-breakpoint
ALTER TYPE "public"."source_type" ADD VALUE 'curated_brief';--> statement-breakpoint
CREATE TABLE "knowledge_ingestion_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"knowledge_pack_id" uuid,
	"trigger_type" "knowledge_ingestion_trigger" NOT NULL,
	"status" "knowledge_pack_status" DEFAULT 'queued' NOT NULL,
	"input_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"orchestrator" text DEFAULT 'anclorabot-core' NOT NULL,
	"error_message" text,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_pack_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"knowledge_pack_id" uuid NOT NULL,
	"claim_type" "knowledge_claim_type" NOT NULL,
	"statement" text NOT NULL,
	"support_level" "knowledge_support_level" NOT NULL,
	"evidence_refs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_pack_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"knowledge_pack_id" uuid NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"source_label" text NOT NULL,
	"excerpt" text NOT NULL,
	"evidence_type" "knowledge_evidence_type" NOT NULL,
	"published_at" timestamp with time zone,
	"confidence_score" real,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_packs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"source_id" uuid,
	"source_type" "source_type" NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"status" "knowledge_pack_status" DEFAULT 'queued' NOT NULL,
	"pack_type" "knowledge_pack_type" NOT NULL,
	"input_prompt" text,
	"created_by_user_id" text NOT NULL,
	"freshness_date" date,
	"confidence_score" real,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"topics" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"entities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"recommended_uses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"normalized_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge_ingestion_jobs" ADD CONSTRAINT "knowledge_ingestion_jobs_knowledge_pack_id_knowledge_packs_id_fk" FOREIGN KEY ("knowledge_pack_id") REFERENCES "public"."knowledge_packs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_pack_claims" ADD CONSTRAINT "knowledge_pack_claims_knowledge_pack_id_knowledge_packs_id_fk" FOREIGN KEY ("knowledge_pack_id") REFERENCES "public"."knowledge_packs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_pack_evidence" ADD CONSTRAINT "knowledge_pack_evidence_knowledge_pack_id_knowledge_packs_id_fk" FOREIGN KEY ("knowledge_pack_id") REFERENCES "public"."knowledge_packs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_packs" ADD CONSTRAINT "knowledge_packs_source_id_content_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."content_sources"("id") ON DELETE set null ON UPDATE no action;
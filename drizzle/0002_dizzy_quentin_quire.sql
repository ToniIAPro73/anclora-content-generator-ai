CREATE TYPE "public"."content_opportunity_status" AS ENUM('new', 'accepted', 'dismissed');--> statement-breakpoint
CREATE TABLE "content_opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"source_id" uuid,
	"knowledge_pack_id" uuid,
	"title" text NOT NULL,
	"angle" text NOT NULL,
	"rationale" text NOT NULL,
	"audience" text,
	"recommended_format" text NOT NULL,
	"confidence_score" real,
	"status" "content_opportunity_status" DEFAULT 'new' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_opportunities" ADD CONSTRAINT "content_opportunities_source_id_content_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."content_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_opportunities" ADD CONSTRAINT "content_opportunities_knowledge_pack_id_knowledge_packs_id_fk" FOREIGN KEY ("knowledge_pack_id") REFERENCES "public"."knowledge_packs"("id") ON DELETE set null ON UPDATE no action;
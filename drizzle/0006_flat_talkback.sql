CREATE TABLE "workspace_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"workspace_name" text NOT NULL,
	"workspace_description" text,
	"editorial_system_prompt" text NOT NULL,
	"default_provider" text DEFAULT 'anthropic' NOT NULL,
	"default_model" text DEFAULT 'claude-sonnet-4-6' NOT NULL,
	"default_temperature" real DEFAULT 0.7 NOT NULL,
	"default_top_p" real DEFAULT 0.9 NOT NULL,
	"rag_chunk_size" integer DEFAULT 512 NOT NULL,
	"rag_top_k" integer DEFAULT 5 NOT NULL,
	"similarity_threshold" real DEFAULT 0.7 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_settings_workspace_id_unique" UNIQUE("workspace_id")
);

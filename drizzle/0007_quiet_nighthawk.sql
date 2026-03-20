ALTER TABLE "generated_content"
ADD COLUMN IF NOT EXISTS "micro_zone_id" uuid REFERENCES "micro_zones"("id") ON DELETE SET NULL;

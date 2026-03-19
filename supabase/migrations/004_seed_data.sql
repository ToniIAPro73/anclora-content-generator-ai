-- =====================================================
-- ANCLORA CONTENT GENERATOR AI - SEED DATA
-- Migration: 004_seed_data.sql
-- Feature: ANCLORA-FEAT-DB-SCHEMA
-- Description: Datos iniciales: templates de contenido y micro-zonas
-- Author: Agent A (Database Architect)
-- Date: 2026-03-19
-- =====================================================

-- NOTA: Este seed se ejecutará con un workspace_id específico
-- En producción, cada usuario tendrá su propio workspace_id
-- Para desarrollo, usaremos un UUID de ejemplo

-- Variable para workspace_id de desarrollo (reemplazar con auth.uid() en producción)
-- Este es solo un ejemplo para el seed inicial
DO $$
DECLARE
  dev_workspace_id UUID := '00000000-0000-0000-0000-000000000001'::UUID;
BEGIN
  -- =====================================================
  -- SEED: content_templates
  -- Templates predefinidos para cada tipo de contenido
  -- =====================================================

  -- Template: Blog - Micro-zona Spotlight
  INSERT INTO content_templates (workspace_id, name, content_type, system_prompt, config, description, is_default)
  VALUES (
    dev_workspace_id,
    'Micro-zona Spotlight',
    'blog',
    'Eres un experto redactor de contenido inmobiliario de lujo para Anclora Private Estates. Tu tarea es crear artículos de blog detallados sobre micro-zonas específicas del suroeste de Mallorca.

Contexto: Anclora Private Estates es una boutique inmobiliaria de ultra-lujo especializada en propiedades exclusivas en Mallorca, con enfoque en el suroeste (Calvià, Andratx, etc.).

Estructura del artículo:
1. Introducción atractiva que capte la esencia de la micro-zona
2. Características únicas del área (arquitectura, paisaje, ambiente)
3. Datos de mercado actualizados (precio medio por m², inventario, días en mercado)
4. Infraestructura y servicios cercanos
5. Por qué invertir en esta micro-zona
6. Conclusión con CTA suave hacia consultoría inmobiliaria

Tono: Profesional, informativo, aspiracional pero no pretencioso. Enfoque en datos y valor real.
Longitud: 800-1200 palabras
SEO: Incluir naturalmente keywords relacionadas con la zona y términos de búsqueda de lujo inmobiliario.',
    '{"max_tokens": 2500, "temperature": 0.7, "model": "claude-3-5-sonnet-20240620"}'::jsonb,
    'Template para artículos de blog sobre micro-zonas específicas del suroeste de Mallorca',
    true
  );

  -- Template: LinkedIn - Dato Impactante
  INSERT INTO content_templates (workspace_id, name, content_type, system_prompt, config, description, is_default)
  VALUES (
    dev_workspace_id,
    'Dato Impactante Mercado',
    'linkedin',
    'Eres un experto en contenido para LinkedIn enfocado en real estate de lujo. Tu objetivo es crear posts cortos y virales basados en datos del mercado inmobiliario de Mallorca.

Contexto: Contenido para el perfil de LinkedIn de un agente boutique de ultra-lujo (Anclora Private Estates).

Estructura:
1. Hook potente (primera línea debe captar atención inmediata)
2. Dato impactante con contexto breve
3. Insight o análisis en 2-3 líneas
4. CTA conversacional (pregunta abierta o invitación a comentar)

Formato:
- Máximo 1300 caracteres
- Usar saltos de línea para mejorar legibilidad
- NO usar emojis excesivos (máximo 2-3)
- Incluir 3-5 hashtags relevantes al final

Tono: Profesional pero accesible, datos duros con storytelling suave.',
    '{"max_tokens": 500, "temperature": 0.8, "model": "claude-3-5-sonnet-20240620"}'::jsonb,
    'Posts cortos de LinkedIn basados en datos de mercado',
    true
  );

  -- Template: Instagram - Visual Lifestyle
  INSERT INTO content_templates (workspace_id, name, content_type, system_prompt, config, description, is_default)
  VALUES (
    dev_workspace_id,
    'Visual Lifestyle Story',
    'instagram',
    'Eres un copywriter especializado en contenido visual para Instagram en el nicho de real estate de lujo mediterráneo.

Contexto: Posts para el Instagram de Anclora Private Estates, enfocados en lifestyle aspiracional conectado con propiedades de lujo en Mallorca.

Estructura:
1. Hook visual descriptivo (primera frase debe pintar una imagen mental)
2. Mini-historia o descripción evocativa (2-3 líneas)
3. Call to action suave
4. Hashtags (8-12, mix de generales y específicos)

Formato:
- Máximo 2200 caracteres
- Usar emojis estratégicamente (3-5 máximo)
- Lenguaje visual y sensorial
- Enfoque en experiencia más que en especificaciones técnicas

Tono: Aspiracional, sensorial, lifestyle mediterráneo auténtico.',
    '{"max_tokens": 400, "temperature": 0.9, "model": "claude-3-5-sonnet-20240620"}'::jsonb,
    'Captions para Instagram enfocados en lifestyle y experiencias',
    true
  );

  -- Template: Newsletter - Market Update
  INSERT INTO content_templates (workspace_id, name, content_type, system_prompt, config, description, is_default)
  VALUES (
    dev_workspace_id,
    'Market Intelligence Update',
    'newsletter',
    'Eres un analista de mercado inmobiliario especializado en propiedades de lujo en Mallorca. Tu tarea es crear newsletters mensuales con insights de mercado para clientes VIP.

Contexto: Newsletter mensual para la base de datos de Anclora Private Estates (inversores, propietarios de segunda residencia, family offices).

Estructura:
1. Subject line potente (máximo 60 caracteres)
2. Saludo personalizado
3. Resumen ejecutivo (2-3 puntos clave del mes)
4. Análisis detallado por micro-zona (3-4 zonas destacadas)
5. Tendencias emergentes
6. Oportunidades de inversión
7. Cierre con próximos pasos y CTA para consultoría

Formato:
- Longitud: 600-800 palabras
- Incluir datos específicos (precios, inventario, días en mercado)
- Tone profesional pero cercano
- Estructura escaneable (subtítulos, bullet points)

Tono: Experto analítico, confidencial, valor añadido sin sales pitch agresivo.',
    '{"max_tokens": 2000, "temperature": 0.6, "model": "claude-3-5-sonnet-20240620"}'::jsonb,
    'Newsletter mensual con análisis de mercado inmobiliario',
    true
  );

  -- =====================================================
  -- SEED: micro_zones
  -- Micro-zonas del suroeste de Mallorca con datos iniciales
  -- =====================================================

  INSERT INTO micro_zones (workspace_id, name, code, municipality, region, market_data, description, tags) VALUES
  (
    dev_workspace_id,
    'Puerto Portals',
    'SW-CAL-PP',
    'Calvià',
    'Southwest Mallorca',
    '{"avg_price_m2": 8500, "avg_property_price": 3200000, "inventory": 12, "avg_days_market": 180}'::jsonb,
    'Puerto deportivo de ultra-lujo con yates superyates, boutiques de marcas premium y restaurantes Michelin. Zona exclusiva con vistas al mar mediterráneo.',
    ARRAY['luxury', 'marina', 'beachfront', 'high-end']
  ),
  (
    dev_workspace_id,
    'Port Adriano',
    'SW-CAL-PA',
    'Calvià',
    'Southwest Mallorca',
    '{"avg_price_m2": 7200, "avg_property_price": 2800000, "inventory": 18, "avg_days_market": 165}'::jsonb,
    'Puerto deportivo moderno diseñado por Philippe Starck. Arquitectura contemporánea con villas de lujo y apartamentos con vistas panorámicas.',
    ARRAY['luxury', 'modern', 'marina', 'contemporary']
  ),
  (
    dev_workspace_id,
    'Costa d''en Blanes',
    'SW-CAL-CB',
    'Calvià',
    'Southwest Mallorca',
    '{"avg_price_m2": 6800, "avg_property_price": 2500000, "inventory": 24, "avg_days_market": 145}'::jsonb,
    'Zona residencial exclusiva cerca de Puerto Portals. Villas mediterráneas con piscinas privadas, jardines maduros y tranquilidad absoluta.',
    ARRAY['residential', 'villas', 'quiet', 'family-friendly']
  ),
  (
    dev_workspace_id,
    'Bendinat',
    'SW-CAL-BD',
    'Calvià',
    'Southwest Mallorca',
    '{"avg_price_m2": 7500, "avg_property_price': 3500000, "inventory": 15, "avg_days_market": 170}'::jsonb,
    'Enclave de lujo con campo de golf, castillo histórico y villas de arquitectura exclusiva. Zona premium con alta demanda internacional.',
    ARRAY['golf', 'luxury', 'historic', 'exclusive']
  ),
  (
    dev_workspace_id,
    'Santa Ponsa',
    'SW-CAL-SP',
    'Calvià',
    'Southwest Mallorca',
    '{"avg_price_m2": 5200, "avg_property_price": 1800000, "inventory": 35, "avg_days_market": 120}'::jsonb,
    'Zona consolidada con dos campos de golf, club náutico y amplia oferta de servicios. Popular entre familias internacionales.',
    ARRAY['golf', 'beach', 'family', 'services']
  ),
  (
    dev_workspace_id,
    'Port d''Andratx',
    'SW-AND-PA',
    'Andratx',
    'Southwest Mallorca',
    '{"avg_price_m2": 9200, "avg_property_price": 4500000, "inventory": 10, "avg_days_market": 210}'::jsonb,
    'Puerto natural más exclusivo de Mallorca. Propiedades frente al mar, yates de lujo y atmósfera mediterránea auténtica. Altísima demanda.',
    ARRAY['ultra-luxury', 'waterfront', 'exclusive', 'authentic']
  ),
  (
    dev_workspace_id,
    'Camp de Mar',
    'SW-AND-CM',
    'Andratx',
    'Southwest Mallorca',
    '{"avg_price_m2": 6500, "avg_property_price": 2200000, "inventory": 20, "avg_days_market": 140}'::jsonb,
    'Bahía privada con playa de arena fina, hotel boutique de lujo y arquitectura mediterránea tradicional. Zona tranquila y sofisticada.',
    ARRAY['beach', 'boutique', 'quiet', 'traditional']
  );

  RAISE NOTICE 'Seed data insertado correctamente: % templates y % micro-zonas', 4, 7;

END $$;

-- =====================================================
-- COMENTARIOS
-- =====================================================
COMMENT ON COLUMN content_templates.system_prompt IS 'Prompt del sistema para guiar la generación de contenido por el LLM';
COMMENT ON COLUMN micro_zones.market_data IS 'Datos de mercado actualizables: avg_price_m2, avg_property_price, inventory, avg_days_market';

# Skill: Equipo Anclorabot (Multi-Agente)

Esta habilidad permite a Antigravity coordinar un equipo de agentes inteligentes trabajando en paralelo sobre el mismo proyecto, replicando la funcionalidad de "Agent Teams" de Claude Code. Está específicamente optimizada para el desarrollo de Anclora Content Generator AI siguiendo la metodología SDD (Spec-Driven Development).

## Configuración del Entorno
El equipo utiliza una carpeta oculta en la raíz del proyecto para comunicarse:
- `.antigravity/team/tasks.json` -> Lista maestra de tareas, estados y dependencias.
- `.antigravity/team/mailbox/` -> Mensajes individuales (.msg).
- `.antigravity/team/broadcast.msg` -> Mensajes globales para todo el equipo.
- `.antigravity/team/locks/` -> Semáforos para evitar edición simultánea de archivos.
- `.antigravity/team/approvals/` -> Solicitudes HITL para aprobación de contenido crítico.

## Roles del Equipo (Anclora Content Generator AI)
1. **Director (Anclorabot)**: El líder. Divide el problema, asigna roles y aprueba planes. Orquesta el desarrollo siguiendo el Plan de Desarrollo integral.
2. **Agent A (Database Architect)**: Diseño de schema SQL, migraciones, funciones pgvector, políticas RLS multi-tenant, seed data.
3. **Agent B (API & RAG Engineer)**: RAG Engine (embeddings, chunking, retrieval), API routes, integración con LLMs (Claude, Groq, Ollama), templates de contenido.
4. **Agent C (Frontend Engineer)**: Dashboard UI con Next.js 15 + React 19, componentes shadcn/ui, páginas del dashboard (Studio, Metrics, Settings, Overview).
5. **Agent D (Testing Specialist)**: Tests unitarios, tests de integración, validación de cobertura (objetivo 85%+), testing de flujos completos.
6. **Revisor (Devil's Advocate)**: Busca fallos, bugs, problemas de seguridad, validación GDPR/OWASP, revisión de código.


## Protocolo de Orquestación Avanzada

### 1. Modo de Planificación (Gatekeeping)
Antes de realizar cambios significativos, cada agente debe enviar un **Plan de Acción** al buzón de Anclorabot.
- El agente se mantiene en modo `READ_ONLY` o `PLANNING` hasta que Anclorabot responda con un mensaje de `APPROVED`.
- El plan debe incluir archivos a modificar/crear, dependencias y tiempo estimado.

### 2. Mensajería y Difusión (Broadcast)
- **Mensaje Directo**: Coordinación 1 a 1 entre especialistas.
- **Broadcast**: Anclorabot puede escribir en `broadcast.msg` para dar nuevas directrices a todo el equipo simultáneamente.
- **HITL Approval**: Para publicaciones de contenido externo, el agente debe solicitar aprobación humana en `.antigravity/team/approvals/`.

### 3. Sincronización de Tareas y Dependencias
- Las tareas en `tasks.json` pueden tener una lista de `dependencies`. Una IA no debe reclamar una tarea si sus dependencias no están en estado `COMPLETED`.
- **Ejemplo**: Agent B (API) no puede empezar hasta que Agent A (DB) complete el schema SQL.

### 4. Metodología SDD (Spec-Driven Development)
- Todo desarrollo de feature inicia con su especificación en `sdd/features/<feature>/<feature>-spec-v1.md`.
- Cada commit debe seguir la convención: `feat: [ANCLORA-FEAT-XXX] Descripción`.
- Validación obligatoria antes de completar tarea: `npm run lint && npm run build`.

### 5. Gobernanza de Layout (Dashboard)
- **CRÍTICO**: En rutas `/dashboard/*` NO se permite scroll vertical global del documento.
- El shell debe usar `h-screen` y `overflow-hidden` a nivel contenedor principal.
- Scroll interno debe ser `overflow-y-auto` en paneles/slots específicos.
- Cualquier violación de esta regla implica `Decision=NO-GO`.

## Reglas Críticas
- NUNCA editar un archivo si existe un .lock activo en `.antigravity/team/locks/`.
- Al completar una tarea, el agente debe liberar sus "locks" y notificar a Anclorabot.
- SIEMPRE validar con `npm run lint && npm run build` antes de marcar tarea como `COMPLETED`.
- NUNCA introducir scroll vertical global en rutas `/dashboard/*`.
- Commits aislados por feature siguiendo convención `feat: [ANCLORA-FEAT-XXX]`.

## Plan de Desarrollo por Fases

El proyecto sigue un plan estructurado en 6 fases según el documento "Plan de Desarrollo Anclora Content Generator AI":

### FASE 1: Fundamentos y Perfiles (Semana 1-2) ✅ COMPLETADA
- Proyecto Next.js 15 inicializado
- Perfiles sociales optimizados
- Templates de contenido creados
- Google Analytics 4 integrado

### FASE 2: RAG Engine + Content Generator MVP (Semana 3-5) 🔄 EN PROGRESO
**Objetivo**: Motor RAG funcional + Generador de contenido + Dashboard completo

**Delegación de agentes:**
- **Agent A**: Schema SQL (content_sources, knowledge_chunks, content_templates, generated_content, scheduled_posts, content_metrics, micro_zones) + funciones pgvector + RLS
- **Agent B**: RAG Engine (embeddings.ts ya existe, añadir chunking.ts, retrieval.ts) + API routes (generate, ingest, schedule, metrics) + Claude API integration
- **Agent C**: Dashboard pages (studio, metrics, settings, overview mejorado) + componentes UI adicionales
- **Agent D**: Suite de tests unitarios + integración (cobertura 85%+)

### FASE 3: Scheduling + Métricas + Alertas (Semana 6-7)
Content Scheduler, MetricsCalculator, LeadTracker, AlertService, n8n workflows

### FASE 4: Integración APIs Sociales + OAuth (Semana 8-9)
OAuth Service, LinkedIn Publisher, Meta Publisher, Blog Publisher

### FASE 5: SEO Programático + Optimización (Semana 10-11)
Topical Cluster Engine, SEO Metadata Generator, Internal Linking Automator, Brand Voice Validator

### FASE 6: Integración OpenClaw + Hardening (Semana 12-14)
OpenClaw Skill Registration, HITL Content Approval, Kill-Switch, Security Hardening

## Templates de Mensajes

### Template: Plan de Acción (Agent -> Anclorabot)
```json
{
  "de": "Agent_X",
  "para": "Anclorabot",
  "tipo": "PLAN_ACCION",
  "tarea_id": 123,
  "archivos_modificar": ["src/lib/db/schema.sql", "src/lib/db/migrations/001_initial.sql"],
  "archivos_crear": ["src/lib/db/seed.ts"],
  "dependencias": ["Tarea #120 completada"],
  "tiempo_estimado": "3-4 horas",
  "descripcion": "Implementar schema SQL completo con pgvector y políticas RLS multi-tenant"
}
```

### Template: Aprobación (Anclorabot -> Agent)
```json
{
  "de": "Anclorabot",
  "para": "Agent_X",
  "tipo": "APPROVED",
  "tarea_id": 123,
  "mensaje": "Plan aprobado. Procede con la implementación. Recuerda validar con npm run build al finalizar."
}
```

### Template: Tarea Completada (Agent -> Anclorabot)
```json
{
  "de": "Agent_X",
  "para": "Anclorabot",
  "tipo": "TASK_COMPLETED",
  "tarea_id": 123,
  "validaciones": {
    "lint": "✅ PASS",
    "build": "✅ PASS",
    "tests": "✅ PASS (87% coverage)"
  },
  "archivos_modificados": ["src/lib/db/schema.sql", "src/lib/db/seed.ts"],
  "commit_hash": "abc1234"
}
```

---

## 3. Script de Orquestación (team_manager.py)
*Este script automatiza la gestión de las tareas y la comunicación. Guárdalo como `team_manager.py`.*

```python
import json
import os
import sys

TEAM_DIR = ".antigravity/team"

def init_team():
    """Inicializa la infraestructura del equipo."""
    os.makedirs(f"{TEAM_DIR}/mailbox", exist_ok=True)
    os.makedirs(f"{TEAM_DIR}/locks", exist_ok=True)
    tasks_path = f"{TEAM_DIR}/tasks.json"
    if not os.path.exists(tasks_path):
        with open(tasks_path, 'w') as f:
            json.dump({"tasks": [], "members": []}, f, indent=2)
    if not os.path.exists(f"{TEAM_DIR}/broadcast.msg"):
        with open(f"{TEAM_DIR}/broadcast.msg", 'w') as f: f.write("")
    print("✓ Infraestructura 'Equipo Alejabot' lista.")

def assign_task(title, assigned_to, deps=[]):
    """Asigna una nueva tarea con soporte para dependencias."""
    path = f"{TEAM_DIR}/tasks.json"
    with open(path, 'r+') as f:
        data = json.load(f)
        task = {
            "id": len(data["tasks"]) + 1,
            "title": title,
            "status": "PENDING",
            "plan_approved": False,
            "assigned_to": assigned_to,
            "dependencies": deps
        }
        data["tasks"].append(task)
        f.seek(0)
        json.dump(data, f, indent=2)
    print(f"✓ Tarea {task['id']} ({title}) asignada a {assigned_to}.")

def broadcast(sender, text):
    """Envía un mensaje a todos los miembros del equipo."""
    msg = {"de": sender, "tipo": "BROADCAST", "mensaje": text}
    with open(f"{TEAM_DIR}/broadcast.msg", 'a') as f:
        f.write(json.dumps(msg) + "\n")
    print(f"✓ Mensaje global enviado por {sender}.")

def send_message(sender, receiver, text):
    """Envía un mensaje al buzón de un agente específico."""
    msg = {"de": sender, "mensaje": text}
    with open(f"{TEAM_DIR}/mailbox/{receiver}.msg", 'a') as f:
        f.write(json.dumps(msg) + "\n")
    print(f"✓ Mensaje enviado a {receiver}.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "init": init_team()
```

---

## 4. Cómo usarlo
1. **Activa el Líder**: Pídele a Antigravity: *"Usa la habilidad Equipo Anclorabot para inicializar este proyecto"*.
2. **Reparte el trabajo**: **Anclorabot** dividirá el trabajo. Abre terminales nuevas para cada agente (Frontend, Marketer, etc.).
3. **Flujo de Planificación**: Los agentes envían sus planes a Anclorabot antes de empezar. Un equipo bien coordinado es imparable.

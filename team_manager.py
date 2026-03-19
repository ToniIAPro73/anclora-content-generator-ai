#!/usr/bin/env python3
"""
Anclora Team Manager - Script de orquestación de agentes
Gestiona tareas, comunicación y sincronización del equipo multiagente
"""

import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional

TEAM_DIR = ".antigravity/team"
TASKS_FILE = f"{TEAM_DIR}/tasks.json"
BROADCAST_FILE = f"{TEAM_DIR}/broadcast.msg"
MAILBOX_DIR = f"{TEAM_DIR}/mailbox"
LOCKS_DIR = f"{TEAM_DIR}/locks"
APPROVALS_DIR = f"{TEAM_DIR}/approvals"


def init_team():
    """Inicializa la infraestructura del equipo."""
    os.makedirs(MAILBOX_DIR, exist_ok=True)
    os.makedirs(LOCKS_DIR, exist_ok=True)
    os.makedirs(APPROVALS_DIR, exist_ok=True)

    if not os.path.exists(TASKS_FILE):
        initial_data = {
            "project": "Anclora Content Generator AI",
            "fase_actual": "FASE 2: RAG Engine + Content Generator MVP",
            "members": [],
            "tasks": []
        }
        with open(TASKS_FILE, 'w') as f:
            json.dump(initial_data, f, indent=2)

    if not os.path.exists(BROADCAST_FILE):
        with open(BROADCAST_FILE, 'w') as f:
            f.write("")

    print("✓ Infraestructura 'Equipo Anclorabot' lista.")


def load_tasks() -> Dict:
    """Carga el archivo de tareas."""
    with open(TASKS_FILE, 'r') as f:
        return json.load(f)


def save_tasks(data: Dict):
    """Guarda el archivo de tareas."""
    with open(TASKS_FILE, 'w') as f:
        json.dump(data, f, indent=2)


def assign_task(title: str, assigned_to: str, deps: List[int] = None,
                description: str = "", priority: str = "MEDIUM",
                estimated_hours: str = "1-2", feature: str = ""):
    """Asigna una nueva tarea con soporte para dependencias."""
    deps = deps or []
    data = load_tasks()

    task = {
        "id": len(data["tasks"]) + 1,
        "title": title,
        "description": description,
        "status": "PENDING",
        "plan_approved": False,
        "assigned_to": assigned_to,
        "dependencies": deps,
        "priority": priority,
        "estimated_hours": estimated_hours,
        "feature": feature,
        "deliverables": []
    }

    data["tasks"].append(task)
    save_tasks(data)

    print(f"✓ Tarea #{task['id']} ({title}) asignada a {assigned_to}.")
    return task['id']


def update_task_status(task_id: int, status: str, plan_approved: bool = None):
    """Actualiza el estado de una tarea."""
    data = load_tasks()

    for task in data["tasks"]:
        if task["id"] == task_id:
            task["status"] = status
            if plan_approved is not None:
                task["plan_approved"] = plan_approved
            save_tasks(data)
            print(f"✓ Tarea #{task_id} actualizada: status={status}")
            return

    print(f"✗ Tarea #{task_id} no encontrada")


def list_tasks(agent: Optional[str] = None, status: Optional[str] = None):
    """Lista todas las tareas, opcionalmente filtradas."""
    data = load_tasks()

    print(f"\n{'='*80}")
    print(f"PROYECTO: {data['project']}")
    print(f"FASE ACTUAL: {data['fase_actual']}")
    print(f"{'='*80}\n")

    for task in data["tasks"]:
        # Aplicar filtros
        if agent and task["assigned_to"] != agent:
            continue
        if status and task["status"] != status:
            continue

        # Mostrar tarea
        deps_str = f"Deps: {task['dependencies']}" if task['dependencies'] else "Sin deps"
        approval_str = "✓ APROBADO" if task.get("plan_approved") else "⏳ PENDIENTE APROBACIÓN"

        print(f"#{task['id']} [{task['status']}] {task['title']}")
        print(f"   Asignado a: {task['assigned_to']} | {deps_str} | {approval_str}")
        print(f"   Prioridad: {task['priority']} | Estimación: {task['estimated_hours']}h")
        if task.get('description'):
            print(f"   {task['description']}")
        print()


def broadcast(sender: str, text: str):
    """Envía un mensaje a todos los miembros del equipo."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    msg = f"\n{'='*80}\n"
    msg += f"BROADCAST DE {sender.upper()}\n"
    msg += f"Fecha: {timestamp}\n"
    msg += f"{'='*80}\n"
    msg += f"{text}\n"
    msg += f"{'='*80}\n"

    with open(BROADCAST_FILE, 'a') as f:
        f.write(msg)

    print(f"✓ Mensaje global enviado por {sender}.")


def send_message(sender: str, receiver: str, text: str, msg_type: str = "MESSAGE"):
    """Envía un mensaje al buzón de un agente específico."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    msg = {
        "timestamp": timestamp,
        "de": sender,
        "para": receiver,
        "tipo": msg_type,
        "mensaje": text
    }

    mailbox_file = f"{MAILBOX_DIR}/{receiver}.msg"
    with open(mailbox_file, 'a') as f:
        f.write(json.dumps(msg, ensure_ascii=False) + "\n")

    print(f"✓ Mensaje enviado a {receiver}.")


def read_messages(agent: str):
    """Lee los mensajes del buzón de un agente."""
    mailbox_file = f"{MAILBOX_DIR}/{agent}.msg"

    if not os.path.exists(mailbox_file):
        print(f"No hay mensajes para {agent}.")
        return

    print(f"\n{'='*80}")
    print(f"BUZÓN DE {agent.upper()}")
    print(f"{'='*80}\n")

    with open(mailbox_file, 'r') as f:
        for line in f:
            if line.strip():
                msg = json.loads(line)
                print(f"[{msg['timestamp']}] De: {msg['de']} | Tipo: {msg['tipo']}")
                print(f"   {msg['mensaje']}\n")


def acquire_lock(agent: str, file_path: str):
    """Adquiere un lock para un archivo."""
    lock_file = f"{LOCKS_DIR}/{file_path.replace('/', '_')}.lock"

    if os.path.exists(lock_file):
        with open(lock_file, 'r') as f:
            current_owner = f.read().strip()
        print(f"✗ Lock ya adquirido por {current_owner} en {file_path}")
        return False

    with open(lock_file, 'w') as f:
        f.write(f"{agent}\n{datetime.now().isoformat()}")

    print(f"✓ Lock adquirido por {agent} en {file_path}")
    return True


def release_lock(agent: str, file_path: str):
    """Libera un lock de un archivo."""
    lock_file = f"{LOCKS_DIR}/{file_path.replace('/', '_')}.lock"

    if not os.path.exists(lock_file):
        print(f"✗ No existe lock para {file_path}")
        return False

    with open(lock_file, 'r') as f:
        current_owner = f.read().strip().split('\n')[0]

    if current_owner != agent:
        print(f"✗ Lock pertenece a {current_owner}, no a {agent}")
        return False

    os.remove(lock_file)
    print(f"✓ Lock liberado por {agent} en {file_path}")
    return True


def main():
    """Función principal CLI."""
    if len(sys.argv) < 2:
        print("Uso: python team_manager.py <comando> [argumentos]")
        print("\nComandos disponibles:")
        print("  init                              - Inicializa infraestructura")
        print("  list [agent] [status]             - Lista tareas")
        print("  assign <title> <agent>            - Asigna tarea")
        print("  status <task_id> <status>         - Actualiza estado")
        print("  approve <task_id>                 - Aprueba plan de tarea")
        print("  broadcast <sender> <message>      - Envía broadcast")
        print("  send <sender> <receiver> <msg>    - Envía mensaje directo")
        print("  read <agent>                      - Lee buzón de agente")
        print("  lock <agent> <file>               - Adquiere lock")
        print("  unlock <agent> <file>             - Libera lock")
        return

    cmd = sys.argv[1]

    if cmd == "init":
        init_team()

    elif cmd == "list":
        agent = sys.argv[2] if len(sys.argv) > 2 else None
        status = sys.argv[3] if len(sys.argv) > 3 else None
        list_tasks(agent, status)

    elif cmd == "assign":
        if len(sys.argv) < 4:
            print("Uso: assign <title> <agent>")
            return
        assign_task(sys.argv[2], sys.argv[3])

    elif cmd == "status":
        if len(sys.argv) < 4:
            print("Uso: status <task_id> <status>")
            return
        update_task_status(int(sys.argv[2]), sys.argv[3])

    elif cmd == "approve":
        if len(sys.argv) < 3:
            print("Uso: approve <task_id>")
            return
        update_task_status(int(sys.argv[2]), "IN_PROGRESS", plan_approved=True)

    elif cmd == "broadcast":
        if len(sys.argv) < 4:
            print("Uso: broadcast <sender> <message>")
            return
        broadcast(sys.argv[2], " ".join(sys.argv[3:]))

    elif cmd == "send":
        if len(sys.argv) < 5:
            print("Uso: send <sender> <receiver> <message>")
            return
        send_message(sys.argv[2], sys.argv[3], " ".join(sys.argv[4:]))

    elif cmd == "read":
        if len(sys.argv) < 3:
            print("Uso: read <agent>")
            return
        read_messages(sys.argv[2])

    elif cmd == "lock":
        if len(sys.argv) < 4:
            print("Uso: lock <agent> <file>")
            return
        acquire_lock(sys.argv[2], sys.argv[3])

    elif cmd == "unlock":
        if len(sys.argv) < 4:
            print("Uso: unlock <agent> <file>")
            return
        release_lock(sys.argv[2], sys.argv[3])

    else:
        print(f"Comando desconocido: {cmd}")


if __name__ == "__main__":
    main()

# Tenancy Hardening Rules

- Ninguna ruta protegida debe confiar en `workspaceId` enviado por cliente.
- El server resuelve el contexto de tenancy desde la sesion autenticada.
- Los fallbacks temporales deben estar explicitados en spec y documentacion.
- Si una UI depende de datos de workspace, debe consumir rutas que ya resuelvan tenancy en server.

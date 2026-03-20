# Better Auth Migration Rules

- `Neon` es la base de datos unica para auth y dominio.
- Ninguna ruta nueva de auth debe depender de `Supabase Auth`.
- La coexistencia temporal con Supabase solo se permite como mecanismo de transicion.
- `organization` de Better Auth es el modelo objetivo para `workspace`.
- La validacion de sesion debe privilegiar componentes server y route handlers frente a middleware fragil.

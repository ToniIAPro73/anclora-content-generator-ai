# TEST PLAN: ANCLORA-FEAT-INIT

## Entorno Local
1. `npm run dev` sin errores.
2. Renderizado correcto de `/dashboard` con `Sidebar` y `Topbar`.
3. Ningún warning o alerta visual de desbordamiento (scroll vertical) en el Layout Shell.
4. El botón ThemeToggle cicla correctamente entre modo oscuro y claro (Next-Themes cambia clase `dark` en HTML).

## Verificación de Código Estático
1. `npm run lint` ejecuta sin errores (`0 warnings, 0 errors`).
2. `npm run build` genera la carpeta `.next` con éxito y sin errores de tipado en TypeScript.

## Criterios de Aceptación de Gobernanza
1. El proyecto inicializa los estilos correctos: Fuente `Outfit` e `Inter` referenciadas en `globals.css`.
2. Las variables de colores (Cian oscuro, púrpuras, fondo Oled en dark) aplican a los componentes principales.

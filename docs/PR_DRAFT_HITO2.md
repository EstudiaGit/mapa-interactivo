# PR: Hito 2 (parcial) – Integración Leaflet SSR-safe, toggle Sidebar y mejoras UX/Tooling

## Resumen
Este PR integra Leaflet en un entorno Next.js (App Router, React 19) de forma SSR-safe, mejora la UX del Sidebar (ocultar/mostrar en móvil y desktop con mapa full-screen) y ajusta tooling para un desarrollo más fluido.

## Cambios clave
- Leaflet integrado de forma SSR-safe:
  - `components/Map.tsx`: dynamic import con `ssr: false` y fallback de carga.
  - `components/MapLeaflet.tsx`: componente client-only con montaje diferido (`useEffect`) y `key` única (`useId`) para evitar reusos del contenedor en hot reload.
  - Estilos de Leaflet importados en el componente client-only.
- Controles de zoom reposicionados al extremo derecho vía CSS global (sin `ZoomControl`) para evitar errores en React 19.
- Sidebar:
  - Ocultar/mostrar en móvil y desktop; cuando está oculto, mapa ocupa toda la pantalla.
  - Correcciones de `z-index` y `pointer-events` para que el mapa no cubra UI.
  - Botón "Ocultar" (desktop) y "×" (móvil); botón de menú fijo para reabrir cuando está oculto.
- Tooling:
  - `package.json`: `dev` → `next dev` (Turbopack); `build` → `next build`.
  - PostCSS: se elimina `postcss.config.mjs`; se mantiene `postcss.config.js` (Tailwind 3.x + autoprefixer).

## Motivación y contexto
- Evitamos hydration mismatches y errores de hot reload típicos con react-leaflet en App Router.
- Aseguramos que la UI (chat, iconos) quede por encima del mapa.
- Mejoramos la ergonomía del desarrollo y build.

## Notas técnicas
- React 19 + react-leaflet: se usa render diferido y `key` única para `MapContainer`.
- Reposicionar controles por CSS es un workaround robusto en esta combinación.

## Plan de pruebas
- `npm run dev` (Turbopack) y abrir `/`.
- Verificar:
  - El mapa carga sin errores.
  - Los controles de zoom están en el extremo derecho y funcionan.
  - El Sidebar se oculta/muestra, y el mapa ocupa toda la pantalla al estar oculto.
  - La ventana de chat y el icono no quedan tapados por el mapa (z-index correcto).
  - Hot reload no causa errores en el mapa.

## Pendientes (siguientes PRs)
- Hito 2: Markers + estado global (Zustand) con IDs únicos.
- Hito 2: Eventos del mapa (click para crear marker, selección desde lista para centrar).
- Hito 3: Chat (API mock + wiring, estados de loading/error).
- SEO/metadata en `app/layout.tsx`.

## Checklist
- [x] Sin errores en build y dev.
- [x] SSR del resto de la app intacto (mapa client-only).
- [x] Accesibilidad básica del Sidebar y UI flotante.
- [x] Tooling uniforme (PostCSS, scripts NPM).

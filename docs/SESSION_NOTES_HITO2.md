# Hito 2 – Integración Leaflet SSR-safe y ajustes Sidebar/Mapa

Fecha: YYYY-MM-DD (actualiza con tu fecha actual)

## Resumen
- Integración de Leaflet de forma SSR-safe con Next App Router:
  - Dynamic import (ssr: false) en `components/Map.tsx`.
  - Montaje diferido en cliente y key única en `components/MapLeaflet.tsx` para evitar reuso del contenedor con Hot Reload.
- Controles de zoom reposicionados a la derecha mediante CSS global en `app/globals.css` (sin usar `ZoomControl`), evitando errores en runtime.
- Sidebar: ocultar/mostrar en móvil y escritorio; cuando está oculto el mapa ocupa toda la pantalla. Botón de menú visible para reabrir.
- Ajustes de z-index para que el Chat y botones no queden tapados por el mapa.
- Tooling: Turbopack en dev, build script corregido, configuración PostCSS unificada.

## Cambios realizados
- `package.json`:
  - `dev` → `next dev` (Turbopack por defecto).
  - `build` → `next build` (sin `--webpack`).
- PostCSS:
  - Eliminado `postcss.config.mjs`; se mantiene `postcss.config.js` (Tailwind 3.x + autoprefixer).
- `components/MapLeaflet.tsx`:
  - `"use client"`, `import 'leaflet/dist/leaflet.css'`.
  - Render diferido con `useEffect` + `useState(mounted)`.
  - `key={useId()}` en `MapContainer`.
  - Tamaño con `className="w-full h-full"`.
- `components/Map.tsx`:
  - `dynamic(() => import('@/components/MapLeaflet'), { ssr: false, loading: ... })`.
- `app/globals.css`:
  - CSS para mover controles de zoom al extremo derecho:
    ```css
    .leaflet-top.leaflet-left { left: auto; right: 0.75rem; }
    .leaflet-control-zoom { box-shadow: 0 1px 3px rgba(0,0,0,0.3); border-radius: 8px; }
    .leaflet-control-zoom a { width: 32px; height: 32px; line-height: 32px; }
    ```
- `components/Sidebar.tsx`:
  - Ahora el estado `isOpen` controla visibilidad en mobile y desktop.
  - En desktop: abierto → `md:relative md:w-96`; cerrado → `md:absolute md:w-0 md:-translate-x-full`.
  - Cuando está cerrado: `pointer-events-none`, `p-0`, `z-0` para no bloquear clics.
  - Botón "Ocultar" en desktop y "×" en móvil; `aria-hidden` coherente.
- `components/ChatBubble.tsx` / `components/ChatWindow.tsx`:
  - `z-50` (o `md:z-50`) para quedar por encima del mapa.

## Problemas encontrados y soluciones
- Hydration mismatch por usar `window.innerWidth` en SSR para `aria-hidden` del Sidebar.
  - Solución: detectar mobile con `useEffect`, estado `isMobile`, y usarlo en cliente; primer render consistente con SSR.
- React 19 + react-leaflet en dev: `Map container is being reused by another instance`.
  - Solución: render diferido y `key` única (`useId`) para `MapContainer`.
- Uso de `ZoomControl` causaba `Cannot read properties of undefined (reading 'topright')` en algunos escenarios.
  - Solución: mantener controles por defecto y reposicionarlos con CSS.
- `@import` en `app/globals.css` provocaba error de orden con Turbopack.
  - Solución: mover import de estilos de Leaflet al componente client-only (`MapLeaflet.tsx`).

## Pendientes / Roadmap
- Markers + estado global (Zustand) con IDs únicos persistentes (no índices).
- Eventos del mapa:
  - Click en mapa añade marker.
  - Click en item del Sidebar centra/selecciona marker en el mapa.
- Hito 3: Chat (API mock `pages/api/chat` o `app/api/chat`, manejo de `loading` y `error`).
- SEO/metadata en `app/layout.tsx` (title/description).
- UX Sidebar: micro-animaciones, sombra/borde, foco accesible al abrir.

## Plan de prueba
- Ejecutar `npm run dev` (Turbopack) y validar:
  - El mapa carga sin errores y con controles de zoom a la derecha.
  - Ocultar/mostrar Sidebar en desktop y móvil; mapa ocupa full screen al ocultar.
  - Chat e iconos quedan por encima del mapa (z-index correcto).
- Verificar que Hot Reload no dispara errores de Leaflet.

## Cómo ejecutar
- `npm install`
- `npm run dev`
- Navegar a `/`.

## Notas técnicas
- Next.js App Router + React 19 + react-leaflet requieren evitar SSR directo del mapa y cuidar Hot Reload.
- Reposicionar controles por CSS es un workaround robusto en esta combinación.

## Próximos pasos sugeridos
1) Implementar Zustand para estado de ubicaciones (id, lat, lng, título).
2) Renderizar markers desde la store; CRUD básico.
3) Eventos: click mapa añade marker; click lista centra mapa.
4) Hito 3: API mock para Chat y wiring del formulario.
5) Actualizar metadata en `layout.tsx`.

### Agenda sugerida para próxima sesión (foco ejecutable)
- Implementar store con Zustand (types, actions, persist opcional).
- Agregar Marker de ejemplo y listado inicial conectado al Sidebar.
- onClick en mapa: crear marker con id único, añadir a store.
- onClick en item del Sidebar: centrar mapa y resaltar marker.
- Validar en dev (Turbopack) y documentar brevemente.

### Agenda confirmada por el usuario para la próxima sesión
1) Integración completa de Zustand en mapa y Sidebar:
   - Instalar dependencia: `npm install zustand`.
   - Renderizar markers desde `useMapStore` en MapLeaflet.
   - Añadir marker con click en mapa; seleccionar desde Sidebar centra y resalta.
   - Considerar `invalidateSize()` tras abrir/cerrar Sidebar si se detectan tiles en blanco.
2) Preparar Pull Request:
   - Crear rama `feature/hito2-leaflet-sidebar` y PR con `docs/PR_DRAFT_HITO2.md`.
3) Vinculaciones Atlassian:
   - Enlazar la página de Confluence (space SD) a los issues KAN-1..KAN-6.
   - Mover KAN-1 y KAN-2 a "To Do" en el tablero.

## Sugerencias de seguimiento (Confluence/Jira)
- Confluence: crear página con este resumen (puedes copiar/pegar) en el espacio adecuado.
- Jira: crear issues para Markers/Estado (Story), Eventos (Story), Chat (Story), SEO (Task), UX Sidebar (Task), Compatibilidad react-leaflet (Task).

---
Documento preparado por Rovo Dev para referencia inicial de la próxima sesión.

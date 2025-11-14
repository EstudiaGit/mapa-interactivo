# Jira – Hito 2/3: Issues sugeridos (copiar/pegar)

## MAPA-101: Hito 2 – Markers + Estado global (Zustand)
Tipo: Story
Prioridad: Medium
Labels: map, leaflet, nextjs, state, zustand

Resumen:
Implementar una store de ubicaciones (id, lat, lng, título) con Zustand y renderizar markers desde la store.

Descripción:
- Crear `hooks/useMapStore.ts` con tipos y acciones (add, remove, rename, select, setCenter, setZoom).
- Renderizar markers en el mapa a partir del estado global.
- CRUD básico desde el Sidebar y el mapa.

Criterios de aceptación:
- Puedo ver markers renderizados desde la store global.
- Puedo añadir/eliminar/renombrar ubicaciones.
- IDS únicos persistentes (no índices de array).

---

## MAPA-102: Hito 2 – Eventos del mapa y sincronización con Sidebar
Tipo: Story
Prioridad: Medium
Labels: map, leaflet, events, ui

Resumen:
Añadir eventos de interacción en el mapa y sincronizar con la lista del Sidebar.

Descripción:
- Click en el mapa añade un marker con id único y título por defecto (ej. "Marcador N").
- Click en item del Sidebar centra el mapa en el marker y lo resalta (selectedId en store).
- Considerar `invalidateSize` si fuese necesario tras abrir/cerrar Sidebar.

Criterios de aceptación:
- Click en mapa crea marker.
- Click en lista centra y resalta marker.
- Sin errores de hidratación y en hot reload.

---

## MAPA-103: Hito 3 – Chat con el mapa (API mock + wiring)
Tipo: Story
Prioridad: Low-Medium
Labels: chat, api, ui

Resumen:
Conectar el formulario de chat a una API mock y manejar estados UI.

Descripción:
- Implementar `/api/chat` (App Router) con respuesta mock.
- Manejar estados loading/error en `components/ChatWindow.tsx`.
- Preparar estructura para futura integración con proveedor IA real.

Criterios de aceptación:
- Mensajes se envían y reciben (mock) con estados visibles.
- Sin errores en dev y build.

---

## MAPA-104: SEO/Metadata en layout
Tipo: Task
Prioridad: Low
Labels: seo, nextjs

Resumen:
Actualizar metadata (title/description) en `app/layout.tsx` para la app.

Criterios de aceptación:
- Title y description actualizados coherentemente con el producto.

---

## MAPA-105: UX – Mejora Toggle Sidebar
Tipo: Task
Prioridad: Low-Medium
Labels: ui, a11y

Resumen:
Refinar animaciones, sombra/borde y foco accesible del Sidebar.

Criterios de aceptación:
- Transición más fluida.
- Sombra/borde sutil cuando está abierto.
- Foco se mueve al contenedor al abrirlo.

---

## MAPA-106: Compatibilidad react-leaflet y React 19
Tipo: Task
Prioridad: Low
Labels: tech-debt, investigation

Resumen:
Revisar compatibilidad y plan B si aparecen issues.

Criterios de aceptación:
- Documento con hallazgos y decisión: mantener React 19 o fijar React 18.

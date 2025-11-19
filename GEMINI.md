# Resumen del Proyecto: Mapa Interactivo con Asistente de IA

Este es un proyecto de aplicación web que combina un mapa interactivo con un asistente de chat impulsado por Inteligencia Artificial. Permite a los usuarios interactuar con el mapa usando lenguaje natural para añadir, listar y buscar ubicaciones.

## Pila Tecnológica (Tech Stack)

- **Framework:** Next.js 14+ (usando App Router)
- **Lenguaje:** TypeScript
- **UI:** React 18+
- **Estilos:** Tailwind CSS
- **Mapa:**
  - `leaflet`: Librería principal para el mapa interactivo.
  - `react-leaflet`: Componentes de React para Leaflet.
- **Inteligencia Artificial:**
  - `@google/generative-ai`: SDK oficial de Google para usar modelos como Gemini.
  - Se utiliza el modelo `gemini-2.5-flash` con "function calling".
- **Manejo de Estado:**
  - `zustand`: Para gestionar el estado global del chat y del mapa de forma simple.
- **Otros:**
  - `zod`: Para la validación de esquemas de las herramientas de la IA.
  - `framer-motion`: Para animaciones en la interfaz.

## Arquitectura y Flujo de Datos

1.  **Interfaz de Usuario (Cliente):**
    - Construida con React y componentes de `react-leaflet`.
    - La UI principal en `app/page.tsx` renderiza el `Map`, la `Sidebar` y la ventana de `ChatWindow`.
    - Los estados del mapa (marcadores, centro) y del chat (mensajes) se gestionan con stores de Zustand (`useMapStore`, `useChatStore`).
    - Cuando un usuario envía un mensaje, se captura en el `ChatWindow`.

2.  **Llamada a la API (Cliente → Servidor):**
    - El mensaje del usuario, junto con el contexto actual del mapa (marcadores y centro), se envía mediante una petición `POST` al endpoint del backend: `/api/chat`.

3.  **Procesamiento en el Backend (Servidor):**
    - El endpoint `/api/chat/route.ts` recibe la petición.
    - **Contextualización:** Construye un *prompt* para el modelo de IA que incluye:
      - Un rol definido ("Eres un asistente de mapas...").
      - El estado actual del mapa (marcadores existentes, etc.).
      - El historial de la conversación.
      - El mensaje del usuario.
    - **Interacción con Gemini:** Se comunica de forma segura con la API de Google AI usando la API key almacenada en las variables de entorno del servidor.
    - **Function Calling:** Si la IA determina que debe usar una herramienta (ej: `add_marker`), el backend ejecuta la función correspondiente (`executeServerAction`). El resultado de la herramienta se envía de vuelta a la IA para que genere una respuesta final en lenguaje natural.

4.  **Respuesta al Cliente (Servidor → Cliente):**
    - La respuesta final de la IA (texto y/o datos de la herramienta usada) se devuelve al cliente.
    - La interfaz se actualiza: se muestra el mensaje de la IA y se ejecutan las acciones en el mapa (como añadir un nuevo marcador) a través de los stores de Zustand.

## Funcionalidades Clave

### 1. Mapa Interactivo

- Muestra un mapa base de OpenStreetMap.
- Permite la visualización de marcadores personalizados.
- El estado del mapa (coordenadas, zoom, marcadores) es gestionado centralizadamente por `useMapStore`.

### 2. Asistente de IA (Chat)

- Proporciona una interfaz de chat para que el usuario dé instrucciones.
- Utiliza el modelo `gemini-2.5-flash` de Google, configurado para ser un experto en mapas.
- Mantiene el historial de la conversación para dar respuestas contextuales.

### 3. Herramientas de IA (Function Calling)

El núcleo de la funcionalidad reside en las herramientas que la IA puede ejecutar. Estas están definidas en `lib/chat-tools.ts`:

- **`add_marker`**: Agrega un marcador en coordenadas específicas.
- **`remove_marker`**: Elimina un marcador existente por su ID.
- **`list_markers`**: Devuelve una lista de todos los marcadores actuales.
- **`center_map`**: Centra la vista del mapa en una nueva ubicación.
- **`search_location`**: Utiliza un servicio de geocodificación para encontrar las coordenadas de una dirección o lugar.

## Archivos Importantes

- `app/page.tsx`: Componente principal que ensambla la UI.
- `app/api/chat/route.ts`: El corazón del backend; maneja la lógica de la IA.
- `lib/chat-tools.ts`: Define las herramientas (function calls) disponibles para el modelo de IA.
- `app/api/chat/actions.ts`: Ejecuta la lógica de las herramientas en el lado del servidor.
- `hooks/useMapStore.ts`: Store de Zustand para el estado del mapa.
- `hooks/useChatStore.ts`: Store de Zustand para los mensajes del chat.
- `components/Map.tsx`: El componente principal del mapa.
- `components/ChatWindow.tsx`: La interfaz del chat.

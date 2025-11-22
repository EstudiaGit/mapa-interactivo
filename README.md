# Mapa Interactivo – Next.js + Leaflet + Gemini AI

Aplicación web moderna para la gestión y visualización interactiva de ubicaciones en un mapa, potenciada por **Gemini 2.5 Flash**. Implementa una arquitectura de **"Nested Grounding"** para combinar búsqueda web en tiempo real con control preciso del mapa mediante Function Calling.

---

## 🚀 Tecnologías Principales

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19
- **Mapas:** Leaflet + react-leaflet
- **Geocoding:** Nominatim (OpenStreetMap)
- **Estilos:** Tailwind CSS
- **IA/Chat:** Google Generative AI SDK (`@google/generative-ai`)
- **Modelo:** Gemini 2.5 Flash
- **Estado:** Zustand

---

## ✨ Características Destacadas

### 🧠 Arquitectura "Nested Grounding"
Para superar las limitaciones de compatibilidad entre *Grounding* (búsqueda web) y *Function Calling* en el modelo Gemini 2.5 Flash, hemos implementado una solución personalizada:
1. **Instancia Principal:** Gestiona la conversación y las herramientas de control del mapa (`add_marker`, `center_map`, etc.).
2. **Instancia Secundaria (Nested):** Se activa exclusivamente cuando la IA necesita buscar información en internet (`search_web`). Realiza la búsqueda y devuelve un resumen estructurado a la instancia principal.

### 🔄 Function Calling Recursivo
El sistema de chat es capaz de encadenar acciones de forma autónoma.
*Ejemplo:* "Busca farmacias de guardia y añade la más cercana."
1. **Paso 1:** La IA usa `search_web` para encontrar farmacias.
2. **Paso 2:** Con la información obtenida, usa `search_location` para obtener coordenadas precisas.
3. **Paso 3:** Finalmente, usa `add_marker` para guardarla en el mapa.

### 🗺️ Herramientas Disponibles (Tools)
La IA tiene acceso a las siguientes herramientas para interactuar con el entorno:
- **`search_web`**: Búsqueda en Google en tiempo real (Noticias, eventos, lugares).
- **`search_location`**: Geocodificación precisa de direcciones (Calle, número, ciudad).
- **`add_marker`**: Añade un marcador al mapa con metadatos.
- **`remove_marker`**: Elimina marcadores existentes.
- **`list_markers`**: Consulta la lista de ubicaciones guardadas.
- **`center_map`**: Mueve la vista del mapa a una ubicación específica.

---

## 📁 Estructura del Proyecto

- **app/api/chat/**  
  - `route.ts`: Endpoint principal. Maneja el bucle de conversación y la orquestación de herramientas.
  - `actions.ts`: Ejecución de acciones en el servidor, incluyendo la lógica de "Nested Grounding" y llamadas a Nominatim.

- **lib/**
  - `chat-tools.ts`: Definición de tipos y esquemas de las herramientas disponibles para la IA.

- **components/**  
  - Componentes de UI modulares (`ChatWindow`, `MapLeaflet`, `Sidebar`, etc.).

- **hooks/**  
  - `useMapStore`: Gestión del estado global del mapa (marcadores, centro, zoom).

---

## 🛠️ Configuración y Desarrollo

### Prerrequisitos
Necesitas una API Key de Google AI Studio con acceso a Gemini 2.5 Flash.

1. **Clonar e Instalar:**
   ```bash
   git clone <repo-url>
   cd mapa-interactivo
   npm install
   ```

2. **Configurar Variables de Entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   GOOGLE_AI_API_KEY=tu_api_key_aqui
   ```

3. **Iniciar Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   Accede a [http://localhost:3000](http://localhost:3000)

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, asegúrate de:
- Mantener la separación de responsabilidades entre componentes de cliente y servidor.
- Seguir el patrón de "Nested Grounding" si modificas la lógica de búsqueda.
- Tipar correctamente nuevas herramientas en `lib/chat-tools.ts`.

---

## 📄 Licencia

MIT
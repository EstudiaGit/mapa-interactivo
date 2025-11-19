# Mapa Interactivo – Next.js + Leaflet

Aplicación web moderna para la gestión y visualización interactiva de ubicaciones en un mapa, desarrollada con Next.js, React y Leaflet. Incluye chat asistido por IA y una arquitectura modular, escalable y preparada para futuras integraciones.

---

## 🚀 Tecnologías Principales

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19
- **Mapas:** Leaflet + react-leaflet
- **Estilos:** Tailwind CSS
- **Validación:** Zod
- **Tipado:** TypeScript
- **IA/Chat:** @google/genai, @modelcontextprotocol/sdk

---

## 📁 Estructura del Proyecto

- **app/**  
  Contiene la configuración principal de la aplicación:
  - `page.tsx`: Página principal, orquesta los componentes clave.
  - `layout.tsx`: Layout global y fuentes.
  - `globals.css`: Estilos globales.
  - `favicon.ico`: Icono de la aplicación.
  - **api/**: Carpeta para futuros endpoints API.

- **components/**  
  Componentes reutilizables y especializados:
  - Chat: `ChatWindow`, `ChatBubble`, `ChatMessage`, `ChatDock`, `ChatActionMessage`.
  - UI: `Sidebar`, `MenuButton`, `Modal`, `ModalProvider`, `PromptDialog`, `ConfirmDialog`, `ToastContainer`.
  - Mapas: `Map`, `MapLeaflet`.

- **hooks/**  
  Hooks personalizados para gestión de estado y acciones:
  - `useChatActions`, `useChatStore`, `useMapStore`, `useModal`, `useModalStore`, `useServerActions`, `useToastStore`.

- **public/**  
  Recursos estáticos:
  - Imágenes, íconos de mapas, SVGs y otros assets.

- **Configuración raíz:**  
  - `package.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `.gitignore`

---

## 🛠️ Instalación y Desarrollo

1. Instala las dependencias:
   ```
   npm install
   ```
2. Inicia el entorno de desarrollo:
   ```
   npm run dev
   ```
   Accede a [http://localhost:3000](http://localhost:3000)

3. Genera el build para producción:
   ```
   npm run build
   ```
4. Inicia el servidor en producción:
   ```
   npm start
   ```

---

## 🌐 Despliegue

- **Vercel:** Compatible y recomendado para despliegue serverless.
- **Otros entornos:** Next.js soporta despliegue en cualquier plataforma Node.js.

---

## ✨ Características Principales

- **Mapa interactivo:** Integración avanzada con Leaflet, preparado para markers dinámicos y futuras extensiones.
- **Gestión de ubicaciones:** Sidebar con datos simulados, listo para integración con estado global y fuentes externas.
- **Chat asistente:** Ventana flotante para interacción con IA, útil para búsqueda, ayuda y gestión de ubicaciones.
- **Arquitectura escalable:** Código modular, tipado y preparado para futuras integraciones (Zustand, APIs externas).
- **Estilos modernos:** Tailwind CSS y fuentes optimizadas para una experiencia visual atractiva.

---

## 🤝 Recomendaciones para Contribución

- Sigue las convenciones de Next.js, React y TypeScript.
- Mantén el código modular, reutilizable y documentado.
- Utiliza hooks personalizados para la gestión de estado y lógica.
- Las pull requests y sugerencias son bienvenidas para mejorar la funcionalidad y la arquitectura.

---

## 📄 Licencia

MIT

---
# Mapa Interactivo – Next.js + Leaflet

Aplicación web moderna para la gestión y visualización interactiva de ubicaciones en un mapa, desarrollada con Next.js, React y Leaflet. Incluye chat asistido por IA y una arquitectura preparada para escalar y añadir nuevas funcionalidades.

---

## 🚀 Tecnologías Principales

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend:** [React 19](https://react.dev/)
- **Mapas:** [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Validación:** [Zod](https://zod.dev/)
- **Tipado:** [TypeScript](https://www.typescriptlang.org/)
- **IA/Chat:** [@google/genai](https://www.npmjs.com/package/@google/genai), [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

---

## 📁 Estructura del Proyecto

- `app/` – Páginas principales, layout global y estilos
  - `page.tsx`: Página principal (orquesta Sidebar, Map y ChatWindow)
  - `layout.tsx`: Layout raíz y fuentes globales
  - `globals.css`: Estilos globales y Tailwind
- `components/` – Componentes reutilizables
  - `Map.tsx`: Contenedor del mapa interactivo (integración con Leaflet en próximos hitos)
  - `Sidebar.tsx`: Listado de ubicaciones (mock data, integración futura con Zustand)
  - `ChatWindow.tsx`: Chat flotante asistido por IA
- `public/` – Recursos estáticos (SVGs, favicon)
- `hooks/` – (Preparado para hooks personalizados)
- Configuración:
  - `package.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `.gitignore`

---

## 🛠️ Instalación y Desarrollo

1. **Instala dependencias:**
   ```sh
   npm install
   ```
2. **Desarrolla localmente:**
   ```sh
   npm run dev
   ```
   Accede a [http://localhost:3000](http://localhost:3000)

3. **Build para producción:**
   ```sh
   npm run build
   ```
4. **Inicia el servidor de producción:**
   ```sh
   npm start
   ```

---

## 🌐 Despliegue

- **Vercel:** Compatible y recomendado para despliegue serverless.
- **Otros entornos:** Next.js soporta despliegue en cualquier plataforma Node.js.

---

## ✨ Características

- **Mapa interactivo:** Preparado para integración con Leaflet y markers dinámicos.
- **Gestión de ubicaciones:** Sidebar con mock data, preparado para integración con estado global.
- **Chat asistente:** Ventana flotante para interacción con IA (búsqueda, ayuda, gestión de ubicaciones).
- **Arquitectura escalable:** Código modular, tipado y preparado para futuras integraciones (Zustand, APIs externas).
- **Estilos modernos:** Tailwind CSS y fuentes optimizadas.

---

## 🤝 Contribución

- Sigue las convenciones de Next.js, React y TypeScript.
- Mantén el código modular y documentado.
- Pull requests y sugerencias son bienvenidas.

---

## 📄 Licencia

MIT

---

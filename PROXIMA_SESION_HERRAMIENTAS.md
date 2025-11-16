# 🛠️ Próxima Sesión - Agregar Más Herramientas al Function Calling

## 📋 Plan de Implementación

### **Objetivo:**
Expandir las capacidades de la IA agregando nuevas herramientas para hacer la aplicación más poderosa y útil.

---

## 🎯 Herramientas a Implementar

### **1. 📝 update_marker - Actualizar Marcadores**

**Descripción:**
Permite a la IA editar marcadores existentes (cambiar nombre, descripción, dirección, etc.)

**Parámetros:**
- `marker_id` (string, requerido): ID del marcador a actualizar
- `name` (string, opcional): Nuevo nombre
- `description` (string, opcional): Nueva descripción
- `address` (string, opcional): Nueva dirección
- `latitude` (number, opcional): Nueva latitud
- `longitude` (number, opcional): Nueva longitud

**Ejemplos de uso:**
- *"Cambia el nombre del primer marcador a 'Nueva Oficina'"*
- *"Actualiza la descripción del marcador de la cafetería"*
- *"Mueve el marcador de mi casa a las coordenadas 28.15, -15.45"*

**Archivos a modificar:**
- `lib/chat-tools.ts` - Agregar definición y ejecución
- `hooks/useChatActions.ts` - Ya existe `updateMarker`, solo verificar

---

### **2. 🗺️ calculate_route - Calcular Rutas**

**Descripción:**
Calcula la ruta entre dos marcadores o coordenadas.

**Parámetros:**
- `from_marker_id` (string, opcional): ID del marcador origen
- `to_marker_id` (string, opcional): ID del marcador destino
- `from_coordinates` (object, opcional): {lat, lng} origen
- `to_coordinates` (object, opcional): {lat, lng} destino
- `mode` (enum, opcional): "walking", "driving", "cycling"

**Ejemplos de uso:**
- *"¿Cómo llego desde mi casa a la oficina?"*
- *"Calcula la ruta entre el primer y segundo marcador"*
- *"¿Cuánto tardo caminando de mi casa al gimnasio?"*

**Implementación:**
- Usar API de OpenRouteService (gratuita) o OSRM
- Devolver distancia, tiempo y polilínea de la ruta
- Mostrar ruta en el mapa

**Archivos nuevos:**
- `lib/routing-service.ts` - Servicio para calcular rutas
- `components/RouteLayer.tsx` - Componente para mostrar rutas en el mapa

**Archivos a modificar:**
- `lib/chat-tools.ts` - Agregar herramienta
- `hooks/useMapStore.ts` - Agregar estado para rutas activas
- `components/MapLeaflet.tsx` - Renderizar rutas

---

### **3. 📍 find_nearby - Buscar Lugares Cercanos**

**Descripción:**
Busca lugares de interés cerca de un marcador o coordenadas.

**Parámetros:**
- `marker_id` (string, opcional): ID del marcador de referencia
- `coordinates` (object, opcional): {lat, lng} de referencia
- `category` (enum, opcional): "restaurant", "cafe", "hotel", "parking", "pharmacy", "hospital", "atm"
- `radius` (number, opcional): Radio de búsqueda en metros (default: 1000)
- `limit` (number, opcional): Máximo de resultados (default: 10)

**Ejemplos de uso:**
- *"Busca restaurantes cerca de mi oficina"*
- *"¿Hay farmacias en un radio de 500m de mi ubicación?"*
- *"Encuentra los 5 cafés más cercanos al primer marcador"*

**Implementación:**
- Usar Overpass API (OpenStreetMap) - gratuita
- Devolver lista de lugares con distancia
- Opción de agregar resultados como marcadores

**Archivos nuevos:**
- `lib/places-service.ts` - Servicio para buscar lugares

**Archivos a modificar:**
- `lib/chat-tools.ts` - Agregar herramienta

---

### **4. 📊 get_statistics - Estadísticas de Marcadores**

**Descripción:**
Proporciona estadísticas sobre los marcadores guardados.

**Parámetros:**
- Ninguno (opera sobre todos los marcadores)

**Responde con:**
- Número total de marcadores
- Centro geométrico de todos los marcadores
- Distancia promedio entre marcadores
- Marcador más al norte/sur/este/oeste
- Área cubierta por los marcadores

**Ejemplos de uso:**
- *"Dame estadísticas sobre mis ubicaciones"*
- *"¿Cuál es el centro de todos mis marcadores?"*
- *"¿Qué área cubren mis puntos guardados?"*

**Archivos a modificar:**
- `lib/chat-tools.ts` - Agregar herramienta
- Crear funciones de análisis geométrico

---

### **5. 🏷️ add_category - Categorizar Marcadores**

**Descripción:**
Asigna categorías a los marcadores para mejor organización.

**Parámetros:**
- `marker_id` (string, requerido): ID del marcador
- `category` (enum, requerido): "work", "home", "food", "shopping", "health", "entertainment", "transport", "other"
- `tags` (array, opcional): Lista de etiquetas adicionales

**Ejemplos de uso:**
- *"Marca mi oficina como 'work'"*
- *"Categoriza todos los restaurantes como 'food'"*
- *"Agrega las etiquetas 'favorito' y 'urgente' al marcador del hospital"*

**Archivos a modificar:**
- `hooks/useMapStore.ts` - Agregar campo `category` y `tags` a AddressEntry
- `lib/chat-tools.ts` - Agregar herramienta
- `components/Sidebar.tsx` - Mostrar categorías con iconos/colores

---

### **6. 📥 export_markers - Exportar Marcadores**

**Descripción:**
Exporta los marcadores en diferentes formatos.

**Parámetros:**
- `format` (enum, requerido): "json", "csv", "gpx", "geojson"
- `filter_category` (string, opcional): Exportar solo una categoría

**Ejemplos de uso:**
- *"Exporta todos mis marcadores a JSON"*
- *"Dame un CSV con solo los lugares de comida"*
- *"Genera un archivo GPX para mi GPS"*

**Archivos a modificar:**
- `lib/chat-tools.ts` - Agregar herramienta
- Crear funciones de conversión de formatos

---

### **7. 📍 find_center - Encontrar Centro Óptimo**

**Descripción:**
Encuentra el punto más céntrico entre varios marcadores.

**Parámetros:**
- `marker_ids` (array, opcional): IDs de marcadores específicos
- Si no se especifica, usa todos los marcadores

**Ejemplos de uso:**
- *"¿Dónde está el punto medio entre mi casa, trabajo y gimnasio?"*
- *"Encuentra el centro entre todos mis marcadores"*
- *"Busca un lugar céntrico para reunirnos"*

**Archivos a modificar:**
- `lib/chat-tools.ts` - Agregar herramienta
- Implementar algoritmo de centro geométrico

---

### **8. 🔍 search_by_name - Buscar Marcadores por Nombre**

**Descripción:**
Busca marcadores guardados por nombre o descripción.

**Parámetros:**
- `query` (string, requerido): Término de búsqueda
- `search_in` (enum, opcional): "name", "description", "address", "all"

**Ejemplos de uso:**
- *"Busca marcadores que contengan 'café'"*
- *"¿Tengo algo guardado en la calle Mayor?"*
- *"Encuentra todos los marcadores con 'urgente' en la descripción"*

**Archivos a modificar:**
- `lib/chat-tools.ts` - Agregar herramienta
- Implementar búsqueda fuzzy (similitud)

---

## 📁 Estructura de Archivos a Crear/Modificar

### **Nuevos Archivos:**
```
lib/
├── routing-service.ts       # Servicio de rutas
├── places-service.ts        # Búsqueda de lugares cercanos
└── geo-utils.ts             # Utilidades geométricas

components/
├── RouteLayer.tsx           # Capa de rutas en el mapa
└── CategoryBadge.tsx        # Badge para mostrar categorías
```

### **Archivos a Modificar:**
```
lib/
└── chat-tools.ts            # Agregar 8 nuevas herramientas

hooks/
├── useMapStore.ts           # Agregar campos category, tags, routes
└── useChatActions.ts        # Agregar nuevas acciones

components/
├── Sidebar.tsx              # Mostrar categorías y filtros
├── MapLeaflet.tsx           # Renderizar rutas
└── ChatActionMessage.tsx    # Nuevos iconos para herramientas
```

---

## 🎨 Mejoras de UX a Implementar

### **1. Sistema de Categorías Visual**
- Iconos por categoría (🏠 home, 💼 work, 🍔 food, etc.)
- Colores de marcadores según categoría
- Filtros en el Sidebar por categoría

### **2. Visualización de Rutas**
- Línea de ruta en el mapa
- Indicadores de distancia y tiempo
- Perfil de elevación (opcional)

### **3. Panel de Estadísticas**
- Gráficos con Chart.js
- Mapa de calor de actividad
- Timeline de marcadores agregados

### **4. Búsqueda Avanzada**
- Barra de búsqueda en Sidebar
- Autocompletado
- Filtros combinados

---

## 🔧 APIs Externas Necesarias

### **1. OpenRouteService (Rutas)**
- URL: https://openrouteservice.org/
- Gratis: 2,000 requests/día
- Registro: https://openrouteservice.org/dev/#/signup
- Documentación: https://openrouteservice.org/dev/#/api-docs

**Variables de entorno:**
```env
NEXT_PUBLIC_OPENROUTE_API_KEY=tu_key_aqui
```

### **2. Overpass API (Lugares cercanos)**
- URL: https://overpass-api.de/
- Completamente gratis
- Sin necesidad de API key
- Rate limit: Razonable para uso normal

### **3. Nominatim (Geocoding)**
- Ya lo estamos usando para `search_location`
- Sin cambios necesarios

---

## 📝 Orden de Implementación Sugerido

### **Sesión 1 (Fácil):** ~30 minutos
1. ✅ `update_marker` - Ya casi implementado
2. ✅ `search_by_name` - Búsqueda simple
3. ✅ `get_statistics` - Cálculos básicos

### **Sesión 2 (Media):** ~45 minutos
4. ✅ `add_category` - Sistema de categorías
5. ✅ `find_center` - Cálculo geométrico
6. ✅ `export_markers` - Exportación

### **Sesión 3 (Avanzada):** ~60 minutos
7. ✅ `calculate_route` - Integración con API de rutas
8. ✅ `find_nearby` - Integración con Overpass API

---

## 🧪 Tests de Ejemplo para la Próxima Sesión

### **Test 1: Actualizar Marcador**
```
Usuario: "Cambia el nombre de Mi Oficina a 'Oficina Central'"
IA: (usa update_marker)
✅ Marcador actualizado
```

### **Test 2: Ruta**
```
Usuario: "¿Cómo llego de mi casa a la oficina?"
IA: (usa calculate_route)
✅ Ruta mostrada en el mapa con distancia y tiempo
```

### **Test 3: Lugares Cercanos**
```
Usuario: "Busca restaurantes cerca de mi oficina"
IA: (usa find_nearby)
✅ Lista de 10 restaurantes con distancias
```

### **Test 4: Categorías**
```
Usuario: "Marca la oficina como 'work' y mi casa como 'home'"
IA: (usa add_category dos veces)
✅ Marcadores con iconos y colores según categoría
```

### **Test 5: Estadísticas**
```
Usuario: "Dame estadísticas sobre mis ubicaciones"
IA: (usa get_statistics)
✅ Total: 12 marcadores, Centro: [28.12, -15.43], Área: 25 km²
```

---

## 📊 Estimación de Tiempo Total

- **Herramientas básicas (1-3):** ~30 minutos
- **Herramientas medias (4-6):** ~45 minutos
- **Herramientas avanzadas (7-8):** ~60 minutos
- **Testing y ajustes:** ~30 minutos
- **Documentación:** ~15 minutos

**Total estimado:** 3 horas divididas en 3 sesiones

---

## 🎁 Beneficios al Completar

Al finalizar, tendrás:

✅ **IA mucho más poderosa** con 13 herramientas (5 actuales + 8 nuevas)
✅ **Sistema de categorías** para organizar marcadores
✅ **Cálculo de rutas** entre puntos
✅ **Búsqueda de lugares** cercanos
✅ **Estadísticas y análisis** de datos
✅ **Exportación** en múltiples formatos
✅ **Búsqueda avanzada** de marcadores
✅ **Aplicación completa y profesional**

---

## 📚 Recursos Preparados

He creado:
- ✅ Plan detallado de implementación
- ✅ Lista de archivos a crear/modificar
- ✅ Ejemplos de uso para cada herramienta
- ✅ Orden sugerido de implementación
- ✅ Tests de ejemplo
- ✅ Links a documentación de APIs

---

## 🚀 Para Empezar la Próxima Sesión

Solo di:
- *"Empecemos con las herramientas básicas"* (update, search, stats)
- *"Vamos con el sistema de categorías"*
- *"Implementa el cálculo de rutas"*
- O cualquier herramienta específica que quieras

---

**Todo está preparado para la siguiente sesión. ¡Será increíble!** 🎉

---

## 📝 Notas Importantes

1. **API Keys:**
   - Necesitarás registrarte en OpenRouteService para rutas
   - Overpass API no requiere key

2. **Estado Actual:**
   - Function Calling funcionando perfectamente ✅
   - 5 herramientas base implementadas ✅
   - Arquitectura preparada para expansión ✅

3. **Archivos Base:**
   - `lib/chat-tools.ts` - Sistema de herramientas
   - `hooks/useChatActions.ts` - Acciones disponibles
   - `lib/ai-service.ts` - Function Calling funcionando

---

**¿Listo para hacer tu aplicación aún más poderosa? Nos vemos en la próxima sesión.** 🚀

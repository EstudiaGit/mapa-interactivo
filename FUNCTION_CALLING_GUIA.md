# 🤖 Guía de Function Calling - IA con Acciones en el Mapa

## 🎉 ¡Implementación Completada!

Tu chat ahora tiene **Function Calling** - La IA puede ejecutar acciones reales en el mapa.

---

## 🛠️ ¿Qué Herramientas Tiene la IA?

### **1. 📍 Agregar Marcador (`add_marker`)**
La IA puede agregar nuevos marcadores al mapa.

**Ejemplos de comandos:**
- *"Agrega un marcador llamado 'Cafetería Central' en las coordenadas 28.1235, -15.4362"*
- *"Guarda un punto en 40.4168, -3.7038 con el nombre 'Plaza Mayor'"*
- *"Marca la ubicación 51.5074, -0.1278 como 'Big Ben' con descripción 'Reloj icónico de Londres'"*

**Parámetros:**
- `name` (requerido): Nombre del marcador
- `latitude` (requerido): Latitud (-90 a 90)
- `longitude` (requerido): Longitud (-180 a 180)
- `address` (opcional): Dirección completa
- `description` (opcional): Descripción adicional

---

### **2. 🗑️ Eliminar Marcador (`remove_marker`)**
La IA puede eliminar marcadores existentes.

**Ejemplos de comandos:**
- *"Elimina el primer marcador"*
- *"Borra el marcador de la cafetería"*
- *"Quita todos los marcadores antiguos"*

**Nota:** La IA primero debe listar los marcadores para obtener el ID correcto.

---

### **3. 📋 Listar Marcadores (`list_markers`)**
La IA puede ver todos tus marcadores guardados.

**Ejemplos de comandos:**
- *"¿Qué marcadores tengo guardados?"*
- *"Muéstrame la lista de ubicaciones"*
- *"¿Cuántos lugares tengo marcados?"*
- *"Dame información sobre mis marcadores"*

---

### **4. 🎯 Centrar Mapa (`center_map`)**
La IA puede mover y hacer zoom en el mapa.

**Ejemplos de comandos:**
- *"Centra el mapa en París"* (primero busca, luego centra)
- *"Ve a las coordenadas 28.1235, -15.4362"*
- *"Muéstrame la ubicación 40.4168, -3.7038 con zoom 15"*

**Parámetros:**
- `latitude` (requerido): Latitud
- `longitude` (requerido): Longitud
- `zoom` (opcional): Nivel de zoom (1-18)

---

### **5. 🔍 Buscar Ubicación (`search_location`)**
La IA puede buscar lugares por nombre usando geocoding.

**Ejemplos de comandos:**
- *"Busca la Torre Eiffel"*
- *"¿Dónde está el Coliseo Romano?"*
- *"Encuentra la dirección Calle Mayor 5, Madrid"*
- *"Busca cafeterías cerca de Las Canteras"*

**Nota:** Usa OpenStreetMap Nominatim para la búsqueda.

---

## 💬 Ejemplos de Conversaciones Completas

### **Ejemplo 1: Agregar un Lugar Conocido**

**Usuario:** *"Agrega la Torre Eiffel a mi mapa"*

**IA:**
1. 🔍 Busca "Torre Eiffel" → Obtiene coordenadas (48.8584, 2.2945)
2. 📍 Agrega marcador con esas coordenadas
3. Responde: *"He agregado la Torre Eiffel a tu mapa en las coordenadas 48.8584, 2.2945. ¡Ya puedes verla!"*

---

### **Ejemplo 2: Agregar Múltiples Lugares**

**Usuario:** *"Agrega 3 cafeterías: 'Café Central' en 28.1234,-15.4362, 'Café Norte' en 28.1256,-15.4389, y 'Café Sur' en 28.1198,-15.4355"*

**IA:**
1. 📍 Agrega "Café Central"
2. 📍 Agrega "Café Norte"
3. 📍 Agrega "Café Sur"
4. Responde: *"He agregado las 3 cafeterías a tu mapa. Ahora tienes: Café Central, Café Norte y Café Sur. ¿Quieres que centre el mapa en alguna de ellas?"*

---

### **Ejemplo 3: Gestionar Marcadores**

**Usuario:** *"¿Cuántos marcadores tengo?"*

**IA:**
1. 📋 Lista marcadores
2. Responde: *"Tienes 5 marcadores guardados: 1. Cafetería Central, 2. Plaza Mayor, 3. Parque Norte, 4. Restaurante Sur, 5. Oficina Este"*

**Usuario:** *"Elimina el de la cafetería"*

**IA:**
1. 📋 Lista marcadores (para obtener ID)
2. 🗑️ Elimina el marcador
3. Responde: *"He eliminado 'Cafetería Central' de tu mapa. Ahora tienes 4 marcadores."*

---

### **Ejemplo 4: Explorar una Ciudad**

**Usuario:** *"Quiero explorar París. Agrega puntos importantes"*

**IA:**
1. 🔍 Busca "Torre Eiffel" → 📍 Agrega
2. 🔍 Busca "Louvre" → 📍 Agrega
3. 🔍 Busca "Arc de Triomphe" → 📍 Agrega
4. 🎯 Centra el mapa en París
5. Responde: *"He agregado 3 puntos importantes de París: Torre Eiffel, Museo del Louvre y Arco del Triunfo. El mapa está centrado en la ciudad. ¿Quieres que agregue más lugares?"*

---

## 🎨 Interfaz Visual de Acciones

Cuando la IA ejecuta una acción, verás:

### **Mensaje de Acción Exitosa** ✅
```
┌─────────────────────────────────────────┐
│ 📍 Agregar Marcador            [Éxito] │
│ Parámetros: "Cafetería" en [28.12, ... │
│ ✓ Marcador agregado exitosamente       │
│                              10:45 AM   │
└─────────────────────────────────────────┘
```

### **Mensaje de Acción con Error** ❌
```
┌─────────────────────────────────────────┐
│ 🗑️ Eliminar Marcador          [Error]  │
│ Parámetros: marker_id: "abc123"        │
│ ✗ No se encontró el marcador           │
│                              10:46 AM   │
└─────────────────────────────────────────┘
```

---

## 🧪 Pruebas Sugeridas

### **Test 1: Agregar Marcador Simple**
```
Usuario: "Agrega un marcador llamado 'Mi Casa' en 28.1235, -15.4362"
Esperado: ✅ Marcador agregado + Toast de confirmación
```

### **Test 2: Buscar y Agregar**
```
Usuario: "Busca el Coliseo Romano y agrégalo a mi mapa"
Esperado: ✅ Búsqueda exitosa + Marcador agregado + Mapa centrado
```

### **Test 3: Listar y Gestionar**
```
Usuario: "¿Qué marcadores tengo?"
IA: Lista los marcadores
Usuario: "Elimina el segundo"
Esperado: ✅ Marcador eliminado + Lista actualizada
```

### **Test 4: Conversación Natural**
```
Usuario: "Ayúdame a planear un viaje a Madrid. Agrega lugares turísticos"
Esperado: ✅ IA busca y agrega múltiples lugares importantes
```

### **Test 5: Manejo de Errores**
```
Usuario: "Agrega un marcador en coordenadas 200, 500"
Esperado: ❌ Error de validación (coordenadas inválidas)
```

---

## 🔧 Arquitectura Técnica

### **Flujo de Ejecución:**
```
1. Usuario envía mensaje
   ↓
2. ChatWindow → sendMessage() con chatActions
   ↓
3. IA analiza intención
   ↓
4. Si detecta necesidad de herramienta:
   ├─→ Responde con JSON: {"tool": "...", "parameters": {...}}
   ├─→ executeTool() ejecuta la acción
   ├─→ Resultado se envía de vuelta a la IA
   └─→ IA genera respuesta natural final
   ↓
5. ChatWindow renderiza:
   ├─→ ChatActionMessage (acción ejecutada)
   └─→ ChatMessage (respuesta de la IA)
```

### **Archivos Clave:**
- `lib/chat-tools.ts` - Definiciones y ejecución de herramientas
- `hooks/useChatActions.ts` - Puente entre IA y estado del mapa
- `lib/ai-service.ts` - Lógica de Function Calling
- `components/ChatActionMessage.tsx` - UI para acciones
- `hooks/useChatStore.ts` - Store extendido con metadata

---

## 🚀 Siguientes Pasos Posibles

### **Mejoras Sugeridas:**

1. **Más Herramientas:**
   - `update_marker` - Editar marcadores existentes
   - `export_markers` - Exportar a JSON/CSV
   - `import_markers` - Importar desde archivo
   - `calculate_route` - Calcular ruta entre marcadores
   - `get_weather` - Clima en una ubicación

2. **Búsqueda Avanzada:**
   - Buscar por categoría (restaurantes, hoteles, etc.)
   - Filtros de distancia
   - Recomendaciones basadas en ubicación

3. **Análisis de Datos:**
   - `get_statistics` - Estadísticas de marcadores
   - `find_nearest` - Marcador más cercano
   - `calculate_center` - Centro geométrico de todos los marcadores

4. **Integración Externa:**
   - Google Places API
   - Yelp API
   - TripAdvisor API

---

## 📊 Límites y Consideraciones

### **Limitaciones Actuales:**
- La IA debe inferir coordenadas o buscar ubicaciones
- No hay validación de duplicados automática
- Búsqueda limitada a OpenStreetMap Nominatim
- Sin soporte para imágenes de lugares

### **Buenas Prácticas:**
- Sé específico con las coordenadas
- Usa nombres descriptivos para marcadores
- Verifica los resultados de búsqueda
- Prueba con comandos simples primero

---

## 🎓 Consejos para Mejores Resultados

### **✅ Comandos Efectivos:**
- *"Agrega [nombre] en [lat], [lng]"*
- *"Busca [lugar] y agrégalo"*
- *"Muéstrame mis marcadores"*
- *"Elimina [descripción del marcador]"*

### **❌ Evita:**
- Comandos ambiguos: *"Agrega algo por ahí"*
- Sin contexto: *"Elimina el marcador"* (¿cuál?)
- Coordenadas incorrectas: *"Agrega en 999, -999"*

---

## 🐛 Debugging

Si algo no funciona:

1. **Revisa la consola del navegador** para ver logs
2. **Verifica que la API key** esté configurada
3. **Comprueba el formato** de coordenadas
4. **Mira los mensajes de acción** para ver detalles del error

---

**¡Tu IA ahora puede hacer cambios reales en el mapa! 🎉**

Prueba comandos y observa cómo la IA ejecuta acciones automáticamente.

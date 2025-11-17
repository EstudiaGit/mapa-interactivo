# ⚠️ Nota: search_location Desactivada Temporalmente

## 🐛 Problema Identificado

En producción (Vercel), la herramienta `search_location` causa errores **503 Service Unavailable** cuando se intenta usar el modelo `gemini-2.5-flash`.

### **Error:**
```
[GoogleGenerativeAI Error]: The model is overloaded. Please try again later.
```

---

## ✅ Solución Aplicada

**Se ha desactivado temporalmente la herramienta `search_location`** en `lib/chat-tools.ts` (líneas 122-136 comentadas).

---

## 🎯 Estado Actual de Herramientas

### **Herramientas Activas (4):**
1. ✅ `add_marker` - Agregar marcadores
2. ✅ `remove_marker` - Eliminar marcadores
3. ✅ `list_markers` - Listar marcadores
4. ✅ `center_map` - Centrar el mapa

### **Herramientas Desactivadas (1):**
1. ❌ `search_location` - Buscar ubicaciones (causaba error 503)

---

## 💡 Comportamiento Actual de la IA

### **Antes:**
```
Usuario: "Busca la Torre Eiffel y agrégala"
IA: (Intenta usar search_location) → Error 503
```

### **Ahora:**
```
Usuario: "Busca la Torre Eiffel y agrégala"
IA: "La Torre Eiffel está en París. ¿Podrías proporcionarme las coordenadas 
     exactas o prefieres que te dé las coordenadas aproximadas que conozco 
     (48.8584° N, 2.2945° E)?"
```

**La IA ahora:**
- ✅ Responde conversacionalmente
- ✅ Puede sugerir coordenadas conocidas
- ✅ Pide al usuario confirmar o proporcionar coordenadas
- ✅ Puede usar su conocimiento general para ubicaciones famosas

---

## 🔧 Alternativas para el Futuro

### **Opción 1: Reactivar cuando el modelo sea más estable**
Cuando `gemini-2.5-flash` esté más estable o Google mejore la capacidad:
```typescript
// Descomentar en lib/chat-tools.ts líneas 122-136
```

### **Opción 2: Usar Google Places API**
Integrar Google Places API (de pago pero más confiable):
```typescript
{
  name: "search_location",
  description: "Busca ubicaciones usando Google Places API",
  // Requiere API key de Google Maps Platform
}
```

### **Opción 3: Usar Mapbox Geocoding**
API alternativa con tier gratuito:
```typescript
// Mapbox Geocoding API
// 100,000 requests/mes gratis
```

### **Opción 4: Base de datos local de lugares famosos**
Crear una lista de lugares conocidos con coordenadas:
```typescript
const KNOWN_PLACES = {
  "Torre Eiffel": { lat: 48.8584, lng: 2.2945 },
  "Coliseo Romano": { lat: 41.8902, lng: 12.4922 },
  // ...
};
```

---

## 📝 Ejemplos de Uso Actual

### **✅ Funciona - Con Coordenadas:**
```
Usuario: "Agrega un marcador llamado Mi Casa en 28.1235, -15.4362"
IA: (Usa add_marker) ✅ Agregado
```

### **✅ Funciona - Listar:**
```
Usuario: "¿Qué marcadores tengo?"
IA: (Usa list_markers) ✅ Lista los marcadores
```

### **✅ Funciona - Conversacional:**
```
Usuario: "Necesito agregar la Torre Eiffel"
IA: "Claro, la Torre Eiffel está en París. Las coordenadas son 
     aproximadamente 48.8584° N, 2.2945° E. ¿Quieres que la agregue 
     con esas coordenadas?"
Usuario: "Sí"
IA: (Usa add_marker con esas coordenadas) ✅ Agregado
```

### **❌ Ya NO intenta - Búsqueda directa:**
```
Usuario: "Busca cafeterías cerca"
IA: "Actualmente no puedo buscar lugares automáticamente, pero si me das 
     el nombre y ubicación (o coordenadas) de alguna cafetería específica, 
     puedo agregarla a tu mapa."
```

---

## 🎯 Recomendaciones

### **Para Usuarios:**
1. **Proporciona coordenadas cuando sea posible**
2. **La IA puede sugerir coordenadas de lugares famosos** (Torre Eiffel, Coliseo, etc.)
3. **Usa Google Maps para obtener coordenadas** y luego díselas a la IA

### **Para Desarrollo Futuro:**
1. Monitorear estabilidad de `gemini-2.5-flash`
2. Considerar implementar Google Places API o Mapbox
3. Crear base de datos local de lugares comunes
4. Implementar retry logic con exponential backoff

---

## 🔄 Cómo Reactivar (Cuando sea Estable)

1. Abrir `lib/chat-tools.ts`
2. Descomentar líneas 122-136
3. Rebuild: `npm run build`
4. Deploy a Vercel

```bash
git add lib/chat-tools.ts
git commit -m "Reactivar search_location"
git push
```

---

## 📊 Impacto en la Experiencia

### **Ventajas de Desactivar:**
- ✅ No más errores 503
- ✅ Aplicación más estable
- ✅ IA responde siempre
- ✅ Experiencia más predecible

### **Desventajas:**
- ⚠️ Usuario debe proporcionar coordenadas
- ⚠️ No hay búsqueda automática de lugares
- ⚠️ Requiere un paso extra del usuario

### **Balance:**
**Mejor una IA estable que responde siempre, que una que falla al buscar.**

---

## ✅ Checklist de Verificación

- [x] Herramienta `search_location` comentada
- [x] Build exitoso
- [x] Otras 4 herramientas funcionando
- [ ] Testeado en Vercel (deploy pendiente)
- [ ] Verificar que no hay errores 503

---

**Última actualización:** Sesión actual
**Estado:** ✅ Desactivada temporalmente
**Próximo paso:** Deploy a Vercel y verificar funcionamiento

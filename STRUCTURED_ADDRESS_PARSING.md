# Mejora: Parsing Estructurado de Direcciones

## 📋 Resumen
Se ha implementado un sistema de parsing estructurado de direcciones para que la IA clasifique automáticamente la información de ubicaciones en campos separados (Nombre, Dirección, CP, Descripción) en lugar de poner todo en un único campo.

## 🎯 Problema Resuelto
**Antes:** Cuando se buscaba una dirección como "calle fernando guanarteme, 70", toda la información se guardaba en el campo "address":
```
address: "70, Calle Fernando Guanarteme, Guanarteme, Las Palmas de Gran Canaria, Las Palmas, Canarias, 35907, España"
```

**Ahora:** La información se estructura automáticamente en campos separados:
```
name: "Calle Fernando Guanarteme, 70"
address: "Calle Fernando Guanarteme, 70"
CP: "35907"
description: "Guanarteme, Las Palmas de Gran Canaria, Canarias, España"
```

## 🔧 Cambios Implementados

### 1. **app/api/chat/actions.ts**
- ✅ Agregado parámetro `addressdetails=1` a la API de Nominatim
- ✅ Creadas interfaces TypeScript para tipado de respuesta de Nominatim
- ✅ Nueva función `parseNominatimAddress()` que estructura la información
- ✅ Actualizado `search_location` para devolver información parseada
- ✅ Actualizado `add_marker` para aceptar el campo `CP`

### 2. **lib/ai-service.ts**
- ✅ Agregadas instrucciones específicas en el prompt del sistema
- ✅ La IA ahora sabe usar el campo `parsed` de search_location
- ✅ Instrucciones para distribuir correctamente los datos en los campos del marcador

### 3. **lib/chat-tools.ts**
- ✅ Actualizada interfaz `ChatActionsContext` para incluir parámetro `CP`
- ✅ Actualizada definición de herramienta `add_marker` con campo `CP`
- ✅ Mejoradas descripciones de parámetros con ejemplos específicos
- ✅ Actualizada función `executeTool` para manejar el campo `CP`

### 4. **hooks/useChatActions.ts**
- ✅ Actualizada función `addMarker` para aceptar parámetro `CP`
- ✅ Agregado `addressdetails=1` a la función `searchLocation`

## 📊 Ejemplo de Uso

### Antes:
```
Usuario: "Busca calle fernando guanarteme, 70"
IA: Crea marcador con:
  - name: "calle fernando guanarteme, 70"
  - address: "70, Calle Fernando Guanarteme, Guanarteme, Las Palmas de Gran Canaria, Las Palmas, Canarias, 35907, España"
  - CP: ""
  - description: ""
```

### Ahora:
```
Usuario: "Busca calle fernando guanarteme, 70"
IA: 
  1. Busca con search_location
  2. Obtiene resultado parseado
  3. Crea marcador con:
     - name: "Calle Fernando Guanarteme, 70"
     - address: "Calle Fernando Guanarteme, 70"
     - CP: "35907"
     - description: "Guanarteme, Las Palmas de Gran Canaria, Canarias, España"
```

## 🧪 Casos de Prueba Validados

### 1. Dirección con número de calle
- **Input:** "calle fernando guanarteme, 70"
- **Output:**
  - Nombre: "Calle Fernando Guanarteme, 70"
  - Dirección: "Calle Fernando Guanarteme, 70"
  - CP: "35907"
  - Descripción: "Guanarteme, Las Palmas de Gran Canaria, Canarias, España"

### 2. Lugar sin número (punto de interés)
- **Input:** "Torre Eiffel"
- **Output:**
  - Nombre: "Torre Eiffel"
  - Dirección: "Torre Eiffel"
  - CP: ""
  - Descripción: "París, Francia"

### 3. Calle sin número
- **Input:** "Calle Mayor, Madrid"
- **Output:**
  - Nombre: "Calle Mayor"
  - Dirección: "Calle Mayor"
  - CP: "28013"
  - Descripción: "Madrid, España"

## 🎨 Estructura de Datos de Nominatim

La API de Nominatim con `addressdetails=1` devuelve:
```json
{
  "lat": "28.1341319",
  "lon": "-15.4389191",
  "display_name": "70, Calle Fernando Guanarteme, Guanarteme, Las Palmas de Gran Canaria, Las Palmas, Canarias, 35907, España",
  "address": {
    "house_number": "70",
    "road": "Calle Fernando Guanarteme",
    "suburb": "Guanarteme",
    "city": "Las Palmas de Gran Canaria",
    "state": "Canarias",
    "postcode": "35907",
    "country": "España"
  }
}
```

## 🚀 Beneficios

1. **Mejor Organización:** Los datos se distribuyen correctamente en las tarjetas de marcadores
2. **Búsquedas Más Flexibles:** No importa cómo el usuario escriba la dirección
3. **Información Separada:** Fácil acceso a código postal, ciudad, y otros campos
4. **Escalabilidad:** Fácil agregar más campos en el futuro
5. **Experiencia de Usuario:** Las tarjetas se ven más profesionales y organizadas

## 📝 Notas Técnicas

- La función `parseNominatimAddress` maneja fallbacks si no hay información estructurada
- Compatible con diferentes tipos de ubicaciones (calles, puntos de interés, ciudades)
- Mantiene retrocompatibilidad con marcadores existentes
- TypeScript proporciona tipado seguro para toda la cadena

## ✅ Estado
**Implementado y probado** - Listo para usar en producción

---
*Última actualización: Implementación completada*

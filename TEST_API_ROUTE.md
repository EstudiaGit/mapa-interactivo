# 🧪 Test de Verificación - API Route

## ✅ Pasos para Verificar que Todo Funciona

### **1. Verificar Build**
```bash
npm run build
```
**Esperado:** ✅ Compiled successfully

---

### **2. Iniciar Servidor**
```bash
npm run dev
```
**Esperado:** 
```
▲ Next.js 15.x
- Environments: .env.local
Ready on http://localhost:3000
```

---

### **3. Test Manual en el Chat**

#### **Test 1: Agregar Marcador Simple**
```
Comando: "Agrega un marcador llamado Test API en 28.10, -15.43"
```

**Verificar en consola del SERVIDOR (terminal):**
```
🔧 Function calls detectados en servidor: 1
  → Ejecutando: add_marker { name: 'Test API', latitude: 28.10, ... }
```

**Verificar en el NAVEGADOR:**
- ✅ Mensaje de acción verde 📍
- ✅ Toast: "🤖 IA agregó: Test API"
- ✅ Marcador visible en el mapa
- ✅ Respuesta natural de la IA

---

#### **Test 2: Buscar y Agregar**
```
Comando: "Busca la Torre Eiffel y agrégala"
```

**Verificar en consola del SERVIDOR:**
```
🔧 Function calls detectados en servidor: 1
  → Ejecutando: search_location { query: 'Torre Eiffel' }
🔧 Function calls detectados en servidor: 1
  → Ejecutando: add_marker { name: 'Torre Eiffel', latitude: 48.8584, ... }
```

**Verificar en el NAVEGADOR:**
- ✅ 2 mensajes de acción (búsqueda + agregar)
- ✅ Marcador "Torre Eiffel" en París
- ✅ Toasts correspondientes

---

#### **Test 3: Listar Marcadores**
```
Comando: "¿Qué marcadores tengo?"
```

**Verificar:**
- ✅ Mensaje de acción 📋
- ✅ Respuesta con lista de marcadores

---

### **4. Test con cURL (Opcional)**

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "Agrega un marcador llamado cURL Test en 40.4168, -3.7038",
    "markers": [],
    "center": null,
    "conversationHistory": []
  }'
```

**Respuesta esperada:**
```json
{
  "text": "He agregado el marcador \"cURL Test\"...",
  "toolsUsed": [
    {
      "name": "add_marker",
      "parameters": { ... },
      "result": { "success": true, ... }
    }
  ]
}
```

---

### **5. Verificar Seguridad**

#### **Test A: API Key NO está en el cliente**
1. Abrir DevTools (F12)
2. Ir a Network → Filtrar por "chat"
3. Ver el request a `/api/chat`
4. **Verificar:** El request NO debe contener `GOOGLE_AI_API_KEY`

#### **Test B: API Key solo en servidor**
```bash
# Buscar en archivos del build
grep -r "AIzaSy" .next/

# NO debería aparecer en archivos del cliente
# Solo puede estar en .env.local
```

---

## 🐛 Troubleshooting

### **Error: "API Key no configurada"**

**Logs del servidor:**
```
❌ GOOGLE_AI_API_KEY no está configurada
```

**Solución:**
```bash
# Verificar .env.local
cat .env.local

# Debe tener (sin NEXT_PUBLIC_):
GOOGLE_AI_API_KEY=AIzaSy...

# Reiniciar servidor
npm run dev
```

---

### **Error: "Error al comunicarse con el servidor"**

**En consola del navegador:**
```
Error: Error al comunicarse con el servidor
```

**Debugging:**
1. Ver logs del servidor (terminal)
2. Verificar que `/api/chat/route.ts` existe
3. Probar con cURL directamente

---

### **Error: "Las acciones no se ejecutan"**

**Síntoma:** IA responde pero no agrega marcadores

**Solución:**
1. Abrir DevTools → Console
2. Buscar errores en `useServerActions`
3. Verificar que `toolsUsed` tiene datos:
   ```javascript
   console.log('toolsUsed:', response.toolsUsed);
   ```

---

## ✅ Checklist Final

- [ ] Build exitoso
- [ ] Servidor inicia sin errores
- [ ] Test 1: Agregar marcador funciona
- [ ] Test 2: Buscar y agregar funciona
- [ ] Test 3: Listar funciona
- [ ] Logs del servidor se ven correctamente
- [ ] API key NO visible en cliente
- [ ] Toasts aparecen correctamente
- [ ] Mensajes de acción se renderizan bien

---

## 🎉 Si Todos los Tests Pasan

**¡La API Route está funcionando correctamente!** 🚀

Tu aplicación ahora:
- ✅ Tiene la API key segura en el servidor
- ✅ Function Calling funciona a través del API Route
- ✅ Está lista para producción
- ✅ Es escalable y mantenible

---

## 📊 Comparación: Antes vs Ahora

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| API Key visible en cliente | ❌ Sí | ✅ No |
| Ejecución | Cliente directo | Servidor → Cliente |
| Seguridad | ⚠️ Baja | ✅ Alta |
| Logs centralizados | ❌ No | ✅ Sí |
| Lista para producción | ❌ No | ✅ Sí |

---

**Próximo paso:** Agregar 8 nuevas herramientas (ver `PROXIMA_SESION_HERRAMIENTAS.md`)

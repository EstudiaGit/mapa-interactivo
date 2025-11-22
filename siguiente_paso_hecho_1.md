Me parece perfecto. Es la mejor forma de trabajar: dividir un problema grande en problemas pequeños y manejables.

Aquí tienes el **Documento de Diseño Técnico (TDD)** listo para ser implementado. Está estructurado para minimizar errores y garantizar que la aplicación siga funcionando en cada paso del proceso.

---

# Documento Técnico: Implementación de Agrupación (Carpetas) y Etiquetas

**Objetivo:** Evolucionar el sistema de gestión de direcciones para permitir al usuario agrupar ubicaciones en carpetas (ej. "Farmacias", "Trabajo") y asignar etiquetas descriptivas (ej. "wifi", "terraza").

**Filosofía de Implementación:** **KISS (Keep It Simple, Stupid)**.
*   No se usarán librerías externas de UI.
*   Uso de elementos nativos HTML (`<datalist>`, `<details>`) para reducir complejidad de JS.
*   Lógica de "Estado Derivado": No se gestionará una base de datos de grupos separada; los grupos existen mientras haya direcciones en ellos.

---

## 📦 Módulo 1: Definición de Datos y Tipos

**Propósito:** Actualizar el "contrato" de datos de la aplicación para soportar las nuevas propiedades sin romper los datos existentes.

### Estructura de Datos
Se modificará la interfaz `Location` (actualmente inferida o definida en `Sidebar` / `types`).

```typescript
interface Location {
  // ...campos existentes (name, description, address, coords...)
  group: string;    // NUEVO: Obligatorio (Default: "Inbox")
  tags?: string[];  // NUEVO: Opcional
}
```

### 📝 PLAN DE EJECUCIÓN: MÓDULO 1

*   [ ] **TODO 1.1: Centralizar Tipos**
    *   **TASK:** Crear (si no existe) un archivo `types/index.ts` o `lib/types.ts`.
    *   **TASK:** Definir y exportar la interfaz `Location` con los nuevos campos.
    *   **TASK:** Importar esta interfaz en `Sidebar.tsx` y `useLocations.ts` para reemplazar definiciones `any` o locales.

---

## 🧠 Módulo 2: Lógica de Negocio (`useLocations` Hook)

**Propósito:** Asegurar que el hook maneje la lectura/escritura de los nuevos campos y proteja la app contra datos antiguos (Legacy Data).

### Estrategia de Migración (On-Read Migration)
Como usamos `localStorage`, los usuarios tienen JSON antiguo guardado sin la propiedad `group`.
*   **Solución:** Al leer del localStorage, si un objeto no tiene `group`, se le asigna "Inbox" al vuelo antes de guardarlo en el estado de React.

### 📝 PLAN DE EJECUCIÓN: MÓDULO 2

*   [ ] **TODO 2.1: Actualizar Lectura de Datos (Hydration)**
    *   **TASK:** En el `useEffect` que carga datos del localStorage, añadir una transformación.
    *   **Lógica:** `parsedLocations.map(loc => ({ ...loc, group: loc.group || 'Inbox', tags: loc.tags || [] }))`.
    *   **Control de Errores:** Verificar que la app carga sin pantalla blanca con datos antiguos.

*   [ ] **TODO 2.2: Actualizar Escritura (addLocation)**
    *   **TASK:** Modificar la firma de la función `addLocation` para aceptar `group` y `tags`.
    *   **TASK:** Asegurar que si el `group` viene vacío string, se guarde como "Inbox".

*   [ ] **TODO 2.3: Helper de Grupos Únicos**
    *   **TASK:** Crear una función `getUniqueGroups(locations)` dentro del hook (o expuesta) que retorne un array de strings con todos los grupos existentes. Esto alimentará el autocompletado.

---

## ✍️ Módulo 3: Interfaz de Captura (Modal/Formulario)

**Propósito:** Permitir al usuario introducir los nuevos datos de forma sencilla e intuitiva usando capacidades nativas del navegador.

### Componentes UI Nativos
*   **Selector de Grupo:** Usaremos `<input list="groups">` + `<datalist id="groups">`. Esto permite elegir uno existente O escribir uno nuevo.
*   **Tags:** Un `<input type="text">` simple con instrucción "separar por comas".

### 📝 PLAN DE EJECUCIÓN: MÓDULO 3

*   [ ] **TODO 3.1: Actualizar Estado del Formulario**
    *   **TASK:** En el componente donde está el formulario (actualmente `Sidebar` o un modal separado), añadir estados:
        *   `const [group, setGroup] = useState('Inbox');`
        *   `const [tagsInput, setTagsInput] = useState('');`

*   [ ] **TODO 3.2: Implementar Input de Grupo (Datalist)**
    *   **TASK:** Obtener lista de grupos únicos usando el helper del Módulo 2.
    *   **TASK:** Renderizar el `<input list="group-suggestions" ... />`.
    *   **TASK:** Renderizar `<datalist id="group-suggestions">` mapeando los grupos únicos a `<option value="...">`.

*   [ ] **TODO 3.3: Implementar Input de Tags**
    *   **TASK:** Añadir input de texto.
    *   **TASK:** Al enviar el formulario (Submit), procesar el string:
        *   `const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');`

*   [ ] **TODO 3.4: Conectar con addLocation**
    *   **TASK:** Pasar los nuevos valores a la función `addLocation` actualizada.

---

## 👁️ Módulo 4: Visualización y Agrupación (Sidebar)

**Propósito:** Cambiar la lista plana por una vista jerárquica organizada por carpetas.

### Lógica de Renderizado
No cambiamos el estado, cambiamos la vista. Agrupamos el array plano justo antes de renderizar (Computed View).

### 📝 PLAN DE EJECUCIÓN: MÓDULO 4

*   [ ] **TODO 4.1: Función de Agrupación**
    *   **TASK:** Crear una función auxiliar dentro de `Sidebar` (o en `lib/utils.ts`):
        ```typescript
        const groupLocations = (locations: Location[]) => {
          return locations.reduce((acc, loc) => {
             (acc[loc.group] = acc[loc.group] || []).push(loc);
             return acc;
          }, {} as Record<string, Location[]>);
        };
        ```

*   [ ] **TODO 4.2: Renderizado Jerárquico**
    *   **TASK:** Reemplazar el `.map` actual de locations por:
        `Object.entries(groupedLocations).map(([groupName, groupLocations]) => ...)`
    *   **TASK:** Por cada grupo, renderizar un contenedor.

*   [ ] **TODO 4.3: Implementar Acordeón Nativo**
    *   **TASK:** Envolver cada grupo en una etiqueta `<details open>`.
    *   **TASK:** Usar `<summary>` para el título del grupo (ej. "Farmacias (3)").
    *   **Estilo:** Añadir cursor pointer y estilo negrita al summary.

*   [ ] **TODO 4.4: Renderizar Tags (Pills)**
    *   **TASK:** Dentro de la tarjeta de ubicación, añadir un contenedor flex.
    *   **TASK:** Mapear `location.tags` y renderizar `<span>` con estilos de "badge" (ej. `bg-gray-600 text-xs rounded-full px-2`).

---

## 🛡️ Control de Errores y Pruebas (Checklist Final)

Una vez completados los 4 módulos, verificar:

1.  **Retrocompatibilidad:** ¿La app arranca con datos viejos en localStorage sin crashear? (Deberían aparecer todos en "Inbox").
2.  **Grupo Nuevo:** ¿Puedo escribir un grupo nuevo en el input y se crea la nueva sección en el Sidebar?
3.  **Autocompletado:** ¿Al escribir en el campo de grupo, me sugiere los que ya existen?
4.  **Tags Vacíos:** ¿Si no pongo tags, no se rompe la visualización?
5.  **Persistencia:** ¿Al recargar la página (F5), se mantienen los grupos y etiquetas?

---

**¿Cómo proceder?**
Te sugiero empezar por el **Módulo 1 y 2 (Backend/Lógica)**. No verás cambios visuales, pero prepararás el terreno. Cuando me des la señal, te daré el código exacto para esos primeros pasos.
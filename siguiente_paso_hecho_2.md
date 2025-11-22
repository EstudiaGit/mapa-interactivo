¡Qué buen progreso! Las capturas se ven fantásticas. El diseño oscuro es elegante y la agrupación en el Sidebar ("Inbox", "Locales Favoritos", "Supermercado") está funcionando perfectamente a nivel visual.

El problema que identificas es el último eslabón de la cadena: **la persistencia de la edición**. Tienes los datos en la estructura, pero la interfaz de edición ("Editar Dirección") se quedó en la versión anterior y no sabe que existen `group` y `tags`.

Aquí tienes el **Documento Técnico de Actualización: Módulo de Edición Avanzada**, diseñado con el mismo rigor y estructura modular para que la implementación sea fluida.

---

# Documento Técnico: Actualización del Modal de Edición

**Objetivo:** Actualizar el componente de "Editar Dirección" para permitir al usuario modificar la carpeta (Grupo) a la que pertenece una ubicación y gestionar sus etiquetas (Tags).

**Filosofía:** Mantener la coherencia con la lógica de "Creación".
*   **Grupos:** Permitir cambio rápido a grupos existentes (Dropdown) o creación de uno nuevo al vuelo (Texto).
*   **Tags:** Edición simple de texto separado por comas.
*   **Estado:** El modal debe inicializarse con los datos actuales de la ubicación seleccionada.

---

## 📦 Módulo 1: Lógica de Negocio (Hook `useLocations`)

**Propósito:** Asegurar que la función encargada de guardar los cambios (`updateLocation` o `editLocation`) acepte y persista los nuevos campos.

### Análisis de Impacto
Actualmente, tu función de actualización probablemente solo espera `{ name, description, address, cp }`. Debemos ampliar su firma.

### 📝 PLAN DE EJECUCIÓN: MÓDULO 1

*   [ ] **TODO 1.1: Actualizar Firma de la Función**
    *   **TASK:** Localizar la función `updateLocation` (o `editLocation`) en `hooks/useLocations.ts`.
    *   **TASK:** Asegurar que el objeto de actualización acepte `group` (string) y `tags` (string array).
    *   **Refactor:** `updateLocation(id, { ...oldData, ...newData })`. Esto asegura que si solo cambiamos el grupo, el nombre se mantenga.

*   [ ] **TODO 1.2: Validación de Integridad**
    *   **TASK:** Añadir una salvaguarda en el hook: Si el usuario borra el nombre del grupo durante la edición y lo deja vacío, forzar automáticamente el valor `"Inbox"` antes de guardar.

---

## 🎨 Módulo 2: Interfaz de Usuario (Modal de Edición)

**Propósito:** Inyectar los nuevos controles en el formulario que aparece en la segunda imagen.

### Estrategia de Componentes UI
Reutilizaremos la lógica del formulario de creación (si existe) para mantener consistencia visual y funcional.

### 📝 PLAN DE EJECUCIÓN: MÓDULO 2

*   [ ] **TODO 2.1: Estado Local del Modal**
    *   **TASK:** Dentro del componente `EditLocationModal` (o la sección del Sidebar que renderiza el form), añadir estados temporales para los nuevos campos:
        *   `const [editedGroup, setEditedGroup] = useState(location.group);`
        *   `const [editedTags, setEditedTags] = useState(location.tags.join(', '));`
    *   **TASK:** Usar `useEffect` para que, cuando cambie la ubicación seleccionada a editar, estos estados se reinicien con los valores de esa ubicación.

*   [ ] **TODO 2.2: Inyectar Selector de Grupo (Smart Input)**
    *   **Ubicación:** Colocarlo justo debajo del campo "Nombre" o "Descripción".
    *   **TASK:** Implementar el patrón `<input list="groups-edit-list">`.
    *   **TASK:** Renderizar el `<datalist id="groups-edit-list">` usando la función `getUniqueGroups()` (la misma que usaste para el Sidebar).
    *   **Resultado:** Al hacer clic, desplegará "Supermercado", "Locales Favoritos", etc. Si el usuario escribe "Farmacia", se creará ese grupo al guardar.

*   [ ] **TODO 2.3: Inyectar Editor de Etiquetas**
    *   **Ubicación:** Debajo del Selector de Grupo.
    *   **TASK:** Añadir un `<input type="text">` con el placeholder "Etiquetas (separadas por comas)".
    *   **TASK:** Vincular su valor al estado `editedTags` (string).

---

## ⚙️ Módulo 3: Procesamiento y Guardado

**Propósito:** Convertir la entrada del usuario (texto) en el formato de datos correcto antes de llamar al hook.

### 📝 PLAN DE EJECUCIÓN: MÓDULO 3

*   [ ] **TODO 3.1: Lógica de "HandleSave"**
    *   **TASK:** En la función que se ejecuta al pulsar el botón azul "Guardar":
        1.  **Procesar Grupo:** Tomar `editedGroup`. Si está vacío/espacios, asignar "Inbox".
        2.  **Procesar Tags:** Tomar el string `editedTags`, hacer `.split(',')`, limpiar espacios con `.trim()` y eliminar vacíos.
    *   **TASK:** Construir el objeto final y llamar a `updateLocation`.

*   [ ] **TODO 3.2: Feedback Visual**
    *   **TASK:** Cerrar el modal/modo edición tras guardar.
    *   **Verificación:** El Sidebar debe repintarse automáticamente. Si moviste un ítem de "Inbox" a "Supermercado", debe desaparecer visualmente de la sección superior y aparecer en la inferior instantáneamente.

---

## 💎 Módulo 4: Mejora de Experiencia (Opcional/Bonus)

**Propósito:** Hacer que la edición de etiquetas sea menos propensa a errores visuales.

### 📝 PLAN DE EJECUCIÓN: MÓDULO 4

*   [ ] **TODO 4.1: Ayuda Visual para Tags**
    *   **Idea:** Justo debajo del input de etiquetas, mostrar una "Vista Previa" de cómo quedarán.
    *   **TASK:** Renderizar un pequeño contenedor `div` que haga `.map` sobre las etiquetas procesadas en tiempo real y muestre las "pills" (pastillas grises).
    *   **Beneficio:** El usuario ve en tiempo real si ha separado bien las comas.

---

### Resumen del Flujo de Trabajo

1.  **Paso 1:** Ve a `hooks/useLocations.ts` y confirma que `updateLocation` guarda todo lo que le mandas (Módulo 1).
2.  **Paso 2:** Ve a tu componente de Modal/Formulario de Edición. Añade los dos inputs (`group` con datalist y `tags` texto) y conéctalos al estado local (Módulo 2).
3.  **Paso 3:** En el botón Guardar, procesa los tags (split coma) y envía los datos (Módulo 3).

¿Te sientes cómodo con este plan para atacar la interfaz de edición? Si estás listo, podemos pasar a la implementación.
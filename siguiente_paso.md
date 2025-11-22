Este es un plan excelente. Al combinar la **Identidad Visual (Colores)** con la reactivación del **Botón de Añadir**, estamos cerrando el ciclo: ahora el usuario puede crear datos ricos (con grupos) y visualizarlos espacialmente de inmediato.

He aplicado el **Patrón Maestro** para generar este documento técnico. He optado por una solución de colores **"Determinista"** (basada en el nombre del grupo) para mantener la filosofía KISS. Esto significa que no necesitas crear una interfaz para "elegir color"; el sistema asignará colores consistentes automáticamente (ej: "Farmacia" siempre será verde, "Inbox" siempre será gris) sin que tengas que guardar esa configuración en base de datos.

Aquí tienes el Plan de Ejecución.

---

# Documento Técnico: Identidad Visual (Color-Coding) y Creación Manual

**Objetivo:**
1.  Implementar un sistema de codificación de colores donde los marcadores del mapa y las cabeceras del sidebar reflejen el color de su grupo.
2.  Reactivar y actualizar el botón "+ Añadir Nueva Dirección" para que permita crear ubicaciones manualmente con soporte para Grupos y Etiquetas.

**Filosofía y Enfoque:**
*   **KISS (Keep It Simple, Stupid):** No crearemos un selector de colores complejo ("Color Picker"). Usaremos un algoritmo de **hashing determinista**: el color se genera matemáticamente a partir del nombre del grupo. Si el grupo se llama "Farmacia", el sistema elegirá siempre el mismo color (ej. Verde) de una paleta predefinida.
*   **Reutilización:** La lógica del formulario de "Añadir" será idéntica a la de "Editar" (mismo modal/componente), evitando duplicar código.
*   **Visualización:** Usaremos `L.divIcon` de Leaflet con SVGs dinámicos para evitar cargar imágenes externas para los pines de colores.

---

## 🎨 Módulo 1: Lógica de Colores (Utilities)

**Propósito:** Crear la "magia" matemática que asigna un color único y consistente a cada grupo sin necesidad de guardarlo en base de datos.

### 📝 LISTA DE TAREAS

*   [ ] **TODO 1.1: Definir Paleta de Colores**
    *   **TASK:** En un archivo de utilidades (ej. `lib/colors.ts` o `utils.ts`), definir un array de colores hexadecimales seguros y atractivos (tomados de la paleta de Tailwind).
    *   *Ejemplo:* `const GROUP_COLORS = ['#ef4444', '#f97316', '#84cc16', '#06b6d4', '#8b5cf6', '#d946ef'];` (Rojo, Naranja, Verde, Cyan, Violeta, Rosa).

*   [ ] **TODO 1.2: Función de Hashing de Color**
    *   **TASK:** Crear la función `getGroupColor(groupName: string): string`.
    *   **Lógica:**
        1.  Si `groupName === 'Inbox'`, retornar gris (`#6b7280`).
        2.  Si no, convertir el string a un número (sumando sus códigos ASCII).
        3.  Usar el operador módulo `%` sobre la longitud del array de colores para obtener un índice.
        4.  Retornar el color correspondiente.

---

## 📍 Módulo 2: Marcadores Dinámicos (Mapa)

**Propósito:** Que los pines en el mapa dejen de ser la imagen azul por defecto y pasen a ser SVGs pintados con el color del grupo.

### 📝 LISTA DE TAREAS

*   [ ] **TODO 2.1: Crear Generador de Iconos**
    *   **TASK:** En `components/Map.tsx` (o fuera), crear una función que devuelva un `L.divIcon`.
    *   **Código Clave:**
        ```javascript
        const createColorIcon = (color: string) => L.divIcon({
          className: 'custom-pin',
          html: `<svg ... fill="${color}" ...></svg>`, // SVG de un pin estándar
          iconSize: [30, 42],
          iconAnchor: [15, 42]
        });
        ```

*   [ ] **TODO 2.2: Implementar en el Renderizado**
    *   **TASK:** En el `.map` donde renderizas los `<Marker>`, calcular el color antes de renderizar:
        `const markerColor = getGroupColor(location.group);`
    *   **TASK:** Pasar el icono al componente: `<Marker icon={createColorIcon(markerColor)} ... />`.

---

## 🗂️ Módulo 3: Identidad en Sidebar

**Propósito:** Conectar visualmente la lista con el mapa. El usuario debe ver un punto de color al lado del nombre del grupo "Farmacia" y asociarlo mentalmente con los puntos verdes del mapa.

### 📝 LISTA DE TAREAS

*   [ ] **TODO 3.1: Indicador de Color en Cabecera**
    *   **TASK:** En `Sidebar.tsx`, dentro del loop de grupos (`Object.entries...`), obtener el color: `const groupColor = getGroupColor(groupName);`.
    *   **TASK:** Añadir un pequeño círculo de color (`div` de 3x3 rounded-full) dentro del `<summary>` del `<details>`, justo antes del nombre del grupo.

---

## ➕ Módulo 4: Reactivación "Añadir Dirección"

**Propósito:** Habilitar el botón inferior para abrir un formulario vacío que permita crear una ubicación nueva con las nuevas capacidades (Grupos/Tags).

### Estrategia de Componente Unificado
En lugar de tener `AddModal` y `EditModal`, tendremos un `LocationModal`.
*   Si le paso una ubicación (`location={data}`), está en **Modo Edición**.
*   Si no le paso nada o le paso null (`location={null}`), está en **Modo Creación**.

### 📝 LISTA DE TAREAS

*   [ ] **TODO 4.1: Refactorizar Modal (Componente Único)**
    *   **TASK:** Asegurar que el modal actual acepte una prop `isOpen` y `onClose`.
    *   **TASK:** Asegurar que los campos (name, group, tags) se inicialicen vacíos si no hay datos previos.
    *   **TASK:** Por defecto, si es modo creación, `group` debe inicializarse como `"Inbox"`.

*   [ ] **TODO 4.2: Conectar Botón Sidebar**
    *   **TASK:** En `Sidebar.tsx`, crear estado `const [isCreationModalOpen, setCreationModalOpen] = useState(false)`.
    *   **TASK:** Vincular el `onClick` del botón "+ Añadir Nueva Dirección" a `setCreationModalOpen(true)`.

*   [ ] **TODO 4.3: Manejo del Guardado (Save Handler)**
    *   **TASK:** La función de guardar del modal debe distinguir:
        *   Si existe ID (Edición) -> llamar a `updateLocation`.
        *   Si NO existe ID (Creación) -> crear objeto (generar ID nuevo, fecha, coords centro mapa) y llamar a `addLocation`.

*   [ ] **TODO 4.4: Coordenadas por Defecto**
    *   **Reto:** Al crear manualmente sin clicar el mapa, ¿dónde ponemos el pin?
    *   **TASK:** Al crear una nueva dirección manualmente, asignar las coordenadas del **centro actual del mapa** (puedes obtenerlo del hook de Leaflet `useMap().getCenter()` o pasarle una prop de centro al modal).

---

## ✅ Checklist de Pruebas (Quality Control)

1.  **Consistencia de Color:**
    *   [ ] Crea un grupo "Farmacias". ¿El icono del sidebar y el pin del mapa tienen el mismo color?
    *   [ ] Refresca la página. ¿El color de "Farmacias" sigue siendo el mismo (determinismo)?
2.  **Creación Manual:**
    *   [ ] Pulsa "+ Añadir". ¿Se abre el modal vacío?
    *   [ ] Escribe un grupo nuevo "Gimnasio". ¿Se crea el grupo con un color asignado automáticamente?
    *   [ ] ¿El pin aparece en el centro del mapa?
3.  **Inbox:**
    *   [ ] Las notas sin grupo deben tener el color Gris (definido para Inbox) y agruparse correctamente.

---

¿Te parece bien este plan? Si estás listo, puedes empezar por el **Módulo 1 (lib/colors.ts)** para definir la paleta y ver cómo tu mapa cobra vida.
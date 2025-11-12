// components/Sidebar.tsx

"use client";

import { type FC } from "react";

/**
 * Representa una ubicación guardada por el usuario.
 * @property name - Nombre identificativo de la ubicación
 * @property description - Descripción breve del lugar
 * @property address - Dirección postal completa
 * @todo Añadir `id: string` y `coordinates?: { lat: number; lng: number }` en Hito 2
 */
interface Location {
  name: string;
  description: string;
  address: string;
}

/**
 * Datos de ejemplo para visualización durante la fase de maquetación estática.
 * Serán reemplazados por datos dinámicos desde Zustand en el Hito 2.
 */
const initialLocations: Location[] = [
  {
    name: "Torre Eiffel",
    description: "Monumento icónico en París",
    address: "Champ de Mars, 5 Av. Anatole France",
  },
  {
    name: "Coliseo Romano",
    description: "Anfiteatro antiguo en Roma",
    address: "Piazza del Colosseo, 1",
  },
  {
    name: "Estatua de la Libertad",
    description: "Un regalo de Francia a los EE.UU.",
    address: "Liberty Island, New York",
  },
  {
    name: "Ferretería Guanarteme",
    description: "Ferretería con productos para el hogar",
    address: "Calle Fernando Guanarteme, 18",
  },
] as const;

/**
 * Clases de estilo reutilizables para mantener consistencia visual.
 */
const STYLES = {
  container: "w-96 bg-gray-800 text-white p-4 flex flex-col h-screen",
  header: "mb-4",
  title: "text-2xl font-bold mb-4",
  searchInput:
    "w-full p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
  listContainer: "flex-grow overflow-y-auto pr-2",
  list: "space-y-3",
  listItem:
    "bg-gray-700 p-3 rounded-lg flex justify-between items-start hover:bg-gray-650 transition-colors",
  locationContent: "flex-1 min-w-0",
  locationName: "font-semibold text-base",
  locationDescription: "text-sm text-gray-400 mt-1",
  locationAddress: "text-xs text-gray-500 mt-1",
  deleteButton:
    "text-gray-400 hover:text-red-400 text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2",
  actionsContainer: "mt-4 pt-4 border-t border-gray-700 space-y-2",
  primaryButton:
    "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
  secondaryButtonGroup: "flex gap-2",
  secondaryButton:
    "flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400",
} as const;

/**
 * Componente Sidebar - Panel lateral izquierdo con lista de direcciones guardadas.
 *
 * @component
 * @description
 * Muestra una lista scrolleable de ubicaciones guardadas con:
 * - Búsqueda por nombre
 * - Botón de eliminación por ubicación
 * - Acciones para añadir, importar y exportar direcciones
 *
 * @example
 * ```tsx
 * <Sidebar />
 * ```
 *
 * @remarks
 * - Fase actual: Maquetación estática (Hito 1)
 * - Próxima fase: Integración con Zustand para gestión de estado (Hito 2)
 */
const Sidebar: FC = () => {
  /**
   * @todo Implementar en Hito 2:
   * - const [searchQuery, setSearchQuery] = useState('')
   * - const { locations, deleteLocation } = useLocationStore()
   * - Lógica de filtrado de búsqueda
   */

  return (
    <aside className="w-96 bg-gray-800 text-white p-4 flex flex-col h-screen flex-shrink-0">
      {/* Encabezado y Búsqueda */}
      <header className={STYLES.header}>
        <h2 className={STYLES.title} id="sidebar-title">
          Mis Direcciones
        </h2>
        <label htmlFor="search-input" className="sr-only">
          Buscar direcciones por nombre
        </label>
        <input
          id="search-input"
          type="search"
          placeholder="Buscar por nombre..."
          className={STYLES.searchInput}
          onChange={() => {}} // Preparado para: setSearchQuery(e.target.value)
          aria-describedby="sidebar-title"
        />
      </header>

      {/* Lista de Ubicaciones */}
      <nav
        className={STYLES.listContainer}
        aria-label="Lista de direcciones guardadas"
      >
        <ul className={STYLES.list} role="list">
          {initialLocations.map((location, index) => (
            <li key={`${location.name}-${index}`} className={STYLES.listItem}>
              <div className={STYLES.locationContent}>
                <h3 className={STYLES.locationName}>{location.name}</h3>
                <p className={STYLES.locationDescription}>
                  {location.description}
                </p>
                <address
                  className={STYLES.locationAddress}
                  style={{ fontStyle: "normal" }}
                >
                  {location.address}
                </address>
              </div>

              <button
                className={STYLES.deleteButton}
                aria-label={`Eliminar ${location.name} de la lista`}
                onClick={() => {}}
                type="button"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Botones de Acción */}
      <footer className={STYLES.actionsContainer}>
        <button
          className={STYLES.primaryButton}
          onClick={() => {}}
          type="button"
          aria-label="Añadir una nueva dirección"
        >
          + Añadir Nueva Dirección
        </button>

        <div className={STYLES.secondaryButtonGroup}>
          <button
            className={STYLES.secondaryButton}
            onClick={() => {}}
            type="button"
            aria-label="Importar direcciones desde archivo"
          >
            Importar
          </button>
          <button
            className={STYLES.secondaryButton}
            onClick={() => {}}
            type="button"
            aria-label="Exportar direcciones a archivo"
          >
            Exportar
          </button>
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;

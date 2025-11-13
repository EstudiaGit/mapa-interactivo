// components/Sidebar.tsx

"use client";

import { type FC } from "react";

// Interfaz para el tipado fuerte de nuestras ubicaciones
interface Location {
  name: string;
  description: string;
  address: string;
}

// Datos de ejemplo para la fase de maquetación estática
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
];

// Nuevas props para controlar la visibilidad en dispositivos móviles
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`
        absolute top-0 left-0 h-full w-80 bg-gray-800 p-4 text-white
        md:relative md:w-96
        z-40 flex flex-col
        flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
      aria-hidden={
        !isOpen && typeof window !== "undefined" && window.innerWidth < 768
      }
    >
      {/* Encabezado con título y botón de cierre para móvil */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Mis Direcciones</h2>
        <button
          onClick={onClose}
          className="md:hidden text-gray-400 hover:text-white text-2xl"
          aria-label="Cerrar menú"
        >
          &times;
        </button>
      </div>

      {/* Campo de Búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="w-full p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
        onChange={() => {}} // Preparado para funcionalidad futura
      />

      {/* Lista de Ubicaciones */}
      <div className="mt-4 flex-grow overflow-y-auto pr-2">
        <ul className="space-y-3">
          {initialLocations.map((location, index) => (
            <li
              key={index} // Se cambiará por un ID único en el Hito 2
              className="bg-gray-700 p-3 rounded-lg flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold">{location.name}</h3>
                <p className="text-sm text-gray-400">{location.description}</p>
                <p className="text-xs text-gray-500 mt-1">{location.address}</p>
              </div>
              <button
                className="text-gray-400 hover:text-white text-xl"
                aria-label={`Eliminar ${location.name}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Botones de Acción */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2">
          + Añadir Nueva Dirección
        </button>
        <div className="flex space-x-2">
          <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
            Importar
          </button>
          <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
            Exportar
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

// components/Map.tsx

"use client";

import { type FC } from "react";
import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="text-gray-400 text-center">
      <svg
        className="w-24 h-24 mx-auto mb-4 opacity-50 animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
      <p className="text-sm mt-2">Cargando mapa...</p>
    </div>
  ),
});

/**
 * Componente Map - Contenedor del mapa interactivo.
 *
 * @component
 * @description
 * Placeholder para el mapa de Leaflet que se integrará en el Hito 2.
 * Actualmente muestra un área visual que ocupará todo el espacio disponible
 * en el centro del layout.
 *
 * @example
 * ```tsx
 * <Map />
 * ```
 *
 * @remarks
 * - Fase actual: Placeholder visual (Hito 1)
 * - Próxima fase: Integración con react-leaflet y gestión de markers (Hito 2)
 *
 * @todo Hito 2:
 * - Integrar react-leaflet con MapContainer
 * - Añadir markers dinámicos desde Zustand
 * - Implementar eventos de click en el mapa
 * - Añadir controles de zoom y capas
 */
const Map: FC = () => {
  return (
    <main
      className="flex-grow h-screen bg-gray-600 z-0"
      role="main"
      aria-label="Área del mapa interactivo"
    >
      <MapLeaflet />
    </main>
  );
};

export default Map;

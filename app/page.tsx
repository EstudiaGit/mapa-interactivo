// app/page.tsx

import { type FC } from "react";
import Sidebar from "@/components/Sidebar";
import Map from "@/components/Map";
import ChatWindow from "@/components/ChatWindow";
import "./globals.css";

/**
 * Página principal de la aplicación.
 *
 * @component
 * @description
 * Orquesta el layout principal de la aplicación, disponiendo los componentes
 * Sidebar, Map y ChatWindow en una estructura de dos columnas con un chat flotante.
 *
 * @example
 * ```tsx
 * <HomePage />
 * ```
 *
 * @remarks
 * - Fase actual: Maquetación estática (Hito 1)
 * - Próxima fase: Integración con Zustand y react-leaflet (Hito 2)
 *
 * @todo Hito 2:
 * - Añadir gestión de estado global con Zustand
 * - Conectar Sidebar con Map para sincronización de ubicaciones
 * - Implementar interacción entre componentes
 */
const HomePage: FC = () => {
  return (
    // Usamos un Fragmento para agrupar los elementos sin añadir un nodo extra al DOM
    <>
      <div
        className="flex h-screen bg-gray-900"
        role="application"
        aria-label="Aplicación de gestión de direcciones"
      >
        <Sidebar />
        <Map />
      </div>
      {/* El ChatWindow ahora está fuera del contenedor flex, por lo que puede flotar libremente */}
      <ChatWindow />
    </>
  );
};

export default HomePage;

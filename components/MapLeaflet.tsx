"use client";

import "leaflet/dist/leaflet.css"; // estilos de Leaflet solo en el cliente
import { MapContainer, TileLayer } from "react-leaflet";
import { type FC, useEffect, useId, useState } from "react";

const DEFAULT_CENTER: [number, number] = [28.1235, -15.4363]; // Las Palmas de Gran Canaria, como ejemplo
const DEFAULT_ZOOM = 12;

const MapLeaflet: FC = () => {
  const [mounted, setMounted] = useState(false);
  const mapKey = useId();

  useEffect(() => {
    setMounted(true);
    return () => {
      // forzar limpieza en hot-reload si fuese necesario
    };
  }, []);

  if (!mounted) return null;

  return (
    <MapContainer
      key={mapKey}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full"
      scrollWheelZoom
      preferCanvas
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default MapLeaflet;

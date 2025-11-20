"use client";

import "leaflet/dist/leaflet.css"; // estilos de Leaflet solo en el cliente
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, CircleMarker } from "react-leaflet";
import { type FC, Fragment, useEffect, useId, useState, useRef } from "react";
import { useMapStore } from "@/hooks/useMapStore";
import AddMarkerModal from "./AddMarkerModal";
import L from "leaflet";

// Asegurar iconos por defecto de Leaflet desde /public
L.Icon.Default.mergeOptions({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
});

const DEFAULT_CENTER: [number, number] = [28.1235, -15.4363]; // Las Palmas de Gran Canaria, como ejemplo
const DEFAULT_ZOOM = 12;

function InvalidateOnSidebarChange({ open }: { open?: boolean }) {
  const map = useMap();
  useEffect(() => {
    // pequeño retraso para permitir terminar la animación del sidebar
    const t = setTimeout(() => map.invalidateSize(), 160);
    return () => clearTimeout(t);
  }, [open, map]);
  return null;
}

function MapEventBinder({
  onDoubleClick,
}: {
  onDoubleClick: (lat: number, lng: number) => void;
}) {
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);

  useMapEvents({
    dblclick(e) {
      const { lat, lng } = e.latlng;
      onDoubleClick(lat, lng);
    },
    moveend(e) {
      const c = e.target.getCenter();
      const z = e.target.getZoom();
      setCenter(c.lat, c.lng);
      setZoom(z);
    },
  });
  return null;
}

function SelectedMarkerFollower() {
  const map = useMap();
  const selectedId = useMapStore((s) => s.selectedId);
  const markers = useMapStore((s) => s.markers);

  useEffect(() => {
    if (!selectedId) return;
    const m = markers.find((x) => x.id === selectedId);
    if (!m) return;
    const targetZoom = Math.max(map.getZoom(), 14);
    map.flyTo([m.coordinates.lat, m.coordinates.lng], targetZoom, { duration: 0.5 });
  }, [selectedId, markers, map]);
  return null;
}

function CenterZoomFollower() {
  const map = useMap();
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);

  useEffect(() => {
    if (!center) return;
    const current = map.getCenter();
    const currentZoom = map.getZoom();
    const targetZoom = typeof zoom === "number" ? zoom : currentZoom;
    const eps = 1e-7;
    const sameCenter = Math.abs(current.lat - center.lat) < eps && Math.abs(current.lng - center.lng) < eps;
    const sameZoom = Math.abs(currentZoom - targetZoom) < eps;
    if (sameCenter && sameZoom) return;
    map.flyTo([center.lat, center.lng], targetZoom, { duration: 0.5 });
  }, [center, zoom, map]);
  return null;
}

type MapLeafletProps = { sidebarOpen?: boolean };

const MapLeaflet: FC<MapLeafletProps> = ({ sidebarOpen }) => {
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCoordinates, setPendingCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapKey = useId();

  const markers = useMapStore((s) => s.markers);
  const selectedId = useMapStore((s) => s.selectedId);
  const addMarker = useMapStore((s) => s.addMarker);
  const selectMarker = useMapStore((s) => s.selectMarker);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const persistedCenter = useMapStore((s) => s.center);
  const persistedZoom = useMapStore((s) => s.zoom);

  // Evitar setState directo en effect - usar patrón de inicialización
  useEffect(() => {
    // Este efecto solo actualiza mounted una vez al montar
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Establecer estado inicial de vista en la store al montar el mapa,
  // respetando valores persistidos si existen
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!mounted || initializedRef.current) return;
    initializedRef.current = true;
    if (persistedCenter) {
      setCenter(persistedCenter.lat, persistedCenter.lng);
    } else {
      setCenter(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
    }
    if (typeof persistedZoom === "number") {
      setZoom(persistedZoom);
    } else {
      setZoom(DEFAULT_ZOOM);
    }
  }, [mounted, setCenter, setZoom, persistedCenter, persistedZoom]);

  const handleDoubleClick = (lat: number, lng: number) => {
    setPendingCoordinates({ lat, lng });
    setModalOpen(true);
  };

  const handleModalConfirm = (data: {
    name: string;
    address: string;
    description: string;
    CP: string;
    coordinates: { lat: number; lng: number };
  }) => {
    const id = addMarker(data);
    selectMarker(id);
    setModalOpen(false);
    setPendingCoordinates(null);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setPendingCoordinates(null);
  };

  if (!mounted) return null;

  return (
    <>
      <AddMarkerModal
        isOpen={modalOpen}
        coordinates={pendingCoordinates}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
      <MapContainer
        key={mapKey}
        center={persistedCenter ? [persistedCenter.lat, persistedCenter.lng] : DEFAULT_CENTER}
        zoom={typeof persistedZoom === "number" ? persistedZoom : DEFAULT_ZOOM}
        className="w-full h-full"
        scrollWheelZoom
        preferCanvas
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEventBinder onDoubleClick={handleDoubleClick} />
      <SelectedMarkerFollower />
      <CenterZoomFollower />
      <InvalidateOnSidebarChange open={sidebarOpen} />

      {markers.map((m) => {
        const selectMarkerFn = useMapStore.getState().selectMarker;
        return (
          <Fragment key={m.id}>
            <Marker
              position={[m.coordinates.lat, m.coordinates.lng]}
              zIndexOffset={selectedId === m.id ? 1000 : 0}
              eventHandlers={{
                click: () => {
                  selectMarkerFn(m.id);
                },
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{m.name || "(Sin título)"}</strong>
                  <br />
                  <span className="text-gray-600">
                    {m.coordinates.lat.toFixed(5)}, {m.coordinates.lng.toFixed(5)}
                  </span>
                  {m.address && (
                    <>
                      <br />
                      <span className="text-gray-700">{m.address}</span>
                    </>
                  )}
                  {m.description && (
                    <>
                      <br />
                      <span className="text-gray-600 italic text-xs">{m.description}</span>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
            {selectedId === m.id && (
              <CircleMarker
                center={[m.coordinates.lat, m.coordinates.lng]}
                radius={14}
                pathOptions={{ color: "#3b82f6", weight: 3, fill: false }}
              />
            )}
          </Fragment>
        );
      })}
      </MapContainer>
    </>
  );
};

export default MapLeaflet;

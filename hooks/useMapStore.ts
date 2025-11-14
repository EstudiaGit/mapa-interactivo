// Esqueleto de store para el mapa (Zustand)
// Nota: instala la dependencia antes de usarlo:
//   npm install zustand

import { create } from "zustand";

export type MarkerId = string;

export type MapMarker = {
  id: MarkerId;
  lat: number;
  lng: number;
  title?: string;
};

export type MapState = {
  markers: MapMarker[];
  selectedId: MarkerId | null;
  // view state (opcional)
  center: { lat: number; lng: number } | null;
  zoom: number | null;

  // actions
  addMarker: (marker: Omit<MapMarker, "id"> & { id?: MarkerId }) => MarkerId;
  removeMarker: (id: MarkerId) => void;
  renameMarker: (id: MarkerId, title: string) => void;
  setCenter: (lat: number, lng: number) => void;
  setZoom: (zoom: number) => void;
  selectMarker: (id: MarkerId | null) => void;
  clear: () => void;
};

function genId(): MarkerId {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback
  return `m_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export const useMapStore = create<MapState>((set, get) => ({
  markers: [],
  selectedId: null,
  center: null,
  zoom: null,

  addMarker: (marker) => {
    const id = marker.id ?? genId();
    const newMarker: MapMarker = { id, lat: marker.lat, lng: marker.lng, title: marker.title };
    set((s) => ({ markers: [...s.markers, newMarker] }));
    return id;
  },

  removeMarker: (id) => set((s) => ({
    markers: s.markers.filter((m) => m.id !== id),
    selectedId: s.selectedId === id ? null : s.selectedId,
  })),

  renameMarker: (id, title) => set((s) => ({
    markers: s.markers.map((m) => (m.id === id ? { ...m, title } : m)),
  })),

  setCenter: (lat, lng) => set({ center: { lat, lng } }),
  setZoom: (zoom) => set({ zoom }),
  selectMarker: (id) => set({ selectedId: id }),
  clear: () => set({ markers: [], selectedId: null }),
}));

// Sugerencias de integración (próxima sesión):
// - En MapLeaflet: usar useMapEvents para onClick añadir marker con addMarker.
// - En Sidebar: leer markers desde useMapStore((s) => s.markers) y togglear selectMarker.
// - Para centrar el mapa al seleccionar: en MapLeaflet, usar un efecto que observe selectedId/center.

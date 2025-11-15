// Esqueleto de store para el mapa (Zustand)
// Nota: instala la dependencia antes de usarlo:
//   npm install zustand

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type MarkerId = string;

export type Coordinates = { lat: number; lng: number };

export type AddressEntry = {
  id: MarkerId;
  name: string;
  description: string;
  address: string;
  CP: string;
  coordinates: Coordinates;
};

export type MapState = {
  markers: AddressEntry[];
  selectedId: MarkerId | null;
  // view state (opcional)
  center: { lat: number; lng: number } | null;
  zoom: number | null;

  // actions
  addMarker: (entry: Omit<AddressEntry, "id"> & { id?: MarkerId }) => MarkerId;
  removeMarker: (id: MarkerId) => void;
  renameMarker: (id: MarkerId, name: string) => void; // renombrar por "name"
  updateMarker: (id: MarkerId, patch: Partial<Pick<AddressEntry, "name" | "description" | "address" | "CP">>) => void;
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

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      markers: [],
      selectedId: null,
      center: null,
      zoom: null,

      addMarker: (entry) => {
        const id = entry.id ?? genId();
        const newEntry: AddressEntry = {
          id,
          name: entry.name,
          description: entry.description,
          address: entry.address,
          CP: entry.CP,
          coordinates: entry.coordinates,
        };
        set((s) => ({ markers: [...s.markers, newEntry] }));
        return id;
      },

      removeMarker: (id) => set((s) => ({
        markers: s.markers.filter((m) => m.id !== id),
        selectedId: s.selectedId === id ? null : s.selectedId,
      })),

      renameMarker: (id, name) => set((s) => ({
        markers: s.markers.map((m) => (m.id === id ? { ...m, name } : m)),
      })),

      updateMarker: (id, patch) => set((s) => ({
        markers: s.markers.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      })),

      setCenter: (lat, lng) => set({ center: { lat, lng } }),
      setZoom: (zoom) => set({ zoom }),
      selectMarker: (id) => set({ selectedId: id }),
      clear: () => set({ markers: [], selectedId: null }),
    }),
    {
      name: "map-store",
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        markers: state.markers,
        selectedId: state.selectedId,
        center: state.center,
        zoom: state.zoom,
      }),
      migrate: (persistedState: unknown, version) => {
        if (!persistedState || typeof persistedState !== 'object') return persistedState as MapState;
        const state = persistedState as Record<string, unknown>;
        if (version < 2 && Array.isArray(state.markers)) {
          // Transformar del esquema antiguo {id, lat, lng, title?} al nuevo AddressEntry
          const migrated = {
            ...state,
            markers: state.markers.map((m: Record<string, unknown>) => ({
              id: m.id ?? genId(),
              name: m.title ?? "(Sin título)",
              description: "",
              address: "",
              CP: "",
              coordinates: { lat: m.lat, lng: m.lng },
            })),
          };
          return migrated;
        }
        // v2 -> v3: simplemente asegurar que center/zoom existan o queden como están
        return persistedState as MapState;
      },
    }
  )
);

// Sugerencias de integración (próxima sesión):
// - En MapLeaflet: usar useMapEvents para onClick añadir marker con addMarker.
// - En Sidebar: leer markers desde useMapStore((s) => s.markers) y togglear selectMarker.
// - Para centrar el mapa al seleccionar: en MapLeaflet, usar un efecto que observe selectedId/center.
